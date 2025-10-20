
using System.Data;
using System.Collections;


namespace TodoApi2
{
    public class MedicalRecordRepository : IMedicalRecordRepository
    {
        MsSQLDBUtility oDS = new MsSQLDBUtility(AccessToDb.ConnectionString);
        // public CheckProject myType = new CheckProject();

        public ResultDTO GetData(MedicalRecord c)
        {
            ResultDTO result = new ResultDTO();
            ArrayList alParameters = new ArrayList();


            alParameters.Add(new object[3] { "@startDate", SqlDbType.NVarChar, c.StartDate });
            DataSet ds = oDS.ExecProcedureDataSet(SPName.prc_sp_query_MedicalRecords, alParameters);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];
            result.TotalRecord = ds.Tables[0].Rows.Count;


            return result;
        }

    }
}