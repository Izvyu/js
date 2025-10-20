
using System;
using System.Data;
using System.Collections;
using System.Data.SqlClient; // Assuming MsSQLDBUtility uses System.Data.SqlClient
using Newtonsoft.Json;

namespace TodoApi2
{
    public class MedCheckRepository : IMedCheckRepository
    {
        private MsSQLDBUtility oDS = new MsSQLDBUtility(AccessToDb.ConnectionString);

        public ResultDTO GetMedCheck(Login c)
        {
            ResultDTO result = new ResultDTO();
            ArrayList alParameters = new ArrayList();

            alParameters.Add(new object[3] { "@BarCodeStr", SqlDbType.NVarChar, c?.BarCodeStr });
            alParameters.Add(new object[3] { "@IsTrue", SqlDbType.NVarChar, c?.IsTrue });
            alParameters.Add(new object[3] { "@oldcheckdata", SqlDbType.NVarChar, c?.oldcheckdata });

            try
            {
                DataSet ds = oDS.ExecProcedureDataSet(SPName.prc_sp_query_MedCheck, alParameters);

                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    result.dsResult = ds;
                    result.dtResult = ds.Tables[0];
                    result.TotalRecord = ds.Tables[0].Rows.Count;
                }
                else
                {
                    // Handle empty or null dataset scenario
                    result.dsResult = null;
                    result.dtResult = null;
                    result.TotalRecord = 0; // or set to appropriate value
                }
            }
            catch (SqlException sqlEx)
            {
                // Log the SQL exception or handle it accordingly
                Console.WriteLine($"SQL Exception occurred: {sqlEx.Message}");
                throw; // rethrow the exception or handle as needed
            }
            catch (Exception ex)
            {
                // Log any other unexpected exception
                Console.WriteLine($"Exception occurred: {ex.Message}");
                throw; // rethrow the exception or handle as needed
            }

            return result;
        }
    }
}



