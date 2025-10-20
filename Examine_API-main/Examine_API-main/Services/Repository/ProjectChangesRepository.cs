
using System.Data;
using System.Collections;
using SixLabors.ImageSharp.Web.Resolvers;
using Microsoft.Extensions.FileProviders;
using SixLabors.ImageSharp.Metadata;
using SixLabors.ImageSharp.Web.Providers;
using SixLabors.ImageSharp.Web;

namespace TodoApi2
{
    public class ProjectChangesRepository : IProjectChangesRepository
    {
        
        MsSQLDBUtility oDS = new MsSQLDBUtility(AccessToDb.ConnectionString);
        

        // MsSQLDBUtility oDS = new MsSQLDBUtility(ConfigurationManager.ConnectionStrings["Medirep"].ToString());

        // public CheckProject myType = new CheckProject();

        
        public ResultDTO GetProjectChanges(Login c)
        {
                        ResultDTO result = new ResultDTO();
                        ArrayList alParameters = new ArrayList();


           alParameters.Add(new object[3] { "@barcoder", SqlDbType.NVarChar, c?.barcoder });
         
            DataSet ds = oDS.ExecProcedureDataSet(SPName.prc_sp_query_ProjectChanges, alParameters);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];
            result.TotalRecord = ds.Tables[0].Rows.Count;


            return result;

        }
    }


}



