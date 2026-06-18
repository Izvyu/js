

namespace TodoApi2.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]

    public class PurchaseReceiveReportController : ControllerBase
    {
        #region 連接資料特性
        private PurchaseReceiveReportRepository _repository = null;
        public PurchaseReceiveReportRepository Repository
        {
            get
            {
                if (this._repository == null)
                {
                    this._repository = new PurchaseReceiveReportRepository();
                }
                return this._repository;
            }
        }
        #endregion

        // [Route("[action]")]

        [HttpPost]
        public ActionResult GetPurchaseReceiveReport([FromForm] ReceiveDTO<Login> c)
        {
            Login user = new Login();
            ResultDTO result = Repository.GetPurchaseReceiveReport(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));

        }
    }
}