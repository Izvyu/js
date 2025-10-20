

namespace TodoApi2.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]

    public class ReceivingnoteController : ControllerBase
    {
        #region 連接資料特性
        private ReceivingnoteRepository _repository = null;
        public ReceivingnoteRepository Repository
        {
            get
            {
                if (this._repository == null)
                {
                    this._repository = new ReceivingnoteRepository();
                }
                return this._repository;
            }
        }
        #endregion

        // [Route("[action]")]

        [HttpPost]
        public ActionResult GetReceivingnote([FromForm] ReceiveDTO<Login> c)
        {
            Login user = new Login();
            ResultDTO result = Repository.GetReceivingnote(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));

        }
    }
}