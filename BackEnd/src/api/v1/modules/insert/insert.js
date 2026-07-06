const { insertDatabase } = require("./mysql");
const responseHandler = require('../../../../shared/responseManage')
const { logGeneralData, logExceptions } = require('../../../../shared/log')
const errorCodes = require('../../../../constant/errorCode.json');
const xlsx = require('xlsx');

class UploadService {

  /**
   * API for upload new record
   * @param {*} req (json)
   * @param {*} res (json with success/failure)
   */
  async uploadNewRecord(token, fileInfo) {
    try {
      if (
        !token.user_id ||
        !token.fullname
      ) {
        logExceptions("Upload new record service input token error - ", errorCodes['021'].errorMsg)
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Upload New Record",
          DisplayText: errorCodes['021'].errorMsg,
          ErrorCode: errorCodes['021'].errorCode,
          ErrorMessage: errorCodes['021'].errorMsg,
        })
      }

      let sheetData = [];

      if(!fileInfo){
        logExceptions("Upload new record service input file error - ", errorCodes['022'].errorMsg)
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Upload New Record",
          DisplayText: errorCodes['022'].errorMsg,
          ErrorCode: errorCodes['022'].errorCode,
          ErrorMessage: errorCodes['022'].errorMsg,
        })
      }
      else{
        if(!fileInfo.warehouse){
          logExceptions("Upload new record service input file error - ", errorCodes['022'].errorMsg)
          return responseHandler.constructErrorResponse({
            ServiceRequestId: "Upload New Record",
            DisplayText: errorCodes['022'].errorMsg,
            ErrorCode: errorCodes['022'].errorCode,
            ErrorMessage: errorCodes['022'].errorMsg,
          })
        }
        else{
          const workbook = xlsx.read(fileInfo.warehouse.data, { type: 'buffer' });
          const sheetName = workbook.SheetNames[0];
          sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        }
      }

      const uploadDetails = await insertDatabase.uploadNewRecord(token, sheetData);

       if (uploadDetails.error) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Upload New Record",
          DisplayText: errorCodes[uploadDetails.code].errorMsg,
          ErrorCode: errorCodes[uploadDetails.code].errorCode,
          ErrorMessage: errorCodes[uploadDetails.code].errorMsg,
        })
      }

      if (Object.keys(uploadDetails).length === 0) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Upload New Record",
          DisplayText: errorCodes['008'].errorMsg,
          ErrorCode: errorCodes['008'].errorCode,
          ErrorMessage: errorCodes['008'].errorMsg,
        })
      }

      //logGeneralData("Upload new record service Response - ", uploadDetails);

      return responseHandler.constructSuccessResponse({
        ServiceRequestId: "Upload New Record",
        ResponseData: uploadDetails,
        DisplayText: errorCodes['000'].errorMsg,
        ErrorCode: errorCodes['000'].errorCode,
        ErrorMessage: errorCodes['000'].errorMsg,
      })
    } catch (error) {
      logExceptions("Upload new record service issue - ", error)
      return responseHandler.constructErrorResponse({
        ServiceRequestId: "Upload New Record",
        DisplayText: errorCodes['101'].errorMsg,
        ErrorCode: errorCodes['101'].errorCode,
        ErrorMessage: errorCodes['101'].errorMsg,
      })
    }
  }

  /**
   * API for delete record
   * @param {*} req (json)
   * @param {*} res (json with success/failure)
   */
  async deleteRecord(token, fileInfo) {
    try {
      if (
        !token.user_id ||
        !token.fullname
      ) {
        logExceptions("Delete record service input token error - ", errorCodes['021'].errorMsg)
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Delete Record",
          DisplayText: errorCodes['021'].errorMsg,
          ErrorCode: errorCodes['021'].errorCode,
          ErrorMessage: errorCodes['021'].errorMsg,
        })
      }

      let sheetData = [];

      if(!fileInfo){
        logExceptions("Delete record service input file error - ", errorCodes['022'].errorMsg)
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Delete Record",
          DisplayText: errorCodes['022'].errorMsg,
          ErrorCode: errorCodes['022'].errorCode,
          ErrorMessage: errorCodes['022'].errorMsg,
        })
      }
      else{
        if(!fileInfo.warehouse){
          logExceptions("Delete record service input file error - ", errorCodes['022'].errorMsg)
          return responseHandler.constructErrorResponse({
            ServiceRequestId: "Delete Record",
            DisplayText: errorCodes['022'].errorMsg,
            ErrorCode: errorCodes['022'].errorCode,
            ErrorMessage: errorCodes['022'].errorMsg,
          })
        }
        else{
          const workbook = xlsx.read(fileInfo.warehouse.data, { type: 'buffer' });
          const sheetName = workbook.SheetNames[0];
          sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        }
      }

      const deleteDetails = await insertDatabase.deleteRecord(token, sheetData);

       if (deleteDetails.error) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Delete Record",
          DisplayText: errorCodes[deleteDetails.code].errorMsg,
          ErrorCode: errorCodes[deleteDetails.code].errorCode,
          ErrorMessage: errorCodes[deleteDetails.code].errorMsg,
        })
      }

      if (Object.keys(deleteDetails).length === 0) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Delete Record",
          DisplayText: errorCodes['008'].errorMsg,
          ErrorCode: errorCodes['008'].errorCode,
          ErrorMessage: errorCodes['008'].errorMsg,
        })
      }

      //logGeneralData("Delete record service Response - ", deleteDetails)

      return responseHandler.constructSuccessResponse({
        ServiceRequestId: "Delete Record",
        ResponseData: deleteDetails,
        DisplayText: errorCodes['000'].errorMsg,
        ErrorCode: errorCodes['000'].errorCode,
        ErrorMessage: errorCodes['000'].errorMsg,
      })
    } catch (error) {
      logExceptions("Delete record service issue - ", error)
      return responseHandler.constructErrorResponse({
        ServiceRequestId: "Delete Record",
        DisplayText: errorCodes['101'].errorMsg,
        ErrorCode: errorCodes['101'].errorCode,
        ErrorMessage: errorCodes['101'].errorMsg,
      })
    }
  }

}

module.exports = {
  uploadService: new UploadService(),
};
