

namespace TodoApi2.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]

    public class AnnualReportController : ControllerBase
    {
        #region 連接資料特性
        private AnnualReportRepository _repository = null;
        public AnnualReportRepository Repository
        {
            get
            {
                if (this._repository == null)
                {
                    this._repository = new AnnualReportRepository();
                }
                return this._repository;
            }
        }
        #endregion

        // [Route("[action]")]

        [HttpPost]
        public ActionResult GetAnnualReport([FromForm] ReceiveDTO<Login> c)
        {
            Login user = new Login();
            ResultDTO result = Repository.GetAnnualReport(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry));

        }
    }
}