/* eslint-disable no-undef */
const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { StatusCodes } = require("http-status-codes");
const server = require("../../index");
const servicFunc = require("../services/user.service");
chai.should();
chai.use(chaiHttp);
const assert = require("assert");

// API TEST CASES
describe("Test Case Incorrect Url", () => {
  it("Test if url is incorrect", (done) => {
    chai
      .request(server)
      .get("/user/")
      .end((err, Response) => {
        if (err) {
          console.log("Error occurred", err);
        }
        expect(Response.status).to.be.equal(StatusCodes.NOT_FOUND);
        done();
      });
  });
});
describe("Custom functions", () => {
  it("Check file reading and parsing working fine ", (done) => {
    const expectedResult = servicFunc.isDataExits([]);
    assert.deepEqual(expectedResult, undefined);
    return done();
  });
});

describe("Test Case Add User", () => {
  it("Test add user success", (done) => {
    chai
      .request(server)
      .post("/user/add")
      .set("content-type", "application/json")
      .send({
        name: "updated name",
        age: "22",
        gender: "Male",
        email: "userone@gmail.com"
      })
      .end((err, Response) => {
        if (err) {
          console.log("Error occurred", err);
        }
        expect(Response.status).to.be.equal(StatusCodes.OK);
        done();
      });
  });

  it("Test add user if body param missing", (done) => {
    chai
      .request(server)
      .post("/user/add")
      .set("content-type", "application/json")
      .send({
        name: "updated name",
        age: "22",
        // "gender": "Male",
        email: "userone@gmail.com"
      })
      .end((err, Response) => {
        if (err) {
          console.log("Error occurred", err);
        }
        expect(Response.status).to.be.equal(StatusCodes.BAD_REQUEST);
        done();
      });
  });
});

describe("Test View User", () => {
  it("Test view user success", (done) => {
    chai
      .request(server)
      .get("/user/view")
      .end((err, Response) => {
        if (err) {
          console.log("Error occurred", err);
        }
        expect(Response.status).to.be.equal(StatusCodes.OK);
        done();
      });
  });

  it("Test view user if user not exist", (done) => {
    chai
      .request(server)
      .get("/user/view?id=150000")
      .end((err, Response) => {
        if (err) {
          console.log("Error occurred", err);
        }
        expect(Response.status).to.be.equal(StatusCodes.NOT_FOUND);
        done();
      });
  });
});

describe("Test update User", () => {
  it("Test update user success", (done) => {
    chai
      .request(server)
      .patch("/user/edit/1")
      .set("content-type", "application/json")
      .send({
        name: "updated name",
        age: "22",
        gender: "Male",
        email: "userone@gmail.com"
      })
      .end((err, Response) => {
        if (err) {
          expect(Response.status).to.be.equal(StatusCodes.NOT_FOUND);
        } else {
          expect(Response.status).to.be.equal(StatusCodes.OK);
        }
        done();
      });
  });

  it("Test update user if user not exist", (done) => {
    chai
      .request(server)
      .patch("/user/edit/15000")
      .set("content-type", "application/json")
      .send({
        name: "updated name",
        age: "22",
        gender: "Male",
        email: "userone@gmail.com"
      })
      .end((err, Response) => {
        if (err) {
          console.log("Error occurred", err);
        }
        expect(Response.status).to.be.equal(StatusCodes.NOT_FOUND);
        done();
      });
  });
});
