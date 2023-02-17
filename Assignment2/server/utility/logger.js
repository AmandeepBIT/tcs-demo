(function () {
  "use strict";
  const fs = require("fs");
  const winston = require("winston");
  const successLogFileName = "weatherSuccessLog.log";

  const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: successLogFileName,
        level: "info"
      })
    ]
  });
  const winstonlog = function () {
    return {
      updateLog: function (data) {
        // If file not exists then this IF will create new file
        if (!fs.existsSync(successLogFileName)) {
          const consoles = new winston.transports.Console();
          const logFile = new winston.transports.File({
            filename: successLogFileName
          });

          logger.clear();
          logger.add(consoles);
          logger.add(logFile);
          this.loggerFunc(data);
        } else {
          this.loggerFunc(data);
        }
      },

      loggerFunc: function (data) {
        logger.log({
          timestamp: new Date(),
          level: "info",
          message: data
        });
      }
    };
  };

  module.exports = winstonlog();
})();
