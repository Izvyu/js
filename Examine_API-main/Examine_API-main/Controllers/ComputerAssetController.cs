

namespace TodoApi2.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]

    public class ComputerAssetController : ControllerBase
    {
        private static readonly string[] DeleteLogFields = new[]
        {
            "Id",
            "CompanyId",
            "AssetNo",
            "FinanceAssetNo",
            "Department",
            "UserName",
            "Area",
            "Status"
        };

        #region Repository
        private IComputerAssetRepository? _repository = null;
        public IComputerAssetRepository Repository
        {
            get
            {
                if (this._repository == null)
                {
                    this._repository = new ComputerAssetRepository();
                }
                return this._repository;
            }
        }
        #endregion

        [HttpPost]
        public ActionResult GetList([FromForm] ReceiveDTO<ComputerAsset> c)
        {
            ResultDTO result = Repository.GetList(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));
        }

        [HttpPost]
        public ActionResult GetListName([FromForm] ReceiveDTO<ComputerAsset> c)
        {
            ResultDTO result = Repository.GetListName(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));
        }

        [HttpPost]
        public ActionResult Insert([FromForm] ReceiveDTO<ComputerAsset> c)
        {
            ResultDTO result = Repository.Insert(c.parameter);

            if (result != null && result.TotalRecord > 0)
            {
                string clientIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                string clientHost = clientIp;
                string newData = GetInsertDataJson(c.parameter);

                Repository.InsertLog(
                    c.parameter,
                    "Insert",
                    c.parameter.CreatedBy ?? "unknown",
                    clientHost,
                    clientIp,
                    string.Empty,
                    newData,
                    "Insert ComputerAsset"
                );
            }

            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));
        }

        [HttpPost]
        public ActionResult Update([FromForm] ReceiveDTO<ComputerAsset> c)
        {
            var changedData = GetChangedDataJson(c.parameter);
            ResultDTO result = Repository.Update(c.parameter);

            if (result != null && result.TotalRecord > 0)
            {
                string clientIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                string clientHost = clientIp;

                Repository.InsertLog(
                    c.parameter,
                    "Update",
                    c.parameter.CreatedBy ?? "unknown",
                    clientHost,
                    clientIp,
                    changedData.oldData,
                    changedData.newData,
                    "Update ComputerAsset"
                );
            }

            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));
        }

        [HttpPost]
        public ActionResult Delete([FromForm] ReceiveDTO<ComputerAsset> c)
        {
            string oldData = GetDeleteDataJson(c.parameter);
            ResultDTO result = Repository.Delete(c.parameter);

            if (result != null && result.TotalRecord > 0)
            {
                string clientIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                string clientHost = clientIp;

                Repository.InsertLog(
                    c.parameter,
                    "Delete",
                    c.parameter.CreatedBy ?? "unknown",
                    clientHost,
                    clientIp,
                    oldData,
                    string.Empty,
                    "Delete ComputerAsset"
                );
            }

            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));
        }

        [HttpPost]
        public ActionResult BatchUpdateStatus([FromForm] ReceiveDTO<ComputerAssetBatchStatus> c)
        {
            if (c.parameter == null || string.IsNullOrWhiteSpace(c.parameter.Ids) || string.IsNullOrWhiteSpace(c.parameter.ToStatus))
            {
                DataTable dt = new DataTable();
                dt.Columns.Add("Result", typeof(string));
                dt.Columns.Add("ErrMsg", typeof(string));

                DataRow dr = dt.NewRow();
                dr["Result"] = "-1";
                dr["ErrMsg"] = "Ids and ToStatus are required.";
                dt.Rows.Add(dr);

                var errorQry = new { TotalRecord = dt.Rows.Count, rows = dt };
                return Content(JsonConvert.SerializeObject(errorQry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));
            }

            string clientIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            string clientHost = clientIp;
            string actionBy = string.IsNullOrWhiteSpace(c.parameter.ActionBy) ? "unknown" : c.parameter.ActionBy;

            ResultDTO result = Repository.BatchUpdateStatus(c.parameter, actionBy, clientHost, clientIp);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));
        }

        private string GetInsertDataJson(ComputerAsset c)
        {
            Dictionary<string, object?> values = GetAssetValues(c);
            Dictionary<string, object?> logValues = new Dictionary<string, object?>();

            foreach (var item in values)
            {
                if (HasLogValue(item.Value))
                {
                    logValues[item.Key] = item.Value;
                }
            }

            return JsonConvert.SerializeObject(logValues);
        }

        private (string oldData, string newData) GetChangedDataJson(ComputerAsset c)
        {
            ResultDTO oldResult = Repository.GetById(c);
            Dictionary<string, object?> newValues = GetAssetValues(c);
            Dictionary<string, object?> oldChanges = new Dictionary<string, object?>();
            Dictionary<string, object?> newChanges = new Dictionary<string, object?>();

            if (oldResult?.dtResult == null || oldResult.dtResult.Rows.Count == 0)
            {
                return (string.Empty, JsonConvert.SerializeObject(newValues));
            }

            DataRow row = oldResult.dtResult.Rows[0];

            foreach (var item in newValues)
            {
                object? oldValue = GetRowValue(row, item.Key);
                object? newValue = item.Value;

                if (!ValuesAreEqual(oldValue, newValue))
                {
                    oldChanges[item.Key] = oldValue;
                    newChanges[item.Key] = newValue;
                }
            }

            return (JsonConvert.SerializeObject(oldChanges), JsonConvert.SerializeObject(newChanges));
        }

        private string GetDeleteDataJson(ComputerAsset c)
        {
            ResultDTO oldResult = Repository.GetById(c);

            if (oldResult?.dtResult == null || oldResult.dtResult.Rows.Count == 0)
            {
                return string.Empty;
            }

            DataRow row = oldResult.dtResult.Rows[0];
            Dictionary<string, object?> values = new Dictionary<string, object?>();

            foreach (string field in DeleteLogFields)
            {
                values[field] = GetRowValue(row, field);
            }

            return JsonConvert.SerializeObject(values);
        }

        private Dictionary<string, object?> GetAssetValues(ComputerAsset c)
        {
            return new Dictionary<string, object?>
            {
                { "CompanyId", c.CompanyId },
                { "AssetType", string.IsNullOrWhiteSpace(c.AssetType) ? "Unknown" : c.AssetType },
                { "AssetNo", c.AssetNo },
                { "FinanceAssetNo", c.FinanceAssetNo },
                { "ReceiveDate", c.ReceiveDate },
                { "Department", c.Department },
                { "UserName", c.UserName },
                { "Area", c.Area },
                { "CPU", c.CPU },
                { "Memory", c.Memory },
                { "Disk", c.Disk },
                { "GPU", c.GPU },
                { "Monitor", c.Monitor },
                { "MACAddress", c.MACAddress },
                { "Status", string.IsNullOrWhiteSpace(c.Status) ? "Active" : c.Status },
                { "Remark", c.Remark }
            };
        }

        private object? GetRowValue(DataRow row, string columnName)
        {
            if (!row.Table.Columns.Contains(columnName))
            {
                return null;
            }

            object value = row[columnName];
            return value == DBNull.Value ? null : value;
        }

        private bool ValuesAreEqual(object? oldValue, object? newValue)
        {
            if (oldValue == null && newValue == null)
            {
                return true;
            }

            if (oldValue == null || newValue == null)
            {
                return false;
            }

            if (oldValue is DateTime oldDate && newValue is DateTime newDate)
            {
                return oldDate == newDate;
            }

            return string.Equals(Convert.ToString(oldValue), Convert.ToString(newValue), StringComparison.Ordinal);
        }

        private bool HasLogValue(object? value)
        {
            if (value == null)
            {
                return false;
            }

            if (value is string text)
            {
                return !string.IsNullOrWhiteSpace(text);
            }

            if (value is int number)
            {
                return number != 0;
            }

            return true;
        }
    }
}
