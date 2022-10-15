const assert = require("assert");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");

const Driver = mongoose.model("driver");

describe("Drivers controller", () => {
  it("sends a post request to /api/drivers to create a new driver", (done) => {
    Driver.count().then((count) => {
      request(app)
        .post("/api/drivers")
        .send({ email: "test@test.com" })
        .end(() => {
          Driver.count().then((newCount) => {
            assert(count + 1 === newCount);
            done();
          });
        });
    });
  });

  it("sends a PUT request to /api/drivers/id to edit an existing driver", (done) => {
    const driver = new Driver({ email: "test@test.com", driving: false });
    driver.save().then(() => {
      request(app)
        .put(`/api/drivers/${driver._id}`)
        .send({ driving: true })
        .end(() => {
          Driver.findOne({ email: "test@test.com" }).then((driver) => {
            assert(driver.driving === true);
            done();
          });
        });
    });
  });

  it("sends a delete request to /api/drivers/id to delete an existing driver", (done) => {
    const driver = new Driver({ email: "test@test.com", driving: false });
    driver.save().then(() => {
      request(app)
        .delete(`/api/drivers/${driver._id}`)
        .end(() => {
          Driver.findOne({ email: "test@test.com" }).then((driver) => {
            assert(driver === null);
            done();
          });
        });
    });
  });

  it("sends a get request to /api/drivers/ to get nearby driver", (done) => {
    const bangaloreDriver = new Driver({
      email: "bangalore@test.com",
      geometry: { type: "Point", coordinates: [77.5946, 12.9716] },
    });
    const chennaiDriver = new Driver({
      email: "chennai@test.com",
      geometry: { type: "Point", coordinates: [80.2707, 13.0827] },
    });

    Promise.all([bangaloreDriver.save(), chennaiDriver.save()]).then(() => {
      request(app)
        .get(`/api/drivers/?lng=77.5&lat=12.9`)
        .end((err, response) => {
          console.log(response);
          done();
        });
    });
  });
});
