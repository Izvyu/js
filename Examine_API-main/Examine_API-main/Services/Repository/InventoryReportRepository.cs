
using System.Data;
using System.Collections;
using SixLabors.ImageSharp.Web.Resolvers;
using Microsoft.Extensions.FileProviders;
using SixLabors.ImageSharp.Metadata;
using SixLabors.ImageSharp.Web.Providers;
using SixLabors.ImageSharp.Web;

namespace TodoApi2
{
    public class InventoryReportRepository : IInventoryReportRepository
    {
        MsSQLDBUtility xDS = new MsSQLDBUtility(AccessToDb.ConnectionString_gbcyerp);

        public ResultDTO GetInventoryReport(Inventory c)
        {
            ResultDTO result = new ResultDTO();
            ArrayList alParameters = new ArrayList();

            alParameters.Add(new object[3] { "@i_comgroup_id", SqlDbType.NVarChar, "TWCY" });
            alParameters.Add(new object[3] { "@i_com_id", SqlDbType.NVarChar, "X" });
            alParameters.Add(new object[3] { "@i_fact_id", SqlDbType.NVarChar, "X" });
            alParameters.Add(new object[3] { "@i_sto_flag", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_cst_category_code", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_cst_category_code_ex", SqlDbType.NVarChar, "08,11" });
            alParameters.Add(new object[3] { "@i_stock_date_s", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_stock_date_e", SqlDbType.NVarChar, DBNull.Value});
            alParameters.Add(new object[3] { "@i_matno", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_mat_name", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_mat_specnm", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_wareno", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_warenm", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_stoplaceno", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_stoplacenm", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_supno", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_supnm", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_custno", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_custnm", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_custno_mat", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_custnm_mat", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_cust_mat_no", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_barcode", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_stock_id", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_source_doc_no", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_manu_doc_no", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_order_no", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_mkit_mk", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_matno_mkit", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_kit_mk", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_cust_mat_no_mkit", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_stockmanagetype_flag", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_qty_flag", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_order", SqlDbType.NVarChar, DBNull.Value });
            alParameters.Add(new object[3] { "@i_pagesize", SqlDbType.NVarChar, c.i_pagesize });
            alParameters.Add(new object[3] { "@i_pageindex", SqlDbType.NVarChar, c.i_pageindex });

            DataSet ds = xDS.ExecProcedureDataSet("prc_gb_wh_stock_query_sch_group", alParameters);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];
            result.TotalRecord = ds.Tables[0].Rows.Count;

            return result;
        }
    }
}



