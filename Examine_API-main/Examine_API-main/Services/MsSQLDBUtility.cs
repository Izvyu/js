

namespace TodoApi2
{
    public class MsSQLDBUtility
    {
        private SqlConnection pConn = new SqlConnection();
        private string connString = "";

        public MsSQLDBUtility()
        {
            connString = AccessToDb.ConnectionString;
        }

        public MsSQLDBUtility(string connstring)
        {
            this.connString = connstring;
        }

        public SqlConnection getConn()
        {
            if (pConn.State != ConnectionState.Open)
            {
                pConn = new SqlConnection();
                pConn.ConnectionString = connString;
                pConn.Open();
            }
            return pConn;
        }

        public SqlConnection Connection
        {
            get
            {
                pConn.ConnectionString = connString;
                return pConn;
            }
        }

         public string ConnectionString
     {
        get { return connString; }
        set
        {
            connString = value;
            pConn.ConnectionString = value; // 確保同時更新 SqlConnection 的連接字串
        }
      }


        public DataSet GetDataSet(string strSql)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlDataAdapter da = new SqlDataAdapter(strSql, this.getConn());
                da.Fill(ds);
            }
            finally
            {
                Close();
            }
            return ds;
        }

        public DataSet GetDataSetNoClose(string strSql)
        {
            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter(strSql, this.getConn());
            da.Fill(ds);
            return ds;
        }

        public DataSet GetDataSet(string sProcedure, ArrayList alParameter)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlCommand cmd = this.getConn().CreateCommand();

                cmd.CommandText = sProcedure;
                cmd.CommandType = CommandType.StoredProcedure;

                if (alParameter != null)
                {
                    foreach (object[] para in alParameter)
                    {
                        string sParameter = para[0].ToString();
                        SqlDbType oType = (SqlDbType)para[1];
                        object Value = para[2];
                        if (Value == null) Value = "";

                        if (Value.ToString() != "OUTPUT")
                        {
                            cmd.Parameters.Add(sParameter, oType).Value = Value;
                        }
                        else
                        {
                            cmd.Parameters.Add(sParameter, oType).Direction = ParameterDirection.Output;
                        }
                    }
                }


                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            finally
            {
                Close();
            }
            return ds;
        }

        public SqlDataReader GetDataReader(string strSql)
        {
            SqlCommand cmd = new SqlCommand(strSql, getConn());
            SqlDataReader dr = cmd.ExecuteReader();
            return dr;
        }

        public DataTable GetDataTable2(string strSql)
        {
            DataTable dt = new DataTable();
            try
            {
                SqlDataAdapter da = new SqlDataAdapter(strSql, this.getConn());
                da.Fill(dt);
            }
            finally
            {
                Close();
            }
            return dt;
        }

        public DataTable GetDataTable(string strSql)
        {
            return GetDataSet(strSql).Tables[0];
        }

        public DataTable GetDataTableNoClose(string strSql)
        {
            return GetDataSetNoClose(strSql).Tables[0];
        }

        public DataTable GetDataTable(string sProcedure, ArrayList alParameter)
        {
            return GetDataSet(sProcedure, alParameter).Tables[0];
        }

        public object GetScalarValue(string strSql)
        {
            SqlCommand cmd = new SqlCommand(strSql, getConn());
            object o = cmd.ExecuteScalar();
            if (o == DBNull.Value)
            {
                return null;
            }
            Close();
            return o;
        }


        public object GetScalarValueNoClose(string strSql)
        {
            SqlCommand cmd = new SqlCommand(strSql, getConn());
            object o = cmd.ExecuteScalar();
            if (o == DBNull.Value)
                return null;
            return o;
        }

        public string ExeSql(string sql)
        {
            SqlCommand cmd = new SqlCommand(sql, getConn());
            try
            {
                cmd.ExecuteNonQuery();
            }
            catch (Exception e)
            {
                return e.Message;
            }
            finally
            {
                Close();
            }
            return "";
        }

        public string ExeSqlNoClose(string sql)
        {
            SqlCommand cmd = new SqlCommand(sql, getConn());
            try
            {
                cmd.ExecuteNonQuery();
            }
            catch (Exception e)
            {
                return e.Message;
            }
            return "";
        }

        public string ExeSql(string sql, SortedList paras)
        {
            SqlCommand cmd = new SqlCommand(sql, getConn());
            cmd.CommandType = CommandType.StoredProcedure;
            for (int i = 0; i < paras.Count; i++)
            {
                cmd.Parameters.Add(new SqlParameter(paras.GetKey(i).ToString(), paras.GetByIndex(i)));
            }
            try
            {
                cmd.ExecuteNonQuery();
            }
            catch (Exception e)
            {
                return e.Message;
            }
            finally
            {
                Close();
            }
            return "";
        }

        public string ExeSqlTransaction(string[] sSqls)
        {
            SqlCommand ocCmd = getConn().CreateCommand();
            SqlTransaction Trans;

            // Start a local transaction
            Trans = getConn().BeginTransaction(IsolationLevel.ReadCommitted);
            // Assign transaction object for a pending local transaction
            ocCmd.Transaction = Trans;
            try
            {

                for (int i = 0; i < sSqls.Length; i++)
                {
                    if (sSqls[i] != null)
                    {
                        ocCmd.CommandText = sSqls[i];
                        ocCmd.ExecuteNonQuery();
                    }
                }

                Trans.Commit();
            }
            catch (Exception E)
            {
                Trans.Rollback();
                return E.Message;
            }
            finally
            {
                Close();
            }

            return "";
        }

        public string ExeSqlTransactionNoClose(string[] sSqls)
        {
            SqlCommand ocCmd = getConn().CreateCommand();
            SqlTransaction Trans;

            // Start a local transaction
            Trans = getConn().BeginTransaction(IsolationLevel.ReadCommitted);
            // Assign transaction object for a pending local transaction
            ocCmd.Transaction = Trans;
            try
            {

                for (int i = 0; i < sSqls.Length; i++)
                {
                    if (sSqls[i] != null)
                    {
                        ocCmd.CommandText = sSqls[i];
                        ocCmd.ExecuteNonQuery();
                    }
                }

                Trans.Commit();
            }
            catch (Exception E)
            {
                Trans.Rollback();
                return E.Message;
            }

            return "";
        }

        public string ExecProcedure(string sProcedure, ArrayList alParameter)
        {
            SqlCommand ocCmd = getConn().CreateCommand();
            SqlTransaction Trans;

            // Start a local transaction
            Trans = getConn().BeginTransaction(IsolationLevel.ReadCommitted);
            // Assign transaction object for a pending local transaction
            ocCmd.Transaction = Trans;
            try
            {
                ocCmd.CommandText = sProcedure;
                ocCmd.CommandType = CommandType.StoredProcedure;

                if (alParameter != null)
                {
                    foreach (object[] para in alParameter)
                    {
                        string sParameter = para[0].ToString();
                        SqlDbType oType = (SqlDbType)para[1];
                        object Value = para[2];
                        if (Value == null) Value = "";

                        if (Value.ToString() != "OUTPUT")
                        {
                            ocCmd.Parameters.Add(sParameter, oType).Value = Value;
                        }
                        else
                        {
                            ocCmd.Parameters.Add(sParameter, oType, 100).Direction = ParameterDirection.Output;
                        }
                    }
                }

                ocCmd.ExecuteNonQuery();

                Trans.Commit();
            }
            catch (Exception E)
            {
                Trans.Rollback();
                return E.Message;
            }
            finally
            {
                Close();
            }

            if (alParameter != null)
                return ocCmd.Parameters["@ErrMsg"].Value.ToString();
            else
                return "";
        }

        public string ExecProcedure(SqlCommand ocCmd, string sProcedure, ArrayList alParameter)
        {
            try
            {
                ocCmd.CommandText = sProcedure;
                ocCmd.CommandType = CommandType.StoredProcedure;
                ocCmd.Parameters.Clear();

                if (alParameter != null)
                {
                    foreach (object[] para in alParameter)
                    {
                        string sParameter = para[0].ToString();
                        SqlDbType oType = (SqlDbType)para[1];
                        object Value = para[2];
                        if (Value == null) Value = "";

                        if (Value.ToString() != "OUTPUT")
                        {
                            ocCmd.Parameters.Add(sParameter, oType).Value = Value;
                        }
                        else
                        {
                            ocCmd.Parameters.Add(sParameter, oType, 100).Direction = ParameterDirection.Output;
                        }
                    }
                }

                ocCmd.ExecuteNonQuery();
            }
            catch (Exception E)
            {
                return "-1";
            }

            if (alParameter != null)
                return ocCmd.Parameters["@ErrMsg"].Value.ToString();
            else
                return "1";
        }

        public DataSet ExecProcedureDataSet(string sProcedure, ArrayList alParameter)
        {
            DataSet ds = new DataSet();
            SqlCommand ocCmd = getConn().CreateCommand();
            SqlTransaction Trans;

            // Start a local transaction
            Trans = getConn().BeginTransaction(IsolationLevel.ReadCommitted);
            // Assign transaction object for a pending local transaction
            ocCmd.Transaction = Trans;
            try
            {
                ocCmd.CommandText = sProcedure;
                ocCmd.CommandType = CommandType.StoredProcedure;
                SqlParameter parameter = new SqlParameter();

                if (alParameter != null)
                {
                    foreach (object[] para in alParameter)
                    {
                        string sParameter = para[0].ToString();
                        SqlDbType oType = (SqlDbType)para[1];
                        object Value = para[2];
                        if (Value == null) Value = "";

                        if (Value.ToString() != "OUTPUT")
                        {
                            ocCmd.Parameters.Add(sParameter, oType).Value = Value;
                        }
                        else
                        {
                            parameter.ParameterName = sParameter;
                            parameter.SqlDbType = oType;
                            parameter.Size = 100;
                            parameter.Direction = ParameterDirection.Output;

                            ocCmd.Parameters.Add(parameter);
                        }
                    }
                }

                SqlDataAdapter da = new SqlDataAdapter(ocCmd);
                da.SelectCommand.CommandTimeout = 300;
                da.Fill(ds);
                //取得output
                string outputValue = Convert.ToString(parameter.Value);

                Trans.Commit();
            }
            catch (Exception E)
            {
                Trans.Rollback();
                DataTable dt = new DataTable();
                dt.Columns.Add("ErrMsg", typeof(string));

                DataRow dr = dt.NewRow();
                dr["ErrMsg"] = E.Message;
                dt.Rows.Add(dr);

                ds.Tables.Add(dt);
                return ds;
            }
            finally
            {
                Close();
            }

            return ds;
        }

        public DataTable ExecProcedureDataTable(string sProcedure, ArrayList alParameter)
        {
            return ExecProcedureDataSet(sProcedure, alParameter).Tables[0];
        }

        public void Close()
        {
            if (pConn.State != ConnectionState.Closed)
            {
                pConn.Close();
            }
            pConn.Dispose();
        }

    }
}