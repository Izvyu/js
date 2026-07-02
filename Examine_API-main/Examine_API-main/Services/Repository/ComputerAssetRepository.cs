
using System.Data;
using System.Collections;

namespace TodoApi2
{
    public class ComputerAssetRepository : IComputerAssetRepository
    {
        MsSQLDBUtility xDS = new MsSQLDBUtility(AccessToDb.ConnectionString_Cheat);

        public ResultDTO GetList(ComputerAsset c)
        {
            ResultDTO result = new ResultDTO();
            ArrayList alParameters = new ArrayList();

            alParameters.Add(new object[3] { "@CompanyId", SqlDbType.Int, c.CompanyId });
            DataSet ds = xDS.ExecProcedureDataSet(SPName.sp_ComputerAssets_GetList, alParameters);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];
            result.TotalRecord = ds.Tables[0].Rows.Count;

            return result;
        }

        public ResultDTO GetListName(ComputerAsset c)
        {
            ResultDTO result = new ResultDTO();
            ArrayList alParameters = new ArrayList();

            alParameters.Add(new object[3] { "@CompanyId", SqlDbType.Int, c.CompanyId });
            alParameters.Add(new object[3] { "@Name", SqlDbType.NVarChar, DbValue(c.Name) });
            DataSet ds = xDS.ExecProcedureDataSet(SPName.sp_ComputerAssets_GetListName, alParameters);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];
            result.TotalRecord = ds.Tables[0].Rows.Count;

            return result;
        }

        public ResultDTO Insert(ComputerAsset c)
        {
            ResultDTO result = new ResultDTO();
            ArrayList alParameters = GetSaveParameters(c, false);

            DataSet ds = xDS.ExecProcedureDataSet(SPName.sp_ComputerAssets_Insert, alParameters);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];
            result.TotalRecord = ds.Tables[0].Rows.Count;

            return result;
        }

        public ResultDTO Update(ComputerAsset c)
        {
            ResultDTO result = new ResultDTO();
            ArrayList alParameters = GetSaveParameters(c, true);

            DataSet ds = xDS.ExecProcedureDataSet(SPName.sp_ComputerAssets_Update, alParameters);
            ds = EnsureExecuteResult(ds, "Update", c.Id);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];
            result.TotalRecord = ds.Tables[0].Rows.Count;

            return result;
        }

        public ResultDTO Delete(ComputerAsset c)
        {
            ResultDTO result = new ResultDTO();
            ArrayList alParameters = new ArrayList();

            alParameters.Add(new object[3] { "@Id", SqlDbType.Int, c.Id });

            DataSet ds = xDS.ExecProcedureDataSet(SPName.sp_ComputerAssets_Delete, alParameters);
            ds = EnsureExecuteResult(ds, "Delete", c.Id);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];
            result.TotalRecord = ds.Tables[0].Rows.Count;

            return result;
        }

        private ArrayList GetSaveParameters(ComputerAsset c, bool includeId)
        {
            ArrayList alParameters = new ArrayList();

            if (includeId)
            {
                alParameters.Add(new object[3] { "@Id", SqlDbType.Int, c.Id });
            }

            alParameters.Add(new object[3] { "@CompanyId", SqlDbType.Int, c.CompanyId });
            alParameters.Add(new object[3] { "@AssetType", SqlDbType.NVarChar, string.IsNullOrWhiteSpace(c.AssetType) ? "Unknown" : c.AssetType });
            alParameters.Add(new object[3] { "@AssetNo", SqlDbType.NVarChar, DbValue(c.AssetNo) });
            alParameters.Add(new object[3] { "@FinanceAssetNo", SqlDbType.NVarChar, DbValue(c.FinanceAssetNo) });
            alParameters.Add(new object[3] { "@ReceiveDate", SqlDbType.DateTime, DbValue(c.ReceiveDate) });
            alParameters.Add(new object[3] { "@Department", SqlDbType.NVarChar, DbValue(c.Department) });
            alParameters.Add(new object[3] { "@UserName", SqlDbType.NVarChar, DbValue(c.UserName) });
            alParameters.Add(new object[3] { "@Area", SqlDbType.NVarChar, DbValue(c.Area) });
            alParameters.Add(new object[3] { "@CPU", SqlDbType.NVarChar, DbValue(c.CPU) });
            alParameters.Add(new object[3] { "@Memory", SqlDbType.NVarChar, DbValue(c.Memory) });
            alParameters.Add(new object[3] { "@Disk", SqlDbType.NVarChar, DbValue(c.Disk) });
            alParameters.Add(new object[3] { "@GPU", SqlDbType.NVarChar, DbValue(c.GPU) });
            alParameters.Add(new object[3] { "@Monitor", SqlDbType.NVarChar, DbValue(c.Monitor) });
            alParameters.Add(new object[3] { "@MACAddress", SqlDbType.NVarChar, DbValue(c.MACAddress) });
            alParameters.Add(new object[3] { "@Status", SqlDbType.NVarChar, string.IsNullOrWhiteSpace(c.Status) ? "Active" : c.Status });
            alParameters.Add(new object[3] { "@Remark", SqlDbType.NVarChar, DbValue(c.Remark) });

            if (!includeId)
            {
                alParameters.Add(new object[3] { "@CreatedBy", SqlDbType.NVarChar, DbValue(c.CreatedBy) });
            }

            return alParameters;
        }

        private object DbValue(object? value)
        {
            return value ?? DBNull.Value;
        }

        private DataSet EnsureExecuteResult(DataSet ds, string action, int id)
        {
            if (ds.Tables.Count > 0)
            {
                return ds;
            }

            DataTable dt = new DataTable();
            dt.Columns.Add("Result", typeof(string));
            dt.Columns.Add("Action", typeof(string));
            dt.Columns.Add("Id", typeof(int));

            DataRow dr = dt.NewRow();
            dr["Result"] = "1";
            dr["Action"] = action;
            dr["Id"] = id;
            dt.Rows.Add(dr);

            ds.Tables.Add(dt);
            return ds;
        }
    }
}
