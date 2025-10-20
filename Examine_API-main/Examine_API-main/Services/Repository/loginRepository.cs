
using System.Data;
using System.Collections;
using SixLabors.ImageSharp.Web.Resolvers;
using Microsoft.Extensions.FileProviders;
using SixLabors.ImageSharp.Metadata;
using SixLabors.ImageSharp.Web.Providers;
using SixLabors.ImageSharp.Web;

namespace TodoApi2
{
    public class loginRepository : IloginRepository
    {

        MsSQLDBUtility oDS = new MsSQLDBUtility(AccessToDb.ConnectionString);
        MsSQLDBUtility xDS = new MsSQLDBUtility(AccessToDb.ConnectionString_gbsso);


        // MsSQLDBUtility oDS = new MsSQLDBUtility(ConfigurationManager.ConnectionStrings["Medirep"].ToString());

        // public CheckProject myType = new CheckProject();


        public ResultDTO Getlogin(Login c)
        {
            ResultDTO result = new ResultDTO();
            ArrayList alParameters = new ArrayList();


            alParameters.Add(new object[3] { "@UserName", SqlDbType.NVarChar, c?.UserName });
            alParameters.Add(new object[3] { "@Password", SqlDbType.NVarChar, c?.Password });
            //    alParameters.Add(new object[3] { "@Itemno", SqlDbType.NVarChar, c?.Itemno });
            //    alParameters.Add(new object[3] { "@Value", SqlDbType.NVarChar, c?.Value });
            DataSet ds = oDS.ExecProcedureDataSet(SPName.sp_LoginCheck, alParameters);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];

            result.TotalRecord = ds.Tables[0].Rows.Count;


            return result;

        }
        public ResultDTO GetloginReport(Login c)
        {
            ResultDTO result = new ResultDTO();
            ArrayList alParameters = new ArrayList();


            alParameters.Add(new object[3] { "@UserName", SqlDbType.NVarChar, c?.UserName });
            alParameters.Add(new object[3] { "@Password", SqlDbType.NVarChar, c?.Password });
            //    alParameters.Add(new object[3] { "@Itemno", SqlDbType.NVarChar, c?.Itemno });
            //    alParameters.Add(new object[3] { "@Value", SqlDbType.NVarChar, c?.Value });
            DataSet ds = oDS.ExecProcedureDataSet(SPName.sp_LoginReport, alParameters);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];

            result.TotalRecord = ds.Tables[0].Rows.Count;


            return result;

        }
                 public ResultDTO GetChecklogin(Login c)
        {
                        ResultDTO result = new ResultDTO();
                        ArrayList alParameters = new ArrayList();


           alParameters.Add(new object[3] { "@UserName", SqlDbType.NVarChar, c?.UserName });
           alParameters.Add(new object[3] { "@Password", SqlDbType.NVarChar, c?.Password });
        //    alParameters.Add(new object[3] { "@Itemno", SqlDbType.NVarChar, c?.Itemno });
        //    alParameters.Add(new object[3] { "@Value", SqlDbType.NVarChar, c?.Value });
            DataSet ds = xDS.ExecProcedureDataSet(SPName.sp_Checklogin, alParameters);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];

            result.TotalRecord = ds.Tables[0].Rows.Count;


            return result;

        }
    }


}



