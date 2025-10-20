using System.Data;
using System.Collections;
using SixLabors.ImageSharp.Web.Resolvers;
using Microsoft.Extensions.FileProviders;
using SixLabors.ImageSharp.Metadata;
using SixLabors.ImageSharp.Web.Providers;
using SixLabors.ImageSharp.Web;

namespace TodoApi2
{
    public class GeneralStockRepository : IGeneralStockRepository
    {
        
        MsSQLDBUtility oDS = new MsSQLDBUtility(AccessToDb.ConnectionString_gbcyerp);
        
        public ResultDTO GetGeneralStock(Login c)
        {
            ResultDTO result = new ResultDTO();
            ArrayList alParameters = new ArrayList();

            // alParameters.Add(new object[3] { "@BarCodeStr", SqlDbType.NVarChar, c?.BarCodeStr });

            using (SqlConnection connection = new SqlConnection(oDS.ConnectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand())
                {
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;

                    // 直接使用 SQL 查詢
                    command.CommandText = @"select case fact_id
                                            when 'MJ' then '晨悅'
                                            when 'FX' then '范祥'
                                            when 'YJ' then '億敬'
                                            when '01' then '芙華'
                                            when '02' then '維恩'
                                            when '03' then '芙悅'
                                            when '04' then '守葳'
                                            when 'SW' then '守葳診所'
                                            when 'SWART' then '守葳美學'
                                            when 'SWTPNJ' then '守葳台北診所'
                                            when 'SWHC' then '守葳竹北診所'
                                            when 'SH' then '守和'when 'SC' then '守竹'END 
                                            fact_id,matno,mat_name,mat_specnm,unitnm,wareno,warenm,stoplaceno,stoplacenm,stock_date,sto_qty from wh_stock  WHERE matno Not LIKE 'A%'";
                                          

                    // command.Parameters.AddWithValue("@BarCodeStr", c?.BarCodeStr);

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