'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Inquiry = mongoose.model('Inquiry'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, inquiry;

/**
 * Inquiry routes tests
 */
describe('Inquiry CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Inquiry
    user.save(function () {
      inquiry = {
        name: 'Inquiry name'
      };

      done();
    });
  });

  it('should be able to save a Inquiry if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Inquiry
        agent.post('/api/inquiries')
          .send(inquiry)
          .expect(200)
          .end(function (inquirySaveErr, inquirySaveRes) {
            // Handle Inquiry save error
            if (inquirySaveErr) {
              return done(inquirySaveErr);
            }

            // Get a list of Inquiries
            agent.get('/api/inquiries')
              .end(function (inquirysGetErr, inquirysGetRes) {
                // Handle Inquiry save error
                if (inquirysGetErr) {
                  return done(inquirysGetErr);
                }

                // Get Inquiries list
                var inquiries = inquiriesGetRes.body;

                // Set assertions
                (inquiries[0].user._id).should.equal(userId);
                (inquiries[0].name).should.match('Inquiry name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Inquiry if not logged in', function (done) {
    agent.post('/api/inquiries')
      .send(inquiry)
      .expect(403)
      .end(function (inquirySaveErr, inquirySaveRes) {
        // Call the assertion callback
        done(inquirySaveErr);
      });
  });

  it('should not be able to save an Inquiry if no name is provided', function (done) {
    // Invalidate name field
    inquiry.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Inquiry
        agent.post('/api/inquiries')
          .send(inquiry)
          .expect(400)
          .end(function (inquirySaveErr, inquirySaveRes) {
            // Set message assertion
            (inquirySaveRes.body.message).should.match('Please fill Inquiry name');

            // Handle Inquiry save error
            done(inquirySaveErr);
          });
      });
  });

  it('should be able to update an Inquiry if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Inquiry
        agent.post('/api/inquiries')
          .send(inquiry)
          .expect(200)
          .end(function (inquirySaveErr, inquirySaveRes) {
            // Handle Inquiry save error
            if (inquirySaveErr) {
              return done(inquirySaveErr);
            }

            // Update Inquiry name
            inquiry.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Inquiry
            agent.put('/api/inquiries/' + inquirySaveRes.body._id)
              .send(inquiry)
              .expect(200)
              .end(function (inquiryUpdateErr, inquiryUpdateRes) {
                // Handle Inquiry update error
                if (inquiryUpdateErr) {
                  return done(inquiryUpdateErr);
                }

                // Set assertions
                (inquiryUpdateRes.body._id).should.equal(inquirySaveRes.body._id);
                (inquiryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Inquiries if not signed in', function (done) {
    // Create new Inquiry model instance
    var inquiryObj = new Inquiry(inquiry);

    // Save the inquiry
    inquiryObj.save(function () {
      // Request Inquiries
      request(app).get('/api/inquiries')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Inquiry if not signed in', function (done) {
    // Create new Inquiry model instance
    var inquiryObj = new Inquiry(inquiry);

    // Save the Inquiry
    inquiryObj.save(function () {
      request(app).get('/api/inquiries/' + inquiryObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', inquiry.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Inquiry with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/inquiries/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Inquiry is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Inquiry which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Inquiry
    request(app).get('/api/inquiries/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Inquiry with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Inquiry if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Inquiry
        agent.post('/api/inquiries')
          .send(inquiry)
          .expect(200)
          .end(function (inquirySaveErr, inquirySaveRes) {
            // Handle Inquiry save error
            if (inquirySaveErr) {
              return done(inquirySaveErr);
            }

            // Delete an existing Inquiry
            agent.delete('/api/inquiries/' + inquirySaveRes.body._id)
              .send(inquiry)
              .expect(200)
              .end(function (inquiryDeleteErr, inquiryDeleteRes) {
                // Handle inquiry error error
                if (inquiryDeleteErr) {
                  return done(inquiryDeleteErr);
                }

                // Set assertions
                (inquiryDeleteRes.body._id).should.equal(inquirySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Inquiry if not signed in', function (done) {
    // Set Inquiry user
    inquiry.user = user;

    // Create new Inquiry model instance
    var inquiryObj = new Inquiry(inquiry);

    // Save the Inquiry
    inquiryObj.save(function () {
      // Try deleting Inquiry
      request(app).delete('/api/inquiries/' + inquiryObj._id)
        .expect(403)
        .end(function (inquiryDeleteErr, inquiryDeleteRes) {
          // Set message assertion
          (inquiryDeleteRes.body.message).should.match('User is not authorized');

          // Handle Inquiry error error
          done(inquiryDeleteErr);
        });

    });
  });

  it('should be able to get a single Inquiry that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Inquiry
          agent.post('/api/inquiries')
            .send(inquiry)
            .expect(200)
            .end(function (inquirySaveErr, inquirySaveRes) {
              // Handle Inquiry save error
              if (inquirySaveErr) {
                return done(inquirySaveErr);
              }

              // Set assertions on new Inquiry
              (inquirySaveRes.body.name).should.equal(inquiry.name);
              should.exist(inquirySaveRes.body.user);
              should.equal(inquirySaveRes.body.user._id, orphanId);

              // force the Inquiry to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Inquiry
                    agent.get('/api/inquiries/' + inquirySaveRes.body._id)
                      .expect(200)
                      .end(function (inquiryInfoErr, inquiryInfoRes) {
                        // Handle Inquiry error
                        if (inquiryInfoErr) {
                          return done(inquiryInfoErr);
                        }

                        // Set assertions
                        (inquiryInfoRes.body._id).should.equal(inquirySaveRes.body._id);
                        (inquiryInfoRes.body.name).should.equal(inquiry.name);
                        should.equal(inquiryInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Inquiry.remove().exec(done);
    });
  });
});
