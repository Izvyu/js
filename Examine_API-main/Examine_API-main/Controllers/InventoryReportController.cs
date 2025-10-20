

namespace TodoApi2.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]

    public class InventoryReportController : ControllerBase
    {
        #region 連接資料特性
        private InventoryReportRepository _repository = null;
        public InventoryReportRepository Repository
        {
            get
            {
                if (this._repository == null)
                {
                    this._repository = new InventoryReportRepository();
                }
                return this._repository;
            }
        }
        #endregion

        // [Route("[action]")]

        [HttpPost]
        public ActionResult GetInventoryReport([FromForm] ReceiveDTO<Inventory> c)
        {
            Inventory user = new Inventory();
            ResultDTO result = Repository.GetInventoryReport(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));

        }
    }
}