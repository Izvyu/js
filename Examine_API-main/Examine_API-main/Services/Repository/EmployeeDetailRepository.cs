using System.Data;
using System.Collections;
using SixLabors.ImageSharp.Web.Resolvers;
using Microsoft.Extensions.FileProviders;
using SixLabors.ImageSharp.Metadata;
using SixLabors.ImageSharp.Web.Providers;
using SixLabors.ImageSharp.Web;

namespace TodoApi2
{
    public class EmployeeDetailRepository : IEmployeeDetailRepository
    {
        
        MsSQLDBUtility oDS = new MsSQLDBUtility(AccessToDb.ConnectionString_HR);
        
        public ResultDTO GetEmployeeDetail(Login c)
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
                    command.CommandText = @"SELECT  
                                            [onjob_flag_name],
                                            A.[com_id],
                                            A.[personnel_code],    
                                            A.[personnel_name],
                                            [idno],
                                            [birth],
                                            [gender_name],
                                            A.[dept_name],   
                                            A.[position_name],
                                            A.[entry_date],
                                            [seniority_date],
                                            A.[dimission_date],
                                            [contact_add1],
                                            [tel2],
                                            [email1],
                                            [urgencyman],
                                            [urgencytel],   
                                            A.[remark],
                                            B.[dimissiontype_name],  
                                            B.[dscause_name],
                                            B.[dscomment] 
                                          FROM 
                                            [HR].[dbo].[VIE_PS_PERSONNEL] A    
                                          FULL OUTER JOIN  
                                            [HR].[dbo].[PS_DIMISSION] B
                                          ON   
                                            A.[comgroup_id]  = B.[comgroup_id] 
                                            AND A.[com_id] = B.[com_id]
                                            AND A.[fact_id]=B.[fact_id]
                                            AND A.[personnel_code]=B.[personnel_code]";
                                          

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