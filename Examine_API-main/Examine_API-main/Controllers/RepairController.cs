

namespace TodoApi2.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]

    public class RepairController : ControllerBase
    {
        #region 連接資料特性
        private RepairRepository _repository = null;
        public RepairRepository Repository
        {
            get
            {
                if (this._repository == null)
                {
                    this._repository = new RepairRepository();
                }
                return this._repository;
            }
        }
        #endregion

        // [Route("[action]")]

        [HttpPost]
        public ActionResult GetRepair([FromForm] ReceiveDTO<Login> c)
        {
            Login user = new Login();
            ResultDTO result = Repository.GetRepair(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));

        }
    }
}