const { warehouseService } = require("./warehouse");
const { logGeneralData, logExceptions } = require("../../../../shared/log");

const section = async (req, res, next) => {
  try {
    const sectionDetails = await warehouseService.section(res.locals.token, req.params.sectionId);
    //logGeneralData('Section cotroller response - ', sectionDetails)
    res.status(200).send(sectionDetails);
  } catch (error) {
    logExceptions('Section cotroller error response - ', error)
    next(error);
  }
}

const search_by_lot_no = async (req, res, next) => {
  try {
    const searchByLotNoDetails = await warehouseService.search_by_lot_no(res.locals.token, res.locals.requestBody);
    //logGeneralData('Search By Lot No Details cotroller response - ', searchByLotNoDetails)
    res.status(200).send(searchByLotNoDetails);
  } catch (error) {
    logExceptions('Search By Lot No Details cotroller error response - ', error)
    next(error);
  }
}

const search = async (req, res, next) => {
  try {
    const searchDetails = await warehouseService.search(res.locals.token, req.query);
    //logGeneralData('Search cotroller response - ', searchDetails)
    res.status(200).send(searchDetails);
  } catch (error) {
    logExceptions('Search cotroller error response - ', error)
    next(error);
  }
}


const dashboard = async (req, res, next) => {
  try {
    const dashboardDetails = await warehouseService.dashboard(res.locals.token, req.query);
    //logGeneralData('Dashboard cotroller response - ', dashboardDetails)
    res.status(200).send(dashboardDetails);
  } catch (error) {
    logExceptions('Dashboard cotroller error response - ', error)
    next(error);
  }
}

const masterList = async (req, res, next) => {
  try {
    const masterListDetails = await warehouseService.masterList(res.locals.token);
    //logGeneralData('Master List cotroller response - ', masterListDetails)
    res.status(200).send(masterListDetails);
  } catch (error) {
    logExceptions('Master List cotroller error response - ', error)
    next(error);
  }
}

const addQuantity = async (req, res, next) => {
  try {
    const addQuantityDetails = await warehouseService.addQuantity(res.locals.token, res.locals.requestBody);
    //logGeneralData('Add quantity cotroller response - ', addQuantityDetails)
    res.status(200).send(addQuantityDetails);
  } catch (error) {
    logExceptions('Add quantity cotroller error response - ', error)
    next(error);
  }
}

const dispatchQuantity = async (req, res, next) => {
  try {
    const dispatchQuantityDetails = await warehouseService.dispatchQuantity(res.locals.token, res.locals.requestBody);
    //logGeneralData('Dispatch quantity cotroller response - ', dispatchQuantityDetails)
    res.status(200).send(dispatchQuantityDetails);
  } catch (error) {
    logExceptions('Dispatch quantity cotroller error response - ', error)
    next(error);
  }
}

const dispatchList = async (req, res, next) => {
  try {
    const dispatchListDetails = await warehouseService.dispatchList(res.locals.token, req.query);
    //logGeneralData('Dispatch list cotroller response - ', dispatchListDetails)
    res.status(200).send(dispatchListDetails);
  } catch (error) {
    logExceptions('Dispatch list cotroller error response - ', error)
    next(error);
  }
}

const truncateDatabase = async (req, res, next) => {
  try {
    const truncateDatabaseDetails = await warehouseService.truncateDatabase(res.locals.token, req.query);
    //logGeneralData('Truncate database cotroller response - ', truncateDatabaseDetails)
    res.status(200).send(truncateDatabaseDetails);
  } catch (error) {
    logExceptions('Truncate database cotroller error response - ', error)
    next(error);
  }
}

const addNewRecord = async (req, res, next) => {
  try {
    const addNewRecordDetails = await warehouseService.addNewRecord(res.locals.token, res.locals.requestBody);
    //logGeneralData('Add new record cotroller response - ', addNewRecordDetails)
    res.status(200).send(addNewRecordDetails);
  } catch (error) {
    logExceptions('Add new record cotroller error response - ', error)
    next(error);
  }
}

const updateRecord = async (req, res, next) => {
  try {
    const updateRecordDetails = await warehouseService.updateRecord(res.locals.token, res.locals.requestBody);
    //logGeneralData('Update record cotroller response - ', updateRecordDetails)
    res.status(200).send(updateRecordDetails);
  } catch (error) {
    logExceptions('Update record cotroller error response - ', error)
    next(error);
  }
}

const deleteRecord = async (req, res, next) => {
  try {
    const deleteRecordDetails = await warehouseService.deleteRecord(res.locals.token, res.locals.requestBody);
    //logGeneralData('Delete record cotroller response - ', deleteRecordDetails)
    res.status(200).send(deleteRecordDetails);
  } catch (error) {
    logExceptions('Delete record cotroller error response - ', error)
    next(error);
  }
}

module.exports = {
  section,
  search_by_lot_no,
  search,
  dashboard,
  masterList,
  addQuantity,
  dispatchQuantity,
  dispatchList,
  truncateDatabase,
  addNewRecord,
  updateRecord,
  deleteRecord
};
