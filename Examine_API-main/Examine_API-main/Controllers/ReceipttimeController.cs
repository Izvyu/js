

namespace TodoApi2.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]

    public class ReceipttimeController : ControllerBase
    {
        #region 連接資料特性
        private ReceipttimeRepository _repository = null;
        public ReceipttimeRepository Repository
        {
            get
            {
                if (this._repository == null)
                {
                    this._repository = new ReceipttimeRepository();
                }
                return this._repository;
            }
        }
        #endregion

        // [Route("[action]")]

        [HttpPost]
        public ActionResult GetReceipttime([FromForm] ReceiveDTO<Login> c)
        {
            Login user = new Login();
            ResultDTO result = Repository.GetReceipttime(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));

        }
    }
}