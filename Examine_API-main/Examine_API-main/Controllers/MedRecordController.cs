

namespace TodoApi2.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]

    public class MedRecordController : ControllerBase
    {
        #region 連接資料特性
        private MedRecordRepository _repository = null;
        public IMedRecordRepository Repository
        {
            get
            {
                if (this._repository == null)
                {
                    this._repository = new MedRecordRepository();
                }
                return this._repository;
            }
        }
        #endregion

        // [Route("[action]")]

        [HttpPost]
        public ActionResult GetMedRecord([FromForm] ReceiveDTO<Login> c)
        {
            Login user = new Login();
            ResultDTO result = Repository.GetMedRecord(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult,rows2 = result.dsResult.Tables[1]  };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));

        }
    }
}