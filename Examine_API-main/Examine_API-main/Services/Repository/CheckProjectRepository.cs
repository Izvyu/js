


namespace TodoApi2
{
    public class CheckProjectRepository : ICheckProjectRepository
    {
        MsSQLDBUtility oDS = new MsSQLDBUtility(AccessToDb.ConnectionString);
        public CheckProject myType = new CheckProject();

        public ResultDTO GetData(CheckProject c)
        {
            ResultDTO result = new ResultDTO();
            ArrayList alParameters = new ArrayList();


            //alParameters.Add(new object[3] { "@ProjectName", SqlDbType.NVarChar, c.ProjectName });
            DataSet ds = oDS.ExecProcedureDataSet(SPName.prc_sp_query_CheckProject, alParameters);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];
            result.TotalRecord = ds.Tables[0].Rows.Count;


            return result;
        }

        public ResultDTO Update(string action, CheckProject c)
        {
            ResultDTO result = new ResultDTO();
            ArrayList alParameters = new ArrayList();

            alParameters.Add(new object[3] { "@Action", SqlDbType.NVarChar, action });
            alParameters.Add(new object[3] { "@ProjectNo", SqlDbType.NVarChar, c.ProjectNo });
            alParameters.Add(new object[3] { "@StartDate", SqlDbType.NVarChar, c.StartDate });
            alParameters.Add(new object[3] { "@EndDate", SqlDbType.NVarChar, c.EndDate });
            alParameters.Add(new object[3] { "@ErrMsg", SqlDbType.NVarChar, "OUTPUT" });
            DataSet ds = oDS.ExecProcedureDataSet(SPName.prc_sp_Update_ProjectScheme66, alParameters);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];

            string output = ds.Tables[1].Rows[0]["ErrMsg"].ToString();

            result.TotalRecord = int.Parse(output);


            return result;
        }

        public ResultDTO GetLiveData(CheckProject c)
        {
            ResultDTO result = new ResultDTO();
            ArrayList alParameters = new ArrayList();


            //alParameters.Add(new object[3] { "@ProjectName", SqlDbType.NVarChar, c.ProjectName });
            DataSet ds = oDS.ExecProcedureDataSet(SPName.prc_sp_query_CheckProject_Live, alParameters);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];
            result.TotalRecord = ds.Tables[0].Rows.Count;


            return result;
        }
    }
}