using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

namespace TodoApi2
{
    public class ResultDTO
    {
        public long TotalRecord { get; set; }
        /// <summary>
        /// 執行結果字串表示,1表成功,-1表失敗
        /// </summary>
        public string Result { get; set; }
        /// <summary>
        /// 結果集合
        /// </summary>
        public DataSet dsResult { set; get; }
        /// <summary>
        /// 結果集
        /// </summary>
        public DataTable dtResult { get; set; }
        /// <summary>
        /// 結果集名稱
        /// </summary>
        public string[] aTables { set; get; }


    }



}