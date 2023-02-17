/* eslint-disable no-undef */
const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { StatusCodes } = require("http-status-codes");
const server = require("../../index");
const contreollerFunc = require("../controllers/wheather.controller");
chai.should();
chai.use(chaiHttp);

describe("Custome methods", () => {
  it("Check if last fetch record is more than 20 seconds", (done) => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const expectedResult = contreollerFunc.isRecordlatest(date);
    expect(expectedResult).to.be.false();
    done();
  });

  it("Check if last fetch record is less than 20 seconds", (done) => {
    const date = new Date();
    const expectedResult = contreollerFunc.isRecordlatest(date);
    expect(expectedResult).to.be.true();
    done();
  });
});

// API TEST CASES
describe("Test Case Incorrect Url", () => {
  it("Test if url is incorrect", (done) => {
    chai
      .request(server)
      .get("/api/bycitys")
      .end((err, Response) => {
        if (err) {
          console.log("Error occurred", err);
        }
        expect(Response.status).to.be.equal(StatusCodes.NOT_FOUND);
        done();
      });
  });
});

describe("Test Case correct Url", () => {
  it("Test if url is correct", (done) => {
    chai
      .request(server)
      .get("/api/bycity?city=ludhiana")
      .end((err, Response) => {
        if (err) {
          console.log("Error occurred", err);
        }
        expect(Response.status).to.be.equal(StatusCodes.OK);
        done();
      });
  });
});
