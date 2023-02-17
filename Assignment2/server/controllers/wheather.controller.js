const { StatusCodes } = require("http-status-codes");
const { dbRequest } = require("../database/wheather.database");
const { dbProcedures, dbDataType } = require("../utility/enum");
const { callWheatherAPI } = require("../services/wheater.services");
const logger = require("../utility/logger");

const getWheather = async (req, res, next) => {
  const { city } = req.query;

  if (!city) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      status: false,
      message: "City is missing"
    });
  }

  try {
    const prepareRequest = [];
    prepareRequest.push(prepareRequestObject("city", dbDataType.VARCHAR, city));
    await dbRequest(
      dbProcedures.GET_WHEATHER,
      prepareRequest,
      async function (handleResponse) {
        if (
          handleResponse &&
          handleResponse.data &&
          handleResponse.data.length > 0
        ) {
          logger.updateLog({ Source: "Local DB", data: handleResponse });
          if (isRecordlatest(handleResponse.data[0].createdAt) === true) {
            return res.status(StatusCodes.OK).send({
              status: true,
              response: handleResponse
            });
          }
        } else if (handleResponse && handleResponse.status === false) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: false,
            response: "DB Connectivity issue"
          });
        }
        const response = await callWheatherAPI(city);
        const latestData = await GetLatestWheather(response);
        if (!latestData) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            status: false,
            response: `No city found with name ${city}`
          });
        }
        logger.updateLog({ Source: "Online Wheather DB", data: latestData });
        return res.status(StatusCodes.OK).send({
          status: true,
          data: latestData
        });
      }
    );
  } catch (err) {
    console.log("createConnectionPool method called error ", err);
  }
};

function isRecordlatest (oldRecordTime) {
  const currentDateTime = new Date();
  const difference = (currentDateTime - oldRecordTime) / 1000;
  if (difference <= process.env.WHEATHER_API_CALL_DURATION) {
    return true;
  }
  return false;
}

async function GetLatestWheather (response) {
  if (!response) {
    return undefined;
  }
  const prepareRequest = [];
  prepareRequest.push(
    prepareRequestObject(
      "placeName",
      dbDataType.VARCHAR,
      response.placeName || ""
    )
  );
  prepareRequest.push(
    prepareRequestObject(
      "countryCode",
      dbDataType.VARCHAR,
      response.countryCode || ""
    )
  );
  prepareRequest.push(
    prepareRequestObject("city", dbDataType.VARCHAR, response.city || "")
  );
  prepareRequest.push(
    prepareRequestObject("state", dbDataType.VARCHAR, response.state || "")
  );
  prepareRequest.push(
    prepareRequestObject("co", dbDataType.DECIMAL, response.CO || 0.0)
  );
  prepareRequest.push(
    prepareRequestObject("no2", dbDataType.DECIMAL, response.NO2 || 0.0)
  );
  prepareRequest.push(
    prepareRequestObject("ozone", dbDataType.DECIMAL, response.OZONE || 0.0)
  );
  prepareRequest.push(
    prepareRequestObject("pm10", dbDataType.DECIMAL, response.PM10 || 0.0)
  );
  prepareRequest.push(
    prepareRequestObject("pm25", dbDataType.DECIMAL, response.PM25 || 0.0)
  );
  prepareRequest.push(
    prepareRequestObject("so2", dbDataType.DECIMAL, response.SO2 || 0.0)
  );

  return await dbRequest(
    dbProcedures.ADD_WHEATHER,
    prepareRequest,
    async function (handleResponse) {
      return handleResponse;
    }
  );
}

function prepareRequestObject (keyValue, dataType, value) {
  return {
    key: keyValue,
    type: dataType,
    value
  };
}

module.exports = {
  getWheather,
  isRecordlatest
};
