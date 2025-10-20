

namespace TodoApi2.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]

    public class ConsultdateController : ControllerBase
    {
        #region 連接資料特性
        private ConsultdateRepository _repository = null;
        public ConsultdateRepository Repository
        {
            get
            {
                if (this._repository == null)
                {
                    this._repository = new ConsultdateRepository();
                }
                return this._repository;
            }
        }
        #endregion

        // [Route("[action]")]

        [HttpPost]
        public ActionResult  GetConsultdate([FromForm] ReceiveDTO<Login> c)
        {
            Login user = new Login();
            ResultDTO result = Repository. GetConsultdate(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));

        }
    }
}