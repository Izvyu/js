

namespace TodoApi2.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]

    public class MinmaxController : ControllerBase
    {
        #region 連接資料特性
        private IMinmaxRepository _repository = null;
        public IMinmaxRepository Repository
        {
            get
            {
                if (this._repository == null)
                {
                    this._repository = new MinmaxRepository();
                }
                return this._repository;
            }
        }
        #endregion

        // [Route("[action]")]
        [HttpPost]
        public ActionResult GetData([FromForm] ReceiveDTO<Login> c)
        {
            MedicalRecord user = new MedicalRecord();
            ResultDTO result = Repository.GetData(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult, rows2 = result.dsResult.Tables[1] };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));
        }

        [HttpPost]
        public ActionResult QueryBarcode([FromForm] ReceiveDTO<Login> c)
        {
            Login user = new Login();
            ResultDTO result = Repository.GetBarcode(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));

        }
        [HttpPost]
        public ActionResult GetGaugeData([FromForm] ReceiveDTO<Login> c)
        {
            Login user = new Login();
            ResultDTO result = Repository.GetGaugeData(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));

        }
        [HttpPost]
        public ActionResult GetLabData([FromForm] ReceiveDTO<Login> c)
        {
            Login user = new Login();
            ResultDTO result = Repository.GetLabData(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));

        }
        [HttpPost]
        public ActionResult GetFullData([FromForm] ReceiveDTO<Login> c)
        {
            Login user = new Login();
            ResultDTO result = Repository.GetFullData(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, Profile = result.dsResult.Tables[0], LabData = result.dsResult.Tables[2], GaugeData = result.dsResult.Tables[1] };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));

        }
        [HttpPost]
        public ActionResult GetIDList([FromForm] ReceiveDTO<Login> c)
        {
            Login user = new Login();
            ResultDTO result = Repository.GetIDList(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));

        }
        [HttpPost]
        public ActionResult Getcheckdate([FromForm] ReceiveDTO<Login> c)
        {
            Login user = new Login();
            ResultDTO result = Repository.GetCheckDateList(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));

        }
   
    }
}