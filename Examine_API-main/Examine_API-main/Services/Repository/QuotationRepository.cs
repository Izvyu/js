
using System.Data;
using System.Collections;
using SixLabors.ImageSharp.Web.Resolvers;
using Microsoft.Extensions.FileProviders;
using SixLabors.ImageSharp.Metadata;
using SixLabors.ImageSharp.Web.Providers;
using SixLabors.ImageSharp.Web;

namespace TodoApi2
{
    public class QuotationRepository : IQuotationRepository
    {
        
         MsSQLDBUtility xDS = new MsSQLDBUtility(AccessToDb.ConnectionString_CYERP);
        

        // MsSQLDBUtility oDS = new MsSQLDBUtility(ConfigurationManager.ConnectionStrings["Medirep"].ToString());

        // public CheckProject myType = new CheckProject();

        
        public ResultDTO GetQuotation(Login c)
        {
                        ResultDTO result = new ResultDTO();
                        ArrayList alParameters = new ArrayList();


            alParameters.Add(new object[3] { "@startDate", SqlDbType.NVarChar, c?.startDate });
            alParameters.Add(new object[3] { "@endDate", SqlDbType.NVarChar, c?.endDate });
        //    alParameters.Add(new object[3] { "@Itemno", SqlDbType.NVarChar, c?.Itemno });
        //    alParameters.Add(new object[3] { "@Value", SqlDbType.NVarChar, c?.Value });
            DataSet ds = xDS.ExecProcedureDataSet(SPName.prc_sp_Quotation, alParameters);

            result.dsResult = ds;
            result.dtResult = ds.Tables[0];

            result.TotalRecord = ds.Tables[0].Rows.Count;


            return result;

        }
    }


}



