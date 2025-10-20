
using System.Data;
using System.Collections;
using SixLabors.ImageSharp.Web.Resolvers;
using Microsoft.Extensions.FileProviders;
using SixLabors.ImageSharp.Metadata;
using SixLabors.ImageSharp.Web.Providers;
using SixLabors.ImageSharp.Web;

namespace TodoApi2
{
    public class PayableRepository : IPayableRepository
    {
        
        MsSQLDBUtility xDS = new MsSQLDBUtility(AccessToDb.ConnectionString_gbcyerp);
        

        // MsSQLDBUtility oDS = new MsSQLDBUtility(ConfigurationManager.ConnectionStrings["Medirep"].ToString());

        // public CheckProject myType = new CheckProject();

        
        public ResultDTO GetPayable(Login c)
        {
                        ResultDTO result = new ResultDTO();
                        ArrayList alParameters = new ArrayList();


             alParameters.Add(new object[3] { "@startDate", SqlDbType.NVarChar, c?.startDate });
            alParameters.Add(new object[3] { "@endDate", SqlDbType.NVarChar, c?.endDate });
            DataSet ds = xDS.ExecProcedureDataSet(SPName.prc_sp_query_Payable, alParameters);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];

            result.TotalRecord = ds.Tables[0].Rows.Count;


            return result;

        }
    }


}



