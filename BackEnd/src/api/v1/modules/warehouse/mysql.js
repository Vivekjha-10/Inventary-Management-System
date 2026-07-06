const { StatusCodes } = require("http-status-codes");
const { mysqlConnection } = require("../../../../database/mysql.connection");
const { logGeneralData, logExceptions } = require("../../../../shared/log");

class WarehouseDatabase {
  async section(info, sectionId) {
    try {
      //logGeneralData('Section before database has been call - ', info)

      const sqlProcedureCall = `call getSection(?, ?)`;
      const sectionDetails = await mysqlConnection(sqlProcedureCall, [
        typeof info.logged_in_user_id !== "undefined" ? info.logged_in_user_id : '',
        sectionId
      ]);

      //logGeneralData('Section after database has been call - ', sectionDetails);

      let section = {};
      if (typeof sectionDetails !== "undefined" && typeof sectionDetails[0] !== "undefined" && typeof sectionDetails[0][0] !== "undefined") {
        if (sectionDetails[0][0].is_valid === 0) {
          section["error"] = true;
          section["code"] = '017';
        }
        else {
          if (typeof sectionDetails[1] !== "undefined" && typeof sectionDetails[1][0] !== "undefined") {
            section = JSON.parse(sectionDetails[1][0].result);
            if (section.count > 0) {
              (section.list).forEach((element, index) => {
                section.list[index].count = element.data.length;
              });
            }
            section.error = false;
            section.code = '000';
          }
          else {
            section["error"] = true;
            section["code"] = '026';
          }
        }
      }
      else {
        section["error"] = true;
        section["code"] = '026';
      }
      return section;
    } catch (error) {
      logExceptions('Section database fetch issue - ', error)
      return { error: true, code: '011' }
    }
  }

  async search_by_lot_no(info, options) {
    try {

      //logGeneralData('Search By Lot Number Details before database has been call - ', info)

      const sqlProcedureCall = `call getSearchByLotNumber(?, ?)`;
      const searchByLotNoDetails = await mysqlConnection(sqlProcedureCall, [
        typeof info.logged_in_user_id !== "undefined" ? info.logged_in_user_id : '',
        options.lot_no
      ]);

      //logGeneralData('Search By Lot Number Details after database has been call - ', searchByLotNoDetails);

      let search_by_lot_no = {};
      if (typeof searchByLotNoDetails !== "undefined" && typeof searchByLotNoDetails[0] !== "undefined" && typeof searchByLotNoDetails[0][0] !== "undefined") {
        if (searchByLotNoDetails[0][0].is_valid === 0) {
          search_by_lot_no["error"] = true;
          search_by_lot_no["code"] = '017';
        }
        else {
          if (typeof searchByLotNoDetails[1] !== "undefined" && typeof searchByLotNoDetails[1][0] !== "undefined") {
            search_by_lot_no = JSON.parse(searchByLotNoDetails[1][0].result);

            if (search_by_lot_no.count > 0) {
              (search_by_lot_no.list).forEach((element, index) => {
                search_by_lot_no.list[index].count = element.data.length;
              });
            }
            search_by_lot_no.error = false;
            search_by_lot_no.code = '000';
          }
          else {
            search_by_lot_no["error"] = true;
            search_by_lot_no["code"] = '033';
          }
        }
      }
      else {
        search_by_lot_no["error"] = true;
        search_by_lot_no["code"] = '033';
      }
      return search_by_lot_no;
    } catch (error) {
      logExceptions('Search By Lot Number Details database fetch issue - ', error)
      return { error: true, code: '011' }
    }
  }

  async search(info, options) {
    try {

      const limit = options.limit ? parseInt(options.limit) : null;
      let offset = options.offset ? parseInt(options.offset) : null;
      offset = (offset - 1) * limit;

      //logGeneralData('Search before database has been call info- ', info)
      //logGeneralData('Search before database has been call option- ', options)
      //logGeneralData('Search before database has been call offset - ', offset);
      //logGeneralData('Search before database has been call limit - ', limit);

      const sqlProcedureCall = `call getDetails(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const SearchDetails = await mysqlConnection(sqlProcedureCall, [
        typeof info.logged_in_user_id !== "undefined" ? info.logged_in_user_id : '',
        typeof options.block_no !== "undefined" ? options.block_no : '',
        typeof options.item_description !== "undefined" ? options.item_description : '',
        typeof options.lot_no !== "undefined" ? options.lot_no : '',
        typeof options.item_no !== "undefined" ? options.item_no : '',
        options.sort_by ? options.sort_by : "",
        options.order_by ? options.order_by : "asc",
        offset,
        limit
      ]);

      //logGeneralData('Search after database has been call - ', SearchDetails);

      let search = {};
      if (typeof SearchDetails !== "undefined" && typeof SearchDetails[0] !== "undefined" && typeof SearchDetails[0][0] !== "undefined") {
        if (SearchDetails[0][0].is_valid === 0) {
          search["error"] = true;
          search["code"] = '017';
        }
        else {
          if (typeof SearchDetails[1] !== "undefined" && typeof SearchDetails[1][0] !== "undefined") {
            search = JSON.parse(SearchDetails[1][0].result);
            search["error"] = false;
            search["code"] = '000';
          }
          else {
            search["error"] = true;
            search["code"] = '027';
          }
        }
      }
      else {
        search["error"] = true;
        search["code"] = '027';
      }
      return search;
    } catch (error) {
      logExceptions('Search database fetch issue - ', error)
      return { error: true, code: '011' }
    }
  }

  async dashboard(info, options) {
    try {
      const limit = options.limit ? parseInt(options.limit) : null;
      let offset = options.offset ? parseInt(options.offset) : null;
      offset = (offset - 1) * limit;

      //logGeneralData('Dashboard before database has been call options - ', options);
      //logGeneralData('Dashboard before database has been call offset - ', offset);
      //logGeneralData('Dashboard before database has been call limit - ', limit);
      //logGeneralData('Dashboard before database has been call - ', info)

      const sqlProcedureCall = `call getDashboard(?, ?, ?, ?, ?, ?)`;
      const DashboardDetails = await mysqlConnection(sqlProcedureCall, [
        typeof info.logged_in_user_id !== "undefined" ? info.logged_in_user_id : '',
        typeof options.search !== "undefined" && options.search.text ? `%${options.search.text}%` : "",
        options.sort_by ? options.sort_by : "",
        options.order_by ? options.order_by : "asc",
        offset,
        limit
      ]);

      //logGeneralData('Dashboard after database has been call - ', DashboardDetails);

      let dashboard = {};
      if (typeof DashboardDetails !== "undefined" && typeof DashboardDetails[0] !== "undefined" && typeof DashboardDetails[0][0] !== "undefined" && typeof DashboardDetails[1][0] !== "undefined" && typeof DashboardDetails[2][0] !== "undefined") {
        if (DashboardDetails[0][0].is_valid === 0) {
          dashboard["error"] = true;
          dashboard["code"] = '017';
        }
        else {
          if (typeof DashboardDetails[1] !== "undefined" && typeof DashboardDetails[1][0] !== "undefined" && typeof DashboardDetails[2] !== "undefined" && typeof DashboardDetails[2][0] !== "undefined" && typeof DashboardDetails[3] !== "undefined" && typeof DashboardDetails[3][0] !== "undefined") {
            dashboard = JSON.parse(DashboardDetails[1][0].result);
            dashboard["table"] = JSON.parse(DashboardDetails[2][0].result);
            dashboard["specific_block"] = JSON.parse(DashboardDetails[3][0].result);
            dashboard["error"] = false;
            dashboard["code"] = '000';
          }
          else {
            dashboard["error"] = true;
            dashboard["code"] = '028';
          }
        }
      }
      else {
        dashboard["error"] = true;
        dashboard["code"] = '028';
      }
      return dashboard;
    } catch (error) {
      logExceptions('Dashboard database fetch issue - ', error)
      return { error: true, code: '011' }
    }
  }

  async masterList(info) {
    try {

      //logGeneralData('Master List before database has been call - ', info)

      const sqlProcedureCall = `call getMasterList(?)`;
      const masterListDetails = await mysqlConnection(sqlProcedureCall, [
        typeof info.logged_in_user_id !== "undefined" ? info.logged_in_user_id : ''
      ]);

      //logGeneralData('Master List after database has been call - ', masterListDetails);

      let master_list = {};
      if (typeof masterListDetails !== "undefined" && typeof masterListDetails[0] !== "undefined" && typeof masterListDetails[0][0] !== "undefined" && typeof masterListDetails[1][0] !== "undefined" && typeof masterListDetails[2][0] !== "undefined" && typeof masterListDetails[3][0] !== "undefined" && typeof masterListDetails[4][0] !== "undefined") {
        if (masterListDetails[0][0].is_valid === 0) {
          master_list["error"] = true;
          master_list["code"] = '017';
        }
        else {
          if (typeof masterListDetails[1] !== "undefined" && typeof masterListDetails[1][0] !== "undefined" && typeof masterListDetails[2] !== "undefined" && typeof masterListDetails[2][0] !== "undefined" && typeof masterListDetails[3] !== "undefined" && typeof masterListDetails[3][0] !== "undefined" && typeof masterListDetails[4] !== "undefined" && typeof masterListDetails[4][0] !== "undefined") {
            master_list["master_block"] = JSON.parse(masterListDetails[1][0].result);
            master_list["master_item_no"] = JSON.parse(masterListDetails[2][0].result);
            master_list["master_item_description"] = JSON.parse(masterListDetails[3][0].result);
            master_list["master_lot_no"] = JSON.parse(masterListDetails[4][0].result);
            master_list["error"] = false;
            master_list["code"] = '000';
          }
          else {
            master_list["error"] = true;
            master_list["code"] = '029';
          }
        }
      }
      else {
        master_list["error"] = true;
        master_list["code"] = '029';
      }
      return master_list;
    } catch (error) {
      logExceptions('Master List database fetch issue - ', error)
      return { error: true, code: '011' }
    }
  }

  async addQuantity(info, options) {
    try {

      //logGeneralData('Add Quality before database has been call info- ', info);
      //logGeneralData('Add Quality before database has been call option- ', options);

      let add_quantity = {};

      if (parseFloat(options.addQuantity) <= 0) {
        add_quantity.error = true;
        add_quantity.code = '034';
      }
      else {
        const sqlCall = `UPDATE warehouse SET quantity = ? where id = ?`;
        const AddQuantityDetails = await mysqlConnection(sqlCall, [
          (parseFloat(options.availableQuantity) + parseFloat(options.addQuantity)),
          options.id
        ]);

        //logGeneralData('Add Quality after database has been call - ', AddQuantityDetails);

        if (typeof AddQuantityDetails !== "undefined") {
          add_quantity.affectedRows = parseInt(AddQuantityDetails.affectedRows);
          add_quantity.changedRows = parseInt(AddQuantityDetails.changedRows);

          add_quantity.error = false;
          add_quantity.code = '000';
        }
        else {
          add_quantity["error"] = true;
          add_quantity["code"] = '036';
        }
      }
      return add_quantity;
    } catch (error) {
      logExceptions('Add Quality database fetch issue - ', error)
      return { error: true, code: '011' }
    }
  }

  async dispatchQuantity(info, options) {
    try {

      //logGeneralData('Dispatch Quality before database has been call info- ', info);
      //logGeneralData('Dispatch Quality before database has been call option- ', options);

      let dispatch_quantity = {};
      let is_deleted = 0;

      const dispatchQuantity = parseFloat(options.dispatchQuantity).toFixed(2);
      const availableQuantity = parseFloat(options.availableQuantity).toFixed(2);

      if (dispatchQuantity === availableQuantity) {
        is_deleted = 1;
      }

      if (parseFloat(dispatchQuantity > availableQuantity) || parseFloat(dispatchQuantity <= 0.00)) {
        dispatch_quantity.error = true;
        dispatch_quantity.code = '035';
      }
      else {
        const sqlQueryWarehouse = `SELECT wh.id, wh.mst_warehouse, wh.lot_no, wh.quantity, mwh.is_occupied, mwh.number_of_batch from warehouse wh inner join mst_warehouse mwh on mwh.id = wh.mst_warehouse 
        where wh.id = ? and wh.is_deleted = ?`;
        const warehouseDescription = await mysqlConnection(sqlQueryWarehouse, [
          options.id,
          0
        ]);

        if (Object.keys(warehouseDescription).length === 0) {
          dispatch_quantity.error = true;
          dispatch_quantity.code = '038';
        }
        else {
          if (is_deleted === 1) {
            let number_of_batch_data = 0;
            let is_occupied = 0;

            if (warehouseDescription[0].number_of_batch == 1) {
              number_of_batch_data = 0;
              is_occupied = 0;
            }
            else {
              number_of_batch_data = warehouseDescription[0].number_of_batch - 1;
              is_occupied = 1;
            }

            const sqlQueryUpdateWarehouse = `UPDATE warehouse SET quantity = ?, is_deleted = ? where id = ?`;
            const DispatchQuantityDetails = await mysqlConnection(sqlQueryUpdateWarehouse, [
              0, is_deleted, options.id
            ]);

            if (Object.keys(DispatchQuantityDetails).length !== 0) {
              const sqlQueryUpdateMasterWarehouse = `UPDATE mst_warehouse SET number_of_batch = ?, is_occupied = ? where id = ?`;
              const updateMasterDetails = await mysqlConnection(sqlQueryUpdateMasterWarehouse, [
                number_of_batch_data, is_occupied, warehouseDescription[0].mst_warehouse
              ]);
              if (Object.keys(updateMasterDetails).length !== 0) {
                const sqlDispatchCall = `INSERT INTO dispatch_product (master_warehouse_id, dispatch_date, dispatch_time, quantity_dispatch) VALUE (?, ?, ?, ?)`;
                const DispatchQuantityListDetails = await mysqlConnection(sqlDispatchCall, [
                  options.id,
                  options.dispatch_date,
                  options.dispatch_time,
                  parseFloat(options.dispatchQuantity).toFixed(2)
                ]);

                if (typeof DispatchQuantityListDetails !== "undefined") {
                  dispatch_quantity.affectedRowsWarehouse = parseInt(DispatchQuantityDetails.affectedRows);
                  dispatch_quantity.changedRowsWarehouse = parseInt(DispatchQuantityDetails.changedRows);
                  dispatch_quantity.affectedRowsDispatch = parseInt(DispatchQuantityListDetails.affectedRows);
                  dispatch_quantity.changedRowsDispatch = parseInt(DispatchQuantityListDetails.changedRows);
                  dispatch_quantity.affectedRowsMaster = parseInt(sqlQueryUpdateMasterWarehouse.affectedRows);
                  dispatch_quantity.changedRowsMaster = parseInt(sqlQueryUpdateMasterWarehouse.changedRows);
                  dispatch_quantity.error = false;
                  dispatch_quantity.code = '000';
                }
                else {
                  dispatch_quantity["error"] = true;
                  dispatch_quantity["code"] = '037';
                }
              }
              else {
                dispatch_quantity["error"] = true;
                dispatch_quantity["code"] = '039';
              }
            }
            else {
              dispatch_quantity["error"] = true;
              dispatch_quantity["code"] = '037';
            }

          }
          else {
            const quantity_remains = (options.availableQuantity - options.dispatchQuantity);
            const sqlCall = `UPDATE warehouse SET quantity = ?, is_deleted = ? where id = ?`;
            const DispatchQuantityDetails = await mysqlConnection(sqlCall, [
              quantity_remains.toFixed(2),
              is_deleted,
              options.id
            ]);
            //logGeneralData('Dispatch Quality after database has been call - ', DispatchQuantityDetails);

            if (typeof DispatchQuantityDetails !== "undefined") {
              const sqlDispatchCall = `INSERT INTO dispatch_product (master_warehouse_id, dispatch_date, dispatch_time, quantity_dispatch) VALUE (?, ?, ?, ?)`;
              const DispatchQuantityListDetails = await mysqlConnection(sqlDispatchCall, [
                options.id,
                options.dispatch_date,
                options.dispatch_time,
                parseFloat(options.dispatchQuantity).toFixed(2)
              ]);

              if (typeof DispatchQuantityListDetails !== "undefined") {
                dispatch_quantity.affectedRowsWarehouse = parseInt(DispatchQuantityDetails.affectedRows);
                dispatch_quantity.changedRowsWarehouse = parseInt(DispatchQuantityDetails.changedRows);
                dispatch_quantity.affectedRowsDispatch = parseInt(DispatchQuantityListDetails.affectedRows);
                dispatch_quantity.changedRowsDispatch = parseInt(DispatchQuantityListDetails.changedRows);
                dispatch_quantity.error = false;
                dispatch_quantity.code = '000';
              }
              else {
                dispatch_quantity["error"] = true;
                dispatch_quantity["code"] = '037';
              }
            }
            else {
              dispatch_quantity["error"] = true;
              dispatch_quantity["code"] = '037';
            }
          }
        }
      }
      return dispatch_quantity;
    } catch (error) {
      logExceptions('Dispatch Quality database fetch issue - ', error)
      return { error: true, code: '011' }
    }
  }

  async dispatchList(info, options) {
    try {

      const limit = options.limit ? parseInt(options.limit) : null;
      let offset = options.offset ? parseInt(options.offset) : null;
      offset = (offset - 1) * limit;

      //logGeneralData('Dispatch list before database has been call info- ', info)
      //logGeneralData('Dispatch list before database has been call option- ', options)
      //logGeneralData('Dispatch list before database has been call offset - ', offset);
      //logGeneralData('Dispatch list before database has been call limit - ', limit);

      const sqlProcedureCall = `call getDispatchList(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const DispatchToDateDetails = await mysqlConnection(sqlProcedureCall, [
        typeof info.logged_in_user_id !== "undefined" ? info.logged_in_user_id : '',
        options.dispatch_from_date,
        options.dispatch_to_date,
        typeof options.location_code !== "undefined" ? options.location_code : '',
        typeof options.block_no !== "undefined" ? options.block_no : '',
        typeof options.item_description !== "undefined" ? options.item_description : '',
        typeof options.lot_no !== "undefined" ? options.lot_no : '',
        typeof options.item_no !== "undefined" ? options.item_no : '',
        options.sort_by ? options.sort_by : "",
        options.order_by ? options.order_by : "asc",
        offset,
        limit
      ]);

      //logGeneralData('Dispatch list after database has been call - ', DispatchToDateDetails);

      let search = {};
      if (typeof DispatchToDateDetails !== "undefined" && typeof DispatchToDateDetails[0] !== "undefined" && typeof DispatchToDateDetails[0][0] !== "undefined") {
        if (DispatchToDateDetails[0][0].is_valid === 0) {
          search["error"] = true;
          search["code"] = '017';
        }
        else {
          if (typeof DispatchToDateDetails[1] !== "undefined" && typeof DispatchToDateDetails[1][0] !== "undefined") {
            search = JSON.parse(DispatchToDateDetails[1][0].result);
            search["error"] = false;
            search["code"] = '000';
          }
          else {
            search["error"] = true;
            search["code"] = '042';
          }
        }
      }
      else {
        search["error"] = true;
        search["code"] = '042';
      }
      return search;
    } catch (error) {
      logExceptions('Dispatch list database fetch issue - ', error)
      return { error: true, code: '011' }
    }
  }

  async truncateDatabase() {
    try {

      const sqlTruncateQuery = `TRUNCATE dispatch_product;`;
      const TruncateDetails = await mysqlConnection(sqlTruncateQuery, []);

      const sqlMstItemDescriptionQuery = `TRUNCATE mst_item_description;`;
      const MstItemDescriptionDetails = await mysqlConnection(sqlMstItemDescriptionQuery, []);

      const sqlMstItemNoQuery = `TRUNCATE mst_item_no;`;
      const MstItemNoDetails = await mysqlConnection(sqlMstItemNoQuery, []);

      const sqlMstLotNoQuery = `TRUNCATE mst_lot_no;`;
      const MstLotNoDetails = await mysqlConnection(sqlMstLotNoQuery, []);

      const sqlWarehouseQuery = `TRUNCATE warehouse;`;
      const WarehouseDetails = await mysqlConnection(sqlWarehouseQuery, []);

      const sqlMstWarehouseQuery = `UPDATE mst_warehouse SET is_occupied = ?, number_of_batch = ?;`;
      const MstWarehouseDetails = await mysqlConnection(sqlMstWarehouseQuery, [
        0,
        0
      ]);

      //logGeneralData('Truncate after database has been call TruncateDetails- ', TruncateDetails);
      //logGeneralData('Truncate after database has been call MstItemDescriptionDetails- ', MstItemDescriptionDetails);
      //logGeneralData('Truncate after database has been call MstItemNoDetails- ', MstItemNoDetails);
      //logGeneralData('Truncate after database has been call MstLotNoDetails- ', MstLotNoDetails);
      //logGeneralData('Truncate after database has been call TruncateDetails- ', TruncateDetails);
      //logGeneralData('Truncate after database has been call TruncateDetails- ', TruncateDetails);

      let truncate = {};
      if (typeof TruncateDetails !== "undefined" && typeof MstItemDescriptionDetails !== "undefined" && typeof MstItemNoDetails !== "undefined" && typeof MstLotNoDetails !== "undefined" && typeof WarehouseDetails !== "undefined" && typeof MstWarehouseDetails !== "undefined") {
        truncate["error"] = false;
        truncate["code"] = '000';
      }
      else {
        truncate["error"] = true;
        truncate["code"] = '044';
      }
      return truncate;
    } catch (error) {
      logExceptions('Dispatch list database fetch issue - ', error)
      return { error: true, code: '011' }
    }
  }

  async addNewRecord(options, info) {
    try {
      const upload_new_record = {};

      if (!info?.block_number) {
        return { error: true, code: '046' };
      }

      // Get master data in parallel
      const [
        itemDescription,
        itemNo,
        lotNo
      ] = await Promise.all([
        mysqlConnection(
          "SELECT item_description FROM mst_item_description WHERE is_deleted = ?",
          [0]
        ),
        mysqlConnection(
          "SELECT item_no FROM mst_item_no WHERE is_deleted = ?",
          [0]
        ),
        mysqlConnection(
          "SELECT lot_no FROM mst_lot_no WHERE is_deleted = ?",
          [0]
        )
      ]);

      if (!itemNo || !lotNo) {
        return { error: true, code: '030' };
      }

      const excelItemDescription = new Set(
        itemDescription.map(item => item.item_description)
      );

      const excelItemNo = new Set(
        itemNo.map(item => item.item_no)
      );

      const excelLotNo = new Set(
        lotNo.map(item => String(item.lot_no))
      );

      const foundBlockDetails = (
        await mysqlConnection(
          `SELECT id, block_no, section, is_occupied, number_of_batch
            FROM mst_warehouse
            WHERE block_no = ?
            LIMIT 1`,
          [info.block_number.trim()]
        )
      )[0];

      if (!foundBlockDetails) {
        return { error: true, code: '047' };
      }

      // Insert warehouse record
      const insertQuery = `
      INSERT INTO warehouse (
        mst_warehouse,
        item_no,
        item_description,
        item_category_code,
        variant_code,
        variant_description,
        zone_code,
        location_code,
        ar_no,
        lot_no,
        date_of_mfg,
        expiry_date,
        quantity,
        unit_of_measure
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

      const uploadDetails = await mysqlConnection(insertQuery, [
        foundBlockDetails.id,
        info.item_no ?? null,
        info.item_description ?? null,
        info.item_category_code ?? null,
        info.variant_code ?? null,
        info.variant_description ?? null,
        info.zone_code ?? null,
        info.location_code ?? null,
        info.ar_no ?? null,
        info.lot_no ?? null,
        info.date_of_mfg ?? null,
        info.expiry_date ?? null,
        parseFloat(info.quantity) ?? 0.0,
        info.unit_of_measure ?? null
      ]);

      if (!uploadDetails) {
        return { error: true, code: '048' };
      }

      // Update warehouse master
      const updateResult = await mysqlConnection(
        `UPDATE mst_warehouse
       SET is_occupied = ?, number_of_batch = ?
       WHERE id = ?`,
        [
          1,
          foundBlockDetails.number_of_batch + 1,
          foundBlockDetails.id
        ]
      );

      if (!updateResult) {
        return { error: true, code: '049' };
      }

      // Insert item description if not exists
      if (
        info.item_description &&
        !excelItemDescription.has(info.item_description)
      ) {
        await mysqlConnection(
          `INSERT INTO mst_item_description (item_description)
         VALUES (?)`,
          [info.item_description]
        );
      }

      // Insert item no if not exists
      if (
        info.item_no &&
        !excelItemNo.has(info.item_no)
      ) {
        await mysqlConnection(
          `INSERT INTO mst_item_no (item_no)
         VALUES (?)`,
          [info.item_no]
        );
      }

      // Insert lot no if not exists
      if (
        info.lot_no &&
        !excelLotNo.has(String(info.lot_no))
      ) {
        await mysqlConnection(
          `INSERT INTO mst_lot_no (lot_no)
         VALUES (?)`,
          [info.lot_no]
        );
      }

      return {
        error: false,
        code: '000'
      };

    } catch (error) {
      logExceptions(
        'Add new record database fetch issue - ',
        error
      );

      return {
        error: true,
        code: '011'
      };
    }
  }

  async updateRecord(options, info) {
    try {

      let upload_new_record = {};

      // Fetch master data
      const [
        itemDescription,
        itemNo,
        lotNo
      ] = await Promise.all([
        mysqlConnection(
          `SELECT item_description FROM mst_item_description WHERE is_deleted = ?`,
          [0]
        ),
        mysqlConnection(
          `SELECT item_no FROM mst_item_no WHERE is_deleted = ?`,
          [0]
        ),
        mysqlConnection(
          `SELECT lot_no FROM mst_lot_no WHERE is_deleted = ?`,
          [0]
        )
      ]);

      const excelItemDescription = itemDescription.map(
        item => item.item_description
      );

      const excelItemNo = itemNo.map(
        item => item.item_no
      );

      const excelLotNo = lotNo.map(
        item => String(item.lot_no)
      );

      // Get block details
      const warehouseDetails = await mysqlConnection(
        `SELECT id, block_no
       FROM mst_warehouse
       WHERE block_no = ?
       LIMIT 1`,
        [info.block_number.trim()]
      );

      const foundBlockDetails = warehouseDetails[0];

      if (!foundBlockDetails) {
        return {
          error: true,
          code: '047'
        };
      }

      // Update warehouse record
      const sqlQuery = `
      UPDATE warehouse
      SET
        mst_warehouse = ?,
        item_no = ?,
        item_description = ?,
        item_category_code = ?,
        variant_code = ?,
        variant_description = ?,
        zone_code = ?,
        location_code = ?,
        ar_no = ?,
        lot_no = ?,
        date_of_mfg = ?,
        expiry_date = ?,
        quantity = ?,
        unit_of_measure = ?
      WHERE id = ?
    `;

      const updateDetails = await mysqlConnection(sqlQuery, [
        foundBlockDetails.id,
        info.item_no ?? null,
        info.item_description ?? null,
        info.item_category_code ?? null,
        info.variant_code ?? null,
        info.variant_description ?? null,
        info.zone_code ?? null,
        info.location_code ?? null,
        info.ar_no ?? null,
        info.lot_no ?? null,
        info.date_of_mfg ?? null,
        info.expiry_date ?? null,
        info.quantity ?? null,
        info.unit_of_measure ?? null,
        info.id
      ]);

      if (!updateDetails) {
        return {
          error: true,
          code: '053' // Update failed
        };
      }

      // Insert Item Description if not exists
      if (
        info.item_description &&
        !excelItemDescription.includes(info.item_description)
      ) {
        await mysqlConnection(
          `INSERT INTO mst_item_description (item_description)
         VALUES (?)`,
          [info.item_description]
        );
      }

      // Insert Item No if not exists
      if (
        info.item_no &&
        !excelItemNo.includes(info.item_no)
      ) {
        await mysqlConnection(
          `INSERT INTO mst_item_no (item_no)
         VALUES (?)`,
          [info.item_no]
        );
      }

      // Insert Lot No if not exists
      if (
        info.lot_no &&
        !excelLotNo.includes(String(info.lot_no))
      ) {
        await mysqlConnection(
          `INSERT INTO mst_lot_no (lot_no)
         VALUES (?)`,
          [info.lot_no]
        );
      }

      return {
        error: false,
        code: '000'
      };

    } catch (error) {
      logExceptions(
        'Update record database fetch issue - ',
        error
      );

      return {
        error: true,
        code: '011'
      };
    }
  }

  async deleteRecord(info, options) {
    try {

      //logGeneralData('Delete Record before database has been call info- ', info);
      //logGeneralData('Delete Record before database has been call option- ', options);

      let delete_record = {};

      const sqlQueryWarehouse = `SELECT * FROM mst_warehouse where block_no = ?`;
      const warehouseDescription = await mysqlConnection(sqlQueryWarehouse, [
        options.block_no
      ]);

      if (Object.keys(warehouseDescription).length === 0) {
        delete_record.error = true;
        delete_record.code = '050';
      }
      else {
        let number_of_batch_data = 0;
        let is_occupied = 0;

        if (warehouseDescription[0].number_of_batch == 1) {
          number_of_batch_data = 0;
          is_occupied = 0;
        }
        else {
          number_of_batch_data = warehouseDescription[0].number_of_batch - 1;
          is_occupied = 1;
        }

        const sqlQueryUpdateWarehouse = `UPDATE warehouse SET is_deleted = ?, reason_to_delete = ?, delete_record = ?, staff_name_delete_record = ? where id = ?`;
        const DeleteRecordDetails = await mysqlConnection(sqlQueryUpdateWarehouse, [
          1, options.reason_to_delete, 1, options.staff_name, options.id
        ]);

        if (Object.keys(DeleteRecordDetails).length !== 0) {
          const sqlQueryUpdateMasterWarehouse = `UPDATE mst_warehouse SET number_of_batch = ?, is_occupied = ? where id = ?`;
          const updateMasterDetails = await mysqlConnection(sqlQueryUpdateMasterWarehouse, [
            number_of_batch_data, is_occupied, warehouseDescription[0].id
          ]);
          if (Object.keys(updateMasterDetails).length !== 0) {
            delete_record.affectedRowsWarehouse = parseInt(DeleteRecordDetails.affectedRows);
            delete_record.changedRowsWarehouse = parseInt(DeleteRecordDetails.changedRows);
            delete_record.affectedRowsMaster = parseInt(updateMasterDetails.affectedRows);
            delete_record.changedRowsMaster = parseInt(updateMasterDetails.changedRows);
            delete_record.error = false;
            delete_record.code = '000';
          }
          else {
            delete_record["error"] = true;
            delete_record["code"] = '052';
          }
        }
        else {
          delete_record["error"] = true;
          delete_record["code"] = '051';
        }
      }
      return delete_record;
    } catch (error) {
      logExceptions('Delete Record database fetch issue - ', error)
      return { error: true, code: '011' }
    }
  }

}

module.exports = {
  warehouseDatabase: new WarehouseDatabase()
};
