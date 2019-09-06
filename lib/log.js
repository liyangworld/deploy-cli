const logSymbols = require("log-symbols");
const boxen = require("boxen");

const logBoxen = function(msg) {
  console.log(
    boxen(msg, {
      borderStyle: "classic",
      float: "center",
      align: "center",
      padding: {
        top: 1,
        bottom: 1,
        left: 5,
        right: 5
      },
      margin: {
        top: 1,
        bottom: 1
      }
    })
  );
};

module.exports = {
  info: function(msg = "") {
    console.log(logSymbols.info, msg);
  },
  success: function(msg = "") {
    console.log(logSymbols.success, msg);
  },
  warn: function(msg = "") {
    console.log(logSymbols.warning, msg);
  },
  error: function(msg = "") {
    console.log(logSymbols.error, msg);
  },
  boxen: logBoxen,
  boxenSuccess: function(msg) {
    msg = logSymbols.success + " " + msg;
    logBoxen(msg);
  }
};
