

namespace TodoApi2.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]

    public class MedCheckController : ControllerBase
    {
        #region 連接資料特性
        private MedCheckRepository _repository = null;
        public IMedCheckRepository Repository
        {
            get
            {
                if (this._repository == null)
                {
                    this._repository = new MedCheckRepository();
                }
                return this._repository;
            }
        }
        #endregion

        // [Route("[action]")]

        [HttpPost]
        public ActionResult GetMedCheck([FromForm] ReceiveDTO<Login> c)
        {
            Login user = new Login();
            ResultDTO result = Repository.GetMedCheck(c.parameter);
            // 構造自定義返回對象
            var response = new {
                TotalRecord = result.TotalRecord,
                Rows = result.dtResult
            };
            // 直接返回 JSON 字符串
            return Content(JsonConvert.SerializeObject(response, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));
        }
    }
}