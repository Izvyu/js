

namespace TodoApi2
{
    public class CheckProjectSchemeRepository : ICheckProjectSchemeRepository
    {
        MsSQLDBUtility oDS = new MsSQLDBUtility(AccessToDb.ConnectionString);
        public CheckProject myType = new CheckProject();

        public ResultDTO GetData(CheckProject c)
        {
            ResultDTO result = new ResultDTO();
            ArrayList alParameters = new ArrayList();


            alParameters.Add(new object[3] { "@ProjectNo", SqlDbType.NVarChar, c.ProjectNo });
            DataSet ds = oDS.ExecProcedureDataSet(SPName.prc_sp_query_CheckProjectScheme, alParameters);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];
            result.TotalRecord = ds.Tables[0].Rows.Count;


            return result;
        }

    }
}