const { StatusCodes } = require("http-status-codes");
const { dbRequest } = require("../database/wheather.database");
const { dbProcedures, dbDataType } = require("../utility/enum");
const { callWheatherAPI } = require("../services/wheater.services");
const logger = require("../utility/logger");

/** This function is responsible to get the wheather based on cities only
 *
 * @param {*} req; // We can catch the params here from the req
 * @param {*} res; // res will catch the response at the end after getting resonse or error
 * @param {*} next;
 * @returns
 */
const getWheather = async (req, res, next) => {
  // Fetching the city from the query params
  const { city } = req.query;

  // If there is no city in query params then need to throw readable error
  if (!city) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      status: false,
      message: "City is missing"
    });
  }

  try {
    const prepareRequest = [];
    /**
     * We need to first check from the database.
     * If we already have the latest data as per requested city in database then we will fetch it
     * Preparing the requests for MSSQL server, so we can call the Stored Procedures
     */
    prepareRequest.push(prepareRequestObject("city", dbDataType.VARCHAR, city));

    // Call MSSQL server to get the wheather from the database as per requested city
    await dbRequest(
      dbProcedures.GET_WHEATHER,
      prepareRequest,
      async function (handleResponse) { // Handling the call back.
        // Lets check wheather DB returns the data or not
        if (
          handleResponse &&
          handleResponse.data &&
          handleResponse.data.length > 0
        ) {
          // Check DB data is latest or not
          if (isRecordlatest(handleResponse.data[0].createdAt) === true) {
            // Updating the logs
            logger.updateLog({ Source: "Local DB", data: handleResponse });
            return res.status(StatusCodes.OK).send({
              status: true,
              response: handleResponse
            });
          }
        } else if (handleResponse && handleResponse.status === false) { // Catching the error from DB here
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: false,
            response: "DB Connectivity issue"
          });
        }
        // Call Wheather API
        const response = await callWheatherAPI(city);
        if (!response) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            status: false,
            response: `No city found with name ${city}`
          });
        }
        // Insert new whather in DB
        const latestData = await addLatestWheather(response);

        // Update the log
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

// Check DB wheather data is latest or not. We are checking based on 20 seconds.
function isRecordlatest (oldRecordTime) {
  const currentDateTime = new Date();
  const difference = (currentDateTime - oldRecordTime) / 1000;
  if (difference <= process.env.WHEATHER_API_CALL_DURATION) {
    return true;
  }
  return false;
}

// Add new wheather data inside database, so we can fetch for future references
async function addLatestWheather (response) {
  if (!response) {
    return undefined;
  }

  // Preparing the request for Stored Procedures
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

  // Call DB to insert the wheather
  return await dbRequest(
    dbProcedures.ADD_WHEATHER,
    prepareRequest,
    async function (handleResponse) {
      return handleResponse;
    }
  );
}

// This is the generic kind of method to prepare the request methods for database
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
