
using System.Data;
using System.Collections;
using SixLabors.ImageSharp.Web.Resolvers;
using Microsoft.Extensions.FileProviders;
using SixLabors.ImageSharp.Metadata;
using SixLabors.ImageSharp.Web.Providers;
using SixLabors.ImageSharp.Web;

namespace TodoApi2
{
    public class SourceRepository : ISourceRepository
    {
        
        MsSQLDBUtility xDS = new MsSQLDBUtility(AccessToDb.ConnectionString_CYERP);
        

        // MsSQLDBUtility oDS = new MsSQLDBUtility(ConfigurationManager.ConnectionStrings["Medirep"].ToString());

        // public CheckProject myType = new CheckProject();

        
        public ResultDTO GetCheckSource(Login c)
        {
                        ResultDTO result = new ResultDTO();
                        ArrayList alParameters = new ArrayList();


        //     alParameters.Add(new object[3] { "@startDate", SqlDbType.NVarChar, c?.startDate });
        //    alParameters.Add(new object[3] { "@endDate", SqlDbType.NVarChar, c?.endDate });
            DataSet ds = xDS.ExecProcedureDataSet(SPName.prc_sp_query_Source, alParameters);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];

            result.TotalRecord = ds.Tables[0].Rows.Count;


            return result;

        }
    }


}



