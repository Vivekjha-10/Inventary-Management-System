const { StatusCodes } = require("http-status-codes");
const { mysqlConnection } = require("../../../../database/mysql.connection");
const { logGeneralData, logExceptions } = require("../../../../shared/log");
const { getJsDateFromExcel } = require("excel-date-to-js");
const moment = require('moment-timezone');

class InsertDatabase {

  async uploadNewRecord(token, info) {
    try {
      //logGeneralData('Upload new record before database has been call info - ', info)
      let affectedRows = 0;
      let changedRows = 0;
      let notAffectedRows = 0;
      let upload_new_record = {};

      let excelItemDescription = [];
      let excelItemNo = [];

      let excelLotNo = [];

      const sqlQueryItemDescription = `SELECT item_description from mst_item_description where is_deleted = ?`;
      const itemDescription = await mysqlConnection(sqlQueryItemDescription, [0]);

      const sqlQueryItemNo = `SELECT item_no from mst_item_no where is_deleted = ?`;
      const itemNo = await mysqlConnection(sqlQueryItemNo, [0]);

      const sqlQueryLotNo = `SELECT lot_no from mst_lot_no where is_deleted = ?`;
      const lotNo = await mysqlConnection(sqlQueryLotNo, [0]);

      if (!itemNo || !lotNo) {
        upload_new_record["error"] = true;
        upload_new_record["code"] = '030';

        return upload_new_record;
      }
      else {
        itemDescription.forEach(element => {
          excelItemDescription.push(element.item_description);
        });

        itemNo.forEach(element => {
          excelItemNo.push(element.item_no);
        });

        lotNo.forEach(element => {
          excelLotNo.push(element.lot_no);
        });
      }

      //console.log("excelItemDescription : ", excelItemDescription);
      //console.log("excelItemNo : ", excelItemNo);
      //console.log("excelLotNo : ", excelLotNo);

      for (let i = 0; i < info.length; i++) {
        const getWarehouseDetails = "SELECT id, block_no, section, is_occupied, number_of_batch from mst_warehouse ;"
        const getDetails = await mysqlConnection(getWarehouseDetails, []);
        
        if (typeof info[i]["Bin Code"] !== "undefined") {
          const foundBlockDetails = getDetails.find(element => element.block_no === (info[i]["Bin Code"]).trim());

          if (typeof foundBlockDetails !== "undefined") {
            //console.log("foundBlockDetails : ", foundBlockDetails.block_no);

            const sqlQuery = `INSERT INTO warehouse (mst_warehouse, item_no, item_description, item_category_code, variant_code, variant_description, zone_code, location_code, ar_no, lot_no, date_of_mfg, expiry_date, quantity, unit_of_measure) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const uploadDetails = await mysqlConnection(sqlQuery, [
              foundBlockDetails.id,
              typeof info[i]["Item No."] !== "undefined" ? info[i]["Item No."] : null,
              typeof info[i]["Item Description"] !== "undefined" ? info[i]["Item Description"] : null,
              typeof info[i]["Item Category Code"] !== "undefined" ? info[i]["Item Category Code"] : null,
              typeof info[i]["Variant Code"] !== "undefined" ? info[i]["Variant Code"] : null,
              typeof info[i]["Variant Description"] !== "undefined" ? info[i]["Variant Description"] : null,
              typeof info[i]["Zone Code"] !== "undefined" ? info[i]["Zone Code"] : null,
              typeof info[i]["Location Code"] !== "undefined" ? info[i]["Location Code"] : null,
              typeof info[i]["AR No."] !== "undefined" ? info[i]["AR No."] : null,
              typeof info[i]["Lot No."] !== "undefined" ? info[i]["Lot No."] : null,
              typeof info[i]['Mfg. Date'] !== "undefined" ? moment.utc(getJsDateFromExcel(info[i]['Mfg. Date'])).format('YYYY-MM-DD') : null,
              typeof info[i]['Expiry Date'] !== "undefined" ? moment.utc(getJsDateFromExcel(info[i]['Expiry Date'])).format('YYYY-MM-DD') : null,
              typeof info[i]["Qty. (Base)"] !== "undefined" ? info[i]["Qty. (Base)"] : null,
              typeof info[i]["Unit of Measure"] !== "undefined" ? info[i]["Unit of Measure"] : null
            ]);

            //logGeneralData('Upload new record after database has been call - ', uploadDetails);
            //console.log("uploadDetails : ", uploadDetails);
            if (typeof uploadDetails !== "undefined") {
              affectedRows = affectedRows + parseInt(uploadDetails.affectedRows);
              changedRows = changedRows + parseInt(uploadDetails.changedRows);

              const updateMasterWarehouse = "UPDATE mst_warehouse SET is_occupied = ?, number_of_batch = ? where id = ?;"
              const updateWDetails = await mysqlConnection(updateMasterWarehouse, [
                1,
                (foundBlockDetails.number_of_batch + 1),
                foundBlockDetails.id
              ]);

              if (!excelItemDescription.includes(info[i]["Item Description"])) {
                if (typeof info[i]["Item Description"] !== "undefined") {
                  const sqlQueryInsertItemDescription = `INSERT INTO mst_item_description (item_description) values (?)`;
                  await mysqlConnection(sqlQueryInsertItemDescription, [info[i]["Item Description"]]);

                  excelItemDescription.push(info[i]["Item Description"]);
                }
              }

              if (!excelItemNo.includes(info[i]["Item No."])) {
                if (typeof info[i]["Item No."] !== "undefined") {
                  const sqlQueryInsertItemNo = `INSERT INTO mst_item_no (item_no) values (?)`;
                  await mysqlConnection(sqlQueryInsertItemNo, [info[i]["Item No."]]);

                  excelItemNo.push(info[i]["Item No."]);
                }
              }

              if (!excelLotNo.includes(String(info[i]["Lot No."]))) {
                if (typeof info[i]["Lot No."] !== "undefined") {
                  //console.log(info[i]["Lot No."]);
                  const sqlQueryInsertLotNo = `INSERT INTO mst_lot_no (lot_no) values (?)`;
                  await mysqlConnection(sqlQueryInsertLotNo, [info[i]["Lot No."]]);

                  excelLotNo.push(info[i]["Lot No."]);
                }
              }
            }
            else {
              notAffectedRows = notAffectedRows + 1;
            }
          }
          else {
            notAffectedRows = notAffectedRows + 1;
          }
        }
        else {
          notAffectedRows = notAffectedRows + 1;
        }
      }

      if (parseInt(affectedRows) + parseInt(notAffectedRows) == info.length) {
        upload_new_record["affectedRows"] = affectedRows;
        upload_new_record["changedRows"] = changedRows;
        upload_new_record["notAffectedRows"] = notAffectedRows;
        upload_new_record["error"] = false;
        upload_new_record["code"] = '000';
      }
      else {
        upload_new_record["error"] = true;
        upload_new_record["code"] = '024';
      }
      return upload_new_record;
    } catch (error) {
      logExceptions('Upload new record database fetch issue - ', error)
      return { error: true, code: '011' }
    }
  }

  async deleteRecord(token, info) {
    try {
      //logGeneralData('Delete record before database has been call info - ', info)

      let deleted_record = {};
      let success_update = 0;
      let error_master = 0;
      let error_normal = 0;
      let quantity_is_not_available = [];
      let data_not_available_database = [];

      for (let i = 0; i < info.length; i++) {
        const sqlQueryWarehouse = `SELECT wh.id, wh.mst_warehouse, wh.lot_no, wh.quantity, mwh.is_occupied, mwh.number_of_batch from warehouse wh inner join mst_warehouse mwh on mwh.id = wh.mst_warehouse 
        where wh.lot_no = ? and wh.is_deleted = ? and mwh.block_no = ?`;
        const warehouseDescription = await mysqlConnection(sqlQueryWarehouse, [
          info[i]["Lot No."],
          0,
          info[i]["Bin Code"]
        ]);

        if (Object.keys(warehouseDescription).length === 0) {
          data_not_available_database.push({
            "lot_no": info[i]["Lot No."],
            "bin_no": info[i]["Bin Code"],
            "item_no": info[i]["Item No."]
          })
          error_normal = error_normal + 1;
        }
        else {
          //console.log("warehouseDescription: ", warehouseDescription[0]);

          if (warehouseDescription[0].quantity == info[i]["Qty. (Base)"]) {
            if (warehouseDescription[0].number_of_batch == 1) {
              //console.log("Quantity is Matched");
              const sqlQueryUpdateWarehouse = `UPDATE warehouse SET quantity = ?, is_deleted = ? where id = ?`;
              const updateNormalDetails = await mysqlConnection(sqlQueryUpdateWarehouse, [
                0, 1, warehouseDescription[0].id
              ]);

              if (Object.keys(updateNormalDetails).length !== 0) {
                const sqlQueryUpdateMasterWarehouse = `UPDATE mst_warehouse SET number_of_batch = ?, is_occupied = ? where id = ?`;
                const updateMasterDetails = await mysqlConnection(sqlQueryUpdateMasterWarehouse, [
                  0, 0, warehouseDescription[0].mst_warehouse
                ]);
                if (Object.keys(updateMasterDetails).length !== 0) {
                  success_update = success_update + updateMasterDetails.affectedRows
                }
                else {
                  error_master = error_master + 1;
                }
              }
              else {
                error_normal = error_normal + 1;
              }
            }
            else {
              const sqlQueryUpdateWarehouse = `UPDATE warehouse SET quantity = ?, is_deleted = ? where id = ?`;
              const updateNormalDetails = await mysqlConnection(sqlQueryUpdateWarehouse, [
                0, 1, warehouseDescription[0].id
              ]);

              if (Object.keys(updateNormalDetails).length !== 0) {
                const sqlQueryUpdateMasterWarehouse = `UPDATE mst_warehouse SET number_of_batch = ? where id = ?`;
                const updateMasterDetails = await mysqlConnection(sqlQueryUpdateMasterWarehouse, [
                  (warehouseDescription[0].number_of_batch - 1), warehouseDescription[0].mst_warehouse
                ]);
                if (Object.keys(updateMasterDetails).length !== 0) {
                  success_update = success_update + updateMasterDetails.affectedRows
                }
                else {
                  error_master = error_master + 1;
                }
              }
              else {
                error_normal = error_normal + 1;
              }
            }
          }
          else if (warehouseDescription[0].quantity > info[i]["Qty. (Base)"]) {
            //console.log("Quantity is Greater then database");

            let latest_quantity = warehouseDescription[0].quantity - info[i]["Qty. (Base)"];

            const sqlQueryUpdateWarehouse = `UPDATE warehouse SET quantity = ? where id = ?`;
            const updateNormalDetails = await mysqlConnection(sqlQueryUpdateWarehouse, [
              latest_quantity, warehouseDescription[0].id
            ]);

            if (Object.keys(updateNormalDetails).length !== 0) {
              success_update = success_update + updateNormalDetails.affectedRows
            }
            else {
              error_normal = error_normal + 1;
            }
          }

          else {
            error_normal = error_normal + 1;
            quantity_is_not_available.push({
              "lot_no": info[i]["Lot No."],
              "bin_no": info[i]["Bin Code"],
              "item_no": info[i]["Item No."],
              "quantity_available_in_rack": parseFloat(warehouseDescription[0].quantity),
              "quantity_in_excel": info[i]["Qty. (Base)"]
            })
          }
        }
      }

      deleted_record["data_not_available_database"] = data_not_available_database;
      deleted_record["quantity_is_not_available"] = quantity_is_not_available;
      deleted_record["success_update"] = success_update;
      deleted_record["error_master"] = error_master;
      deleted_record["error_normal"] = error_normal;

      if ((success_update + error_master + error_normal) == info.length) {
        deleted_record["error"] = false;
        deleted_record["code"] = '000';
      }
      else {
        deleted_record["error"] = false;
        deleted_record["code"] = '000';
      }

      return deleted_record;
    } catch (error) {
      logExceptions('Delete record database fetch issue - ', error)
      return { error: true, code: '011' }
    }
  }

}

module.exports = {
  insertDatabase: new InsertDatabase()
};
