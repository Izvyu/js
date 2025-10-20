

namespace TodoApi2.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]

    public class MedicalRecordController : ControllerBase
    {
        #region 連接資料特性
        private IMedicalRecordRepository _repository = null;
        public IMedicalRecordRepository Repository
        {
            get
            {
                if (this._repository == null)
                {
                    this._repository = new MedicalRecordRepository();
                }
                return this._repository;
            }
        }
        #endregion

        // [Route("[action]")]
        [HttpPost]
        public ActionResult GetData([FromForm] ReceiveDTO<MedicalRecord> c)
        {
            MedicalRecord user = new MedicalRecord();
            ResultDTO result = Repository.GetData(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult, rows2 = result.dsResult.Tables[1] };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));
        }

    }
}