/* eslint-disable no-undef */
const { expect } = require("chai");
const chai = require("chai");
const fs = require("fs");
const chaiHttp = require("chai-http");
const { StatusCodes } = require("http-status-codes");
const server = require("../../index");
const servicesFunc = require("../services/server.service");
const assert = require("assert");
const path = require("path");
chai.should();
chai.use(chaiHttp);

describe("test case for findServer function", () => {});

describe("Test Case Get Online Server", () => {
  it("Test if path is not correct ", (done) => {
    chai
      .request(server)
      .get("/servers")
      .end((_err, Response) => {
        expect(Response.status).to.be.equal(StatusCodes.NOT_FOUND);
        done();
      });
  });
  it("Test Get Online Server If Success ", (done) => {
    chai
      .request(server)
      .get("/server")
      .end((_err, Response) => {
        expect(Response.status).to.be.equal(StatusCodes.OK);
        return done();
      });
  });

  it("Check server list exists or not ", (done) => {
    const file = path.join(__dirname, "/mockData/mock.json");
    let result = fs.readFileSync(file);
    const expectedResult = servicesFunc.isDataExits(result);
    if (result && result.length > 0) {
      result = JSON.parse(result);
    }
    assert.deepEqual(result, expectedResult);
    return done();
  });

  it("Check server list is undefined ", (done) => {
    const expectedResult = servicesFunc.isDataExits([]);
    assert.deepEqual(expectedResult, undefined);
    return done();
  });

  it("Get Online server list ", async () => {
    const mockData = [{
      url: "http://www.google.com",
      priority: 1
    }
    ];
    const res = await servicesFunc.getServerList(mockData);
    if (res && res.length > 0) {
      assert.deepEqual(res, mockData);
    }
  });

  it("Get Offline server list ", async () => {
    const mockData = [{
      url: "http://doesNotExist.boldtech.co",
      priority: 1
    }
    ];
    const res = await servicesFunc.getServerList(mockData);
    expect(res).to.deep.equal([]);
  });

  it("Sort the server based on priority ", async () => {
    const mockData = [
      {
        url: "http://doesNotExist.boldtech.co",
        priority: 1
      },
      {
        url: "http://boldtech.co",
        priority: 7
      }
    ];
    const sortedData = servicesFunc.sortArray(mockData);
    expect(sortedData).to.deep.equal(mockData);
  });
});
