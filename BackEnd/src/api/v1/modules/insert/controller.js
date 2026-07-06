const { uploadService } = require("./insert");
const { logGeneralData, logExceptions } = require("../../../../shared/log");

const uploadNewRecord = async (req, res, next) => {
  try {
    const uploadDetails = await uploadService.uploadNewRecord(res.locals.token, res.locals.requestFiles);
    //logGeneralData('Upload new record cotroller response - ', uploadDetails)
    res.status(200).send(uploadDetails);
  } catch (error) {
    logExceptions('Upload new record cotroller error response - ', error)
    next(error);
  }
}

const deleteRecord = async (req, res, next) => {
  try {
    const deleteDetails = await uploadService.deleteRecord(res.locals.token, res.locals.requestFiles);
    //logGeneralData('Delete the record cotroller response - ', deleteDetails)
    res.status(200).send(deleteDetails);
  } catch (error) {
    logExceptions('Delete the record cotroller error response - ', error)
    next(error);
  }
}

module.exports = {
  uploadNewRecord,
  deleteRecord
};
