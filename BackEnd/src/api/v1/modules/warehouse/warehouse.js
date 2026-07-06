const validator = require("validator");
const fs = require("fs");
const { warehouseDatabase } = require("./mysql");
const { generateToken, decryptString, sendEmail, encryptString, verifyToken } = require("../../../../utils/common");
const responseHandler = require('../../../../shared/responseManage')
const { logGeneralData, logExceptions } = require('../../../../shared/log')
const errorCodes = require('../../../../constant/errorCode.json')
const moment = require("moment");
const Joi = require('joi');

class WarehouseService {
  /**
   * API for fetching the section
   * @param {*} req (json)
   * @param {*} res (json with success/failure)
   */
  async section(token, sectionId) {
    try {

      if (
        !token.user_id ||
        !token.fullname) {
        logExceptions("Section service input error - ", errorCodes['021'].errorMsg)
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Search Details",
          DisplayText: errorCodes['021'].errorMsg,
          ErrorCode: errorCodes['021'].errorCode,
          ErrorMessage: errorCodes['021'].errorMsg,
        })
      }

      if (!sectionId) {
        logExceptions("Section service input error - ", errorCodes['023'].errorMsg)
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Section Details",
          DisplayText: errorCodes['023'].errorMsg,
          ErrorCode: errorCodes['023'].errorCode,
          ErrorMessage: errorCodes['023'].errorMsg,
        })
      }

      const sectionDetails = await warehouseDatabase.section({ logged_in_user_id: typeof token !== "undefined" ? token.user_id : null }, sectionId);

      if (sectionDetails.error) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Section",
          DisplayText: errorCodes[sectionDetails.code].errorMsg,
          ErrorCode: errorCodes[sectionDetails.code].errorCode,
          ErrorMessage: errorCodes[sectionDetails.code].errorMsg,
        })
      }

      if (Object.keys(sectionDetails).length === 0) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Section",
          DisplayText: errorCodes['008'].errorMsg,
          ErrorCode: errorCodes['008'].errorCode,
          ErrorMessage: errorCodes['008'].errorMsg,
        })
      }

      //logGeneralData("Section service Response - ", sectionDetails)

      return responseHandler.constructSuccessResponse({
        ServiceRequestId: "Section",
        ResponseData: sectionDetails,
        DisplayText: errorCodes['000'].errorMsg,
        ErrorCode: errorCodes['000'].errorCode,
        ErrorMessage: errorCodes['000'].errorMsg,
      })
    } catch (error) {
      logExceptions("Section service issue - ", error)
      return responseHandler.constructErrorResponse({
        ServiceRequestId: "Section",
        DisplayText: errorCodes['101'].errorMsg,
        ErrorCode: errorCodes['101'].errorCode,
        ErrorMessage: errorCodes['101'].errorMsg,
      })
    }
  }


  /**
   * API for fetching the search by lot number
   * @param {*} req (json)
   * @param {*} res (json with success/failure)
   */
  async search_by_lot_no(token, info) {
    try {
      if (
        !token.user_id ||
        !token.fullname) {
        logExceptions("Search By Lot Number service input error - ", errorCodes['021'].errorMsg)
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Search Details",
          DisplayText: errorCodes['021'].errorMsg,
          ErrorCode: errorCodes['021'].errorCode,
          ErrorMessage: errorCodes['021'].errorMsg,
        })
      }

      if (typeof info.lot_no === "undefined" || !info.lot_no || info.lot_no === "") {
        logExceptions("Search By Lot Number service input error - ", errorCodes['032'].errorMsg)
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Search By Lot Number Details",
          DisplayText: errorCodes['032'].errorMsg,
          ErrorCode: errorCodes['032'].errorCode,
          ErrorMessage: errorCodes['032'].errorMsg,
        })
      }

      const searchByLotNoDetails = await warehouseDatabase.search_by_lot_no({ logged_in_user_id: typeof token !== "undefined" ? token.user_id : null }, info);

      if (searchByLotNoDetails.error) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Search By Lot Number",
          DisplayText: errorCodes[searchByLotNoDetails.code].errorMsg,
          ErrorCode: errorCodes[searchByLotNoDetails.code].errorCode,
          ErrorMessage: errorCodes[searchByLotNoDetails.code].errorMsg,
        })
      }

      if (Object.keys(searchByLotNoDetails).length === 0) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Search By Lot Number",
          DisplayText: errorCodes['008'].errorMsg,
          ErrorCode: errorCodes['008'].errorCode,
          ErrorMessage: errorCodes['008'].errorMsg,
        })
      }

      //logGeneralData("Search By Lot Number service Response - ", searchByLotNoDetails)

      return responseHandler.constructSuccessResponse({
        ServiceRequestId: "Search By Lot Number",
        ResponseData: searchByLotNoDetails,
        DisplayText: errorCodes['000'].errorMsg,
        ErrorCode: errorCodes['000'].errorCode,
        ErrorMessage: errorCodes['000'].errorMsg,
      })
    } catch (error) {
      logExceptions("Search By Lot Number service issue - ", error)
      return responseHandler.constructErrorResponse({
        ServiceRequestId: "Search By Lot Number",
        DisplayText: errorCodes['101'].errorMsg,
        ErrorCode: errorCodes['101'].errorCode,
        ErrorMessage: errorCodes['101'].errorMsg,
      })
    }
  }

  /**
   * API for fetching the search
   * @param {*} req (json)
   * @param {*} res (json with success/failure)
   */
  async search(token, info) {
    try {

      if (!token.user_id ||
        !token.fullname) {
        logExceptions("Search service input error - ", errorCodes['021'].errorMsg)
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Search Details",
          DisplayText: errorCodes['021'].errorMsg,
          ErrorCode: errorCodes['021'].errorCode,
          ErrorMessage: errorCodes['021'].errorMsg,
        })
      }

      const searchDetails = await warehouseDatabase.search({ logged_in_user_id: typeof token !== "undefined" ? token.user_id : null }, info);

      if (searchDetails.error) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Search Details",
          DisplayText: errorCodes[searchDetails.code].errorMsg,
          ErrorCode: errorCodes[searchDetails.code].errorCode,
          ErrorMessage: errorCodes[searchDetails.code].errorMsg,
        })
      }

      if (Object.keys(searchDetails).length === 0) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Search Details",
          DisplayText: errorCodes['008'].errorMsg,
          ErrorCode: errorCodes['008'].errorCode,
          ErrorMessage: errorCodes['008'].errorMsg,
        })
      }

      //logGeneralData("Search service Response - ", searchDetails)

      return responseHandler.constructSuccessResponse({
        ServiceRequestId: "Search Details",
        ResponseData: searchDetails,
        DisplayText: errorCodes['000'].errorMsg,
        ErrorCode: errorCodes['000'].errorCode,
        ErrorMessage: errorCodes['000'].errorMsg,
      })
    } catch (error) {
      logExceptions("Search service issue - ", error)
      return responseHandler.constructErrorResponse({
        ServiceRequestId: "Search Details",
        DisplayText: errorCodes['101'].errorMsg,
        ErrorCode: errorCodes['101'].errorCode,
        ErrorMessage: errorCodes['101'].errorMsg,
      })
    }
  }


  /**
   * API for fetching the dashboard
   * @param {*} req (json)
   * @param {*} res (json with success/failure)
   */
  async dashboard(token, info) {
    try {

      if (!token.user_id ||
        !token.fullname) {
        logExceptions("Dashboard service input error - ", errorCodes['021'].errorMsg)
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Dashboard Details",
          DisplayText: errorCodes['021'].errorMsg,
          ErrorCode: errorCodes['021'].errorCode,
          ErrorMessage: errorCodes['021'].errorMsg,
        })
      }

      const dashboardDetails = await warehouseDatabase.dashboard({ logged_in_user_id: typeof token !== "undefined" ? token.user_id : null }, info);

      if (dashboardDetails.error) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Dashboard Details",
          DisplayText: errorCodes[dashboardDetails.code].errorMsg,
          ErrorCode: errorCodes[dashboardDetails.code].errorCode,
          ErrorMessage: errorCodes[dashboardDetails.code].errorMsg,
        })
      }

      if (Object.keys(dashboardDetails).length === 0) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Dashboard Details",
          DisplayText: errorCodes['008'].errorMsg,
          ErrorCode: errorCodes['008'].errorCode,
          ErrorMessage: errorCodes['008'].errorMsg,
        })
      }

      //logGeneralData("Dashboard service Response - ", dashboardDetails)

      return responseHandler.constructSuccessResponse({
        ServiceRequestId: "Dashboard Details",
        ResponseData: dashboardDetails,
        DisplayText: errorCodes['000'].errorMsg,
        ErrorCode: errorCodes['000'].errorCode,
        ErrorMessage: errorCodes['000'].errorMsg,
      })
    } catch (error) {
      logExceptions("Dashboard service issue - ", error)
      return responseHandler.constructErrorResponse({
        ServiceRequestId: "Dashboard Details",
        DisplayText: errorCodes['101'].errorMsg,
        ErrorCode: errorCodes['101'].errorCode,
        ErrorMessage: errorCodes['101'].errorMsg,
      })
    }
  }

  /**
   * API for fetching the Master List
   * @param {*} req (json)
   * @param {*} res (json with success/failure)
   */
  async masterList(token, info) {
    try {

      if (!token.user_id ||
        !token.fullname) {
        logExceptions("Master List service input error - ", errorCodes['021'].errorMsg)
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Master List Details",
          DisplayText: errorCodes['021'].errorMsg,
          ErrorCode: errorCodes['021'].errorCode,
          ErrorMessage: errorCodes['021'].errorMsg,
        })
      }

      const masterListDetails = await warehouseDatabase.masterList({ logged_in_user_id: typeof token !== "undefined" ? token.user_id : null });

      if (masterListDetails.error) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Master List Details",
          DisplayText: errorCodes[masterListDetails.code].errorMsg,
          ErrorCode: errorCodes[masterListDetails.code].errorCode,
          ErrorMessage: errorCodes[masterListDetails.code].errorMsg,
        })
      }

      if (Object.keys(masterListDetails).length === 0) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Master List Details",
          DisplayText: errorCodes['008'].errorMsg,
          ErrorCode: errorCodes['008'].errorCode,
          ErrorMessage: errorCodes['008'].errorMsg,
        })
      }

      //logGeneralData("Master List service Response - ", masterListDetails)

      return responseHandler.constructSuccessResponse({
        ServiceRequestId: "Master List Details",
        ResponseData: masterListDetails,
        DisplayText: errorCodes['000'].errorMsg,
        ErrorCode: errorCodes['000'].errorCode,
        ErrorMessage: errorCodes['000'].errorMsg,
      })
    } catch (error) {
      logExceptions("Master List service issue - ", error)
      return responseHandler.constructErrorResponse({
        ServiceRequestId: "Master List Details",
        DisplayText: errorCodes['101'].errorMsg,
        ErrorCode: errorCodes['101'].errorCode,
        ErrorMessage: errorCodes['101'].errorMsg,
      })
    }
  }

  /**
   * API for fetching the add quantity
   * @param {*} req (json)
   * @param {*} res (json with success/failure)
   */
  async addQuantity(token, info) {
    try {
      if (
        !token.user_id ||
        !token.fullname) {
        logExceptions("Add Quantity service input error - ", errorCodes['021'].errorMsg)
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Add Quantity Details",
          DisplayText: errorCodes['021'].errorMsg,
          ErrorCode: errorCodes['021'].errorCode,
          ErrorMessage: errorCodes['021'].errorMsg,
        })
      }

      if (
        typeof info.id === "undefined" || !info.id || info.id === "" ||
        typeof info.availableQuantity === "undefined" || !info.availableQuantity || info.availableQuantity === "" ||
        typeof info.addQuantity === "undefined" || !info.addQuantity || info.addQuantity === ""
      ) {
        logExceptions("Add Quantity service input error - ", errorCodes['034'].errorMsg)
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Add Quantity Details",
          DisplayText: errorCodes['034'].errorMsg,
          ErrorCode: errorCodes['034'].errorCode,
          ErrorMessage: errorCodes['034'].errorMsg,
        })
      }

      const addQuantityDetails = await warehouseDatabase.addQuantity({ logged_in_user_id: typeof token !== "undefined" ? token.user_id : null }, info);

      if (addQuantityDetails.error) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Add Quantity",
          DisplayText: errorCodes[addQuantityDetails.code].errorMsg,
          ErrorCode: errorCodes[addQuantityDetails.code].errorCode,
          ErrorMessage: errorCodes[addQuantityDetails.code].errorMsg,
        })
      }

      if (Object.keys(addQuantityDetails).length === 0) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Add Quantity",
          DisplayText: errorCodes['008'].errorMsg,
          ErrorCode: errorCodes['008'].errorCode,
          ErrorMessage: errorCodes['008'].errorMsg,
        })
      }

      //logGeneralData("Add Quantity service Response - ", addQuantityDetails)

      return responseHandler.constructSuccessResponse({
        ServiceRequestId: "Add Quantity",
        ResponseData: addQuantityDetails,
        DisplayText: errorCodes['000'].errorMsg,
        ErrorCode: errorCodes['000'].errorCode,
        ErrorMessage: errorCodes['000'].errorMsg,
      })
    } catch (error) {
      logExceptions("Add Quantity service issue - ", error)
      return responseHandler.constructErrorResponse({
        ServiceRequestId: "Add Quantity",
        DisplayText: errorCodes['101'].errorMsg,
        ErrorCode: errorCodes['101'].errorCode,
        ErrorMessage: errorCodes['101'].errorMsg,
      })
    }
  }

  /**
   * API for fetching the dispatch quantity
   * @param {*} req (json)
   * @param {*} res (json with success/failure)
   */
  async dispatchQuantity(token, info) {
    try {
      if (
        !token.user_id ||
        !token.fullname) {
        logExceptions("Dispatch Quantity service input error - ", errorCodes['021'].errorMsg)
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Dispatch Quantity Details",
          DisplayText: errorCodes['021'].errorMsg,
          ErrorCode: errorCodes['021'].errorCode,
          ErrorMessage: errorCodes['021'].errorMsg,
        })
      }

      if (
        typeof info.id === "undefined" || !info.id || info.id === "" ||
        typeof info.availableQuantity === "undefined" || !info.availableQuantity || info.availableQuantity === "" ||
        typeof info.dispatchQuantity === "undefined" || !info.dispatchQuantity || info.dispatchQuantity === "" ||
        typeof info.dispatch_date === "undefined" || !info.dispatch_date || info.dispatch_date === "" ||
        typeof info.dispatch_time === "undefined" || !info.dispatch_time || info.dispatch_time === ""
      ) {
        logExceptions("Dispatch Quantity service input error - ", errorCodes['034'].errorMsg)
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Dispatch Quantity Details",
          DisplayText: errorCodes['034'].errorMsg,
          ErrorCode: errorCodes['034'].errorCode,
          ErrorMessage: errorCodes['034'].errorMsg,
        })
      }

      const dispatchQuantityDetails = await warehouseDatabase.dispatchQuantity({ logged_in_user_id: typeof token !== "undefined" ? token.user_id : null }, info);

      if (dispatchQuantityDetails.error) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Dispatch Quantity",
          DisplayText: errorCodes[dispatchQuantityDetails.code].errorMsg,
          ErrorCode: errorCodes[dispatchQuantityDetails.code].errorCode,
          ErrorMessage: errorCodes[dispatchQuantityDetails.code].errorMsg,
        })
      }

      if (Object.keys(dispatchQuantityDetails).length === 0) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Dispatch Quantity",
          DisplayText: errorCodes['008'].errorMsg,
          ErrorCode: errorCodes['008'].errorCode,
          ErrorMessage: errorCodes['008'].errorMsg,
        })
      }

      //logGeneralData("Dispatch Quantity service Response - ", dispatchQuantityDetails)

      return responseHandler.constructSuccessResponse({
        ServiceRequestId: "Dispatch Quantity",
        ResponseData: dispatchQuantityDetails,
        DisplayText: errorCodes['000'].errorMsg,
        ErrorCode: errorCodes['000'].errorCode,
        ErrorMessage: errorCodes['000'].errorMsg,
      })
    } catch (error) {
      logExceptions("Dispatch Quantity service issue - ", error)
      return responseHandler.constructErrorResponse({
        ServiceRequestId: "Dispatch Quantity",
        DisplayText: errorCodes['101'].errorMsg,
        ErrorCode: errorCodes['101'].errorCode,
        ErrorMessage: errorCodes['101'].errorMsg,
      })
    }
  }

  /**
   * API for fetching the dispatch list
   * @param {*} req (json)
   * @param {*} res (json with success/failure)
   */
  async dispatchList(token, info) {
    try {
      if (
        !token.user_id ||
        !token.fullname) {
        logExceptions("Dispatch List service input error - ", errorCodes['021'].errorMsg)
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Dispatch List Details",
          DisplayText: errorCodes['021'].errorMsg,
          ErrorCode: errorCodes['021'].errorCode,
          ErrorMessage: errorCodes['021'].errorMsg,
        })
      }

      if (
        typeof info.dispatch_from_date === "undefined" || !info.dispatch_from_date || info.dispatch_from_date === "" ||
        typeof info.dispatch_to_date === "undefined" || !info.dispatch_to_date || info.dispatch_to_date === ""
      ) {
        logExceptions("Dispatch List service input error - ", errorCodes['041'].errorMsg)
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Dispatch List Details",
          DisplayText: errorCodes['041'].errorMsg,
          ErrorCode: errorCodes['041'].errorCode,
          ErrorMessage: errorCodes['041'].errorMsg,
        })
      }

      if (
        info.dispatch_from_date > info.dispatch_to_date
      ) {
        logExceptions("Dispatch List service input error - ", errorCodes['043'].errorMsg)
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Dispatch List Details",
          DisplayText: errorCodes['043'].errorMsg,
          ErrorCode: errorCodes['043'].errorCode,
          ErrorMessage: errorCodes['043'].errorMsg,
        })
      }

      const dispatchListDetails = await warehouseDatabase.dispatchList({ logged_in_user_id: typeof token !== "undefined" ? token.user_id : null }, info);

      if (dispatchListDetails.error) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Dispatch List",
          DisplayText: errorCodes[dispatchListDetails.code].errorMsg,
          ErrorCode: errorCodes[dispatchListDetails.code].errorCode,
          ErrorMessage: errorCodes[dispatchListDetails.code].errorMsg,
        })
      }

      if (Object.keys(dispatchListDetails).length === 0) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Dispatch List",
          DisplayText: errorCodes['008'].errorMsg,
          ErrorCode: errorCodes['008'].errorCode,
          ErrorMessage: errorCodes['008'].errorMsg,
        })
      }

      //logGeneralData("Dispatch List service Response - ", dispatchListDetails)

      return responseHandler.constructSuccessResponse({
        ServiceRequestId: "Dispatch List",
        ResponseData: dispatchListDetails,
        DisplayText: errorCodes['000'].errorMsg,
        ErrorCode: errorCodes['000'].errorCode,
        ErrorMessage: errorCodes['000'].errorMsg,
      })
    } catch (error) {
      logExceptions("Dispatch List service issue - ", error)
      return responseHandler.constructErrorResponse({
        ServiceRequestId: "Dispatch List",
        DisplayText: errorCodes['101'].errorMsg,
        ErrorCode: errorCodes['101'].errorCode,
        ErrorMessage: errorCodes['101'].errorMsg,
      })
    }
  }

  /**
   * API for fetching the truncate database
   * @param {*} req (json)
   * @param {*} res (json with success/failure)
   */
  async truncateDatabase(token, info) {
    try {
      if (
        !token.user_id ||
        !token.fullname) {
        logExceptions("Truncate database service input error - ", errorCodes['021'].errorMsg)
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Truncate database Details",
          DisplayText: errorCodes['021'].errorMsg,
          ErrorCode: errorCodes['021'].errorCode,
          ErrorMessage: errorCodes['021'].errorMsg,
        })
      }

      const dispatchListDetails = await warehouseDatabase.truncateDatabase();

      if (dispatchListDetails.error) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Truncate database",
          DisplayText: errorCodes[dispatchListDetails.code].errorMsg,
          ErrorCode: errorCodes[dispatchListDetails.code].errorCode,
          ErrorMessage: errorCodes[dispatchListDetails.code].errorMsg,
        })
      }

      if (Object.keys(dispatchListDetails).length === 0) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Truncate database",
          DisplayText: errorCodes['008'].errorMsg,
          ErrorCode: errorCodes['008'].errorCode,
          ErrorMessage: errorCodes['008'].errorMsg,
        })
      }

      //logGeneralData("Truncate database service Response - ", dispatchListDetails)

      return responseHandler.constructSuccessResponse({
        ServiceRequestId: "Truncate database",
        ResponseData: dispatchListDetails,
        DisplayText: errorCodes['000'].errorMsg,
        ErrorCode: errorCodes['000'].errorCode,
        ErrorMessage: errorCodes['000'].errorMsg,
      })
    } catch (error) {
      logExceptions("Truncate database service issue - ", error)
      return responseHandler.constructErrorResponse({
        ServiceRequestId: "Truncate database",
        DisplayText: errorCodes['101'].errorMsg,
        ErrorCode: errorCodes['101'].errorCode,
        ErrorMessage: errorCodes['101'].errorMsg,
      })
    }
  }

  /**
   * API for fetching the add new record
   * @param {*} req (json)
   * @param {*} res (json with success/failure)
   */
  async addNewRecord(token, info) {
    try {

      if (
        !token.user_id ||
        !token.fullname) {
        logExceptions("Add New Record service input error - ", errorCodes['021'].errorMsg)
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Add New Record",
          DisplayText: errorCodes['021'].errorMsg,
          ErrorCode: errorCodes['021'].errorCode,
          ErrorMessage: errorCodes['021'].errorMsg,
        })
      }

      const addNewRecordSchema = Joi.object({
        block_number: Joi.string().trim().required(),
        item_description: Joi.string().trim().required(),
        lot_no: Joi.string().trim().required(),
        item_no: Joi.string().trim().required(),
        item_category_code: Joi.string().trim().required(),
        date_of_mfg: Joi.date().required(),
        expiry_date: Joi.date().greater(Joi.ref('date_of_mfg')).required(),
        quantity: Joi.number().greater(0).required(),
        unit_of_measure: Joi.string().trim().required()
      });

      const { error } = addNewRecordSchema.validate(info, {abortEarly: false, allowUnknown: true });

      if (error) {
        logExceptions("Add New Record service input error - ", error.details.map(err => err.message).join(', '));
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Add New Record",
          DisplayText: errorCodes['045'].errorMsg,
          ErrorCode: errorCodes['045'].errorCode,
          ErrorMessage: error.details.map(err => err.message).join(', ')
        });
      }

      const addNewRecordDetails = await warehouseDatabase.addNewRecord({ logged_in_user_id: typeof token !== "undefined" ? token.user_id : null }, info);

      if (addNewRecordDetails.error) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Add New Record",
          DisplayText: errorCodes[addNewRecordDetails.code].errorMsg,
          ErrorCode: errorCodes[addNewRecordDetails.code].errorCode,
          ErrorMessage: errorCodes[addNewRecordDetails.code].errorMsg,
        })
      }

      if (Object.keys(addNewRecordDetails).length === 0) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Add New Record",
          DisplayText: errorCodes['008'].errorMsg,
          ErrorCode: errorCodes['008'].errorCode,
          ErrorMessage: errorCodes['008'].errorMsg,
        })
      }

      //logGeneralData("Add New Record service Response - ", addNewRecordDetails)

      return responseHandler.constructSuccessResponse({
        ServiceRequestId: "Add New Record",
        ResponseData: addNewRecordDetails,
        DisplayText: errorCodes['000'].errorMsg,
        ErrorCode: errorCodes['000'].errorCode,
        ErrorMessage: errorCodes['000'].errorMsg,
      })
    } catch (error) {
      logExceptions("Add New Record service issue - ", error)
      return responseHandler.constructErrorResponse({
        ServiceRequestId: "Add New Record",
        DisplayText: errorCodes['101'].errorMsg,
        ErrorCode: errorCodes['101'].errorCode,
        ErrorMessage: errorCodes['101'].errorMsg,
      })
    }
  }


  /**
   * API for update record
   * @param {*} req (json)
   * @param {*} res (json with success/failure)
   */
  async updateRecord(token, info) {
    try {

      if (
        !token.user_id ||
        !token.fullname) {
        logExceptions("Update Record service input error - ", errorCodes['021'].errorMsg)
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Update Record",
          DisplayText: errorCodes['021'].errorMsg,
          ErrorCode: errorCodes['021'].errorCode,
          ErrorMessage: errorCodes['021'].errorMsg,
        })
      }

      const updateRecordSchema = Joi.object({
        id: Joi.number().positive().required(),
        block_number: Joi.string().trim().required(),
        item_description: Joi.string().trim().required(),
        lot_no: Joi.string().trim().required(),
        item_no: Joi.string().trim().required(),
        item_category_code: Joi.string().trim().required(),
        date_of_mfg: Joi.date().required(),
        expiry_date: Joi.date().greater(Joi.ref('date_of_mfg')).required(),
        quantity: Joi.number().greater(0).required(),
        unit_of_measure: Joi.string().trim().required()
      });

      const { error } = updateRecordSchema.validate(info, {abortEarly: false, allowUnknown: true });

      if (error) {
        logExceptions("update Record service input error - ", error.details.map(err => err.message).join(', '));
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "update Record",
          DisplayText: errorCodes['045'].errorMsg,
          ErrorCode: errorCodes['045'].errorCode,
          ErrorMessage: error.details.map(err => err.message).join(', ')
        });
      }

      const updateRecordDetails = await warehouseDatabase.updateRecord({ logged_in_user_id: typeof token !== "undefined" ? token.user_id : null }, info);

      if (updateRecordDetails.error) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Update Record",
          DisplayText: errorCodes[updateRecordDetails.code].errorMsg,
          ErrorCode: errorCodes[updateRecordDetails.code].errorCode,
          ErrorMessage: errorCodes[updateRecordDetails.code].errorMsg,
        })
      }

      if (Object.keys(updateRecordDetails).length === 0) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Update Record",
          DisplayText: errorCodes['008'].errorMsg,
          ErrorCode: errorCodes['008'].errorCode,
          ErrorMessage: errorCodes['008'].errorMsg,
        })
      }

      //logGeneralData("Update Record service Response - ", updateRecordDetails)

      return responseHandler.constructSuccessResponse({
        ServiceRequestId: "Update Record",
        ResponseData: updateRecordDetails,
        DisplayText: errorCodes['000'].errorMsg,
        ErrorCode: errorCodes['000'].errorCode,
        ErrorMessage: errorCodes['000'].errorMsg,
      })
    } catch (error) {
      logExceptions("Update Record service issue - ", error)
      return responseHandler.constructErrorResponse({
        ServiceRequestId: "Update Record",
        DisplayText: errorCodes['101'].errorMsg,
        ErrorCode: errorCodes['101'].errorCode,
        ErrorMessage: errorCodes['101'].errorMsg,
      })
    }
  }


  /**
   * API for fetching the delete record
   * @param {*} req (json)
   * @param {*} res (json with success/failure)
   */
  async deleteRecord(token, info) {
    try {
      if (
        !token.user_id ||
        !token.fullname) {
        logExceptions("Delete Record service input error - ", errorCodes['021'].errorMsg)
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Delete Record",
          DisplayText: errorCodes['021'].errorMsg,
          ErrorCode: errorCodes['021'].errorCode,
          ErrorMessage: errorCodes['021'].errorMsg,
        })
      }

      if (
        typeof info.id === "undefined" || !info.id || info.id === "" ||
        typeof info.block_no === "undefined" || !info.block_no || info.block_no === "" ||
        typeof info.reason_to_delete === "undefined" || !info.reason_to_delete || info.reason_to_delete === "" ||
        typeof info.staff_name === "undefined" || !info.staff_name || info.staff_name === ""
      ) {
        logExceptions("Delete Record service input error - ", errorCodes['034'].errorMsg)
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Delete Record",
          DisplayText: errorCodes['034'].errorMsg,
          ErrorCode: errorCodes['034'].errorCode,
          ErrorMessage: errorCodes['034'].errorMsg,
        })
      }

      const deleteRecordDetails = await warehouseDatabase.deleteRecord({ logged_in_user_id: typeof token !== "undefined" ? token.user_id : null }, info);

      if (deleteRecordDetails.error) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Delete Record",
          DisplayText: errorCodes[deleteRecordDetails.code].errorMsg,
          ErrorCode: errorCodes[deleteRecordDetails.code].errorCode,
          ErrorMessage: errorCodes[deleteRecordDetails.code].errorMsg,
        })
      }

      if (Object.keys(deleteRecordDetails).length === 0) {
        return responseHandler.constructErrorResponse({
          ServiceRequestId: "Delete Record",
          DisplayText: errorCodes['008'].errorMsg,
          ErrorCode: errorCodes['008'].errorCode,
          ErrorMessage: errorCodes['008'].errorMsg,
        })
      }

      //logGeneralData("Delete Record service Response - ", deleteRecordDetails)

      return responseHandler.constructSuccessResponse({
        ServiceRequestId: "Delete Record",
        ResponseData: deleteRecordDetails,
        DisplayText: errorCodes['000'].errorMsg,
        ErrorCode: errorCodes['000'].errorCode,
        ErrorMessage: errorCodes['000'].errorMsg,
      })
    } catch (error) {
      logExceptions("Delete Record service issue - ", error)
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
  warehouseService: new WarehouseService(),
};
