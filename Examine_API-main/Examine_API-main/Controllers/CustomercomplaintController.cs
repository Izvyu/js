

namespace TodoApi2.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]

    public class CustomercomplaintController : ControllerBase
    {
        #region 連接資料特性
        private CustomercomplaintRepository _repository = null;
        public CustomercomplaintRepository Repository
        {
            get
            {
                if (this._repository == null)
                {
                    this._repository = new CustomercomplaintRepository();
                }
                return this._repository;
            }
        }
        #endregion

        // [Route("[action]")]

        [HttpPost]
        public ActionResult GetCustomercomplaint([FromForm] ReceiveDTO<Login> c)
        {
            Login user = new Login();
            ResultDTO result = Repository.GetCustomercomplaint(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));

        }
    }
}