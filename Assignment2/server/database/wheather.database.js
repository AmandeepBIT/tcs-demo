const sql = require("mssql");
const constants = require("../utility/wheather.constant");
const { dbDataType } = require("../utility/enum");

const dbRequest = async (procedure, param, callback) => {
  const pool = new sql.ConnectionPool(constants.CONFIG);
  pool.on("error", (err) => {
    const res = { status: false, err };
    return callback(res);
  });
  try {
    await pool.connect();
    const request = new sql.Request(pool);
    if (param && param.length > 0) {
      param.forEach((element) => {
        request.input(element.key, getDataType(element.type), element.value);
      });
    }
    const result = await request.execute(procedure);
    const res = { status: true, data: result.recordset };
    return callback(res);
  } catch (err) {
    if (err) {
      const res = { status: false, err };
      return callback(res);
    }
  } finally {
    pool.close();
  }
};

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
