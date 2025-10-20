
using System.Data;
using System.Collections;
using SixLabors.ImageSharp.Web.Resolvers;
using Microsoft.Extensions.FileProviders;
using SixLabors.ImageSharp.Metadata;
using SixLabors.ImageSharp.Web.Providers;
using SixLabors.ImageSharp.Web;

namespace TodoApi2
{
    public class ItemlogCheckRepository : IItemlogCheckRepository
    {
        
        MsSQLDBUtility oDS = new MsSQLDBUtility(AccessToDb.ConnectionString);
        

        // MsSQLDBUtility oDS = new MsSQLDBUtility(ConfigurationManager.ConnectionStrings["Medirep"].ToString());

        // public CheckProject myType = new CheckProject();

        
        public ResultDTO GetItemlogCheck(Login c)
        {
                        ResultDTO result = new ResultDTO();
                        ArrayList alParameters = new ArrayList();


           alParameters.Add(new object[3] { "@BarCodeStr", SqlDbType.NVarChar, c?.BarCodeStr });

            using (SqlConnection connection = new SqlConnection(oDS.ConnectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand())
                {
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;

                    // 直接使用 SQL 查詢
                    command.CommandText = "SELECT [DoType], [UpTime], [Hostname], [BarCodeStr], [ItemNo], [Value], [Err], [DecStr], [Reference], [Source], [HandlerID], [DrAdvise] FROM [ExamineServer3].[dbo].[Log_CheckProjectDetail] WHERE BarCodeStr = @BarCodeStr";
                    command.Parameters.AddWithValue("@BarCodeStr", c?.BarCodeStr);

                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        DataSet ds = new DataSet();
                        adapter.Fill(ds);

                        result.dsResult = ds;
                        result.dtResult = ds.Tables[0];

                        result.TotalRecord = ds.Tables[0].Rows.Count;
                    }
                }
            }

            return result;
        }
    }
}