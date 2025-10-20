


namespace TodoApi2
{
    public class CheckProjectPersonItemRepository : IPersonItemRepository
    {
        MsSQLDBUtility oDS = new MsSQLDBUtility(AccessToDb.ConnectionString);
        public CheckProject myType = new CheckProject();

        public ResultDTO GetData(PersonItem c)
        {
            ResultDTO result = new ResultDTO();
            ArrayList alParameters = new ArrayList();


            alParameters.Add(new object[3] { "@BarCodeStr", SqlDbType.NVarChar, c.BarCodeStr });
            DataSet ds = oDS.ExecProcedureDataSet(SPName.prc_sp_query_CheckProjectPersonItem, alParameters);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];
            result.TotalRecord = ds.Tables[0].Rows.Count;


            return result;
        }

    }
}