const sql = require("mssql");
const constants = require("../utility/wheather.constant");
const { dbDataType } = require("../utility/enum");

// Generic method for MSSQL to perform operation on the database
const dbRequest = async (procedure, param, callback) => {
  // Creating the connection pool
  const pool = new sql.ConnectionPool(constants.CONFIG);
  pool.on("error", (err) => { // Handle the DB based error during connection pool
    const res = { status: false, err };
    return callback(res);
  });
  try {
    // Connect MSSQL server as per configurations
    await pool.connect();

    // Prepare the SQL request
    const request = new sql.Request(pool);
    if (param && param.length > 0) {
      param.forEach((element) => {
        // Append the some extra data with requests
        request.input(element.key, getDataType(element.type), element.value);
      });
    }

    // Call SQL Procedure
    const result = await request.execute(procedure);
    // Handle the result
    const res = { status: true, data: result.recordset };
    return callback(res);
  } catch (err) {
    // Handle the error during SQL opeartions
    if (err) {
      const res = { status: false, err };
      return callback(res);
    }
  } finally {
    // Close the pool/connection everytime for security reasons
    pool.close();
  }
};

// handle the SQL Datatypes during SQL Requests
function getDataType (value) {
  switch (value) {
    case dbDataType.DECIMAL:
      return sql.Decimal;
    case dbDataType.INT:
      return sql.Int;
    case dbDataType.VARCHAR:
      return sql.VarChar;
    case dbDataType.FLOAT:
      return sql.Float;
    default:
      break;
  }
}

module.exports = {
  dbRequest
};
