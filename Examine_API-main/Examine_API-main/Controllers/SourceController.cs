

namespace TodoApi2.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]

    public class SourceController : ControllerBase
    {
        #region 連接資料特性
        private SourceRepository _repository = null;
        public SourceRepository Repository
        {
            get
            {
                if (this._repository == null)
                {
                    this._repository = new SourceRepository();
                }
                return this._repository;
            }
        }
        #endregion

        // [Route("[action]")]

        [HttpPost]
        public ActionResult GetcheckSource([FromForm] ReceiveDTO<Login> c)
        {
            Login user = new Login();
            ResultDTO result = Repository.GetCheckSource(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));

        }
    }
}