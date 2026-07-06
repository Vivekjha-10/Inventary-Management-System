const { StatusCodes } = require("http-status-codes");
const { mysqlConnection } = require("../../../../database/mysql.connection");
const { logGeneralData, logExceptions } = require("../../../../shared/log");

class UserDatabase {
  async signUp(info) {
    try {
      //logGeneralData('Sign Up before database has been call - ', info)
      const sqlProcedureCall = `call signUp(?, ?, ?)`;
      const userDetails = await mysqlConnection(sqlProcedureCall, [
        info.fullname,
        info.email,
        info.password
      ]);
      
      let user = {};
      if (typeof userDetails !== "undefined" && typeof userDetails[0] !== "undefined" && typeof userDetails[0][0] !== "undefined") {
        //logGeneralData('Sign Up after database has been call - ', userDetails[0][0])
        user = userDetails[0][0];
        user["error"] = false;
        user["code"] = '000';
      }
      else{
        user["error"] = true;
        user["code"] = '024';
      }
      return user;
    } catch (error) {
      logExceptions('Sign Up database fetch issue - ', error)
      return { error: true, code: '011' }
    }
  }

  async getUser(info) {
    try {
      //logGeneralData('Log In before database has been call - ', info)
      const sqlProcedureCall = `call getUser(?)`;
      const userDetails = await mysqlConnection(sqlProcedureCall, [
        info.email
      ]);
      
      let user = {};
      if (typeof userDetails !== "undefined" && typeof userDetails[0] !== "undefined" && typeof userDetails[0][0] !== "undefined") {
        //logGeneralData('logIn after database has been call - ', JSON.parse(userDetails[0][0].result))
        user = JSON.parse(userDetails[0][0].result);
        user["error"] = false;
        user["code"] = '000';
      }
      else{
        user["error"] = true;
        user["code"] = '020';
      }
      return user;
    } catch (error) {
      logExceptions('Log In database fetch issue - ', error)
      return { error: true, code: '011' }
    }
  }
}

module.exports = {
  userDatabase: new UserDatabase()
};
