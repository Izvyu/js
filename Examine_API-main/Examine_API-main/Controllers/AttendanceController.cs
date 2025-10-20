

namespace TodoApi2.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]

    public class AttendanceController : ControllerBase
    {
        #region 連接資料特性
        private AttendanceRepository _repository = null;
        public AttendanceRepository Repository
        {
            get
            {
                if (this._repository == null)
                {
                    this._repository = new AttendanceRepository();
                }
                return this._repository;
            }
        }
        #endregion

        // [Route("[action]")]

        [HttpPost]
        public ActionResult GetAttendance([FromForm] ReceiveDTO<Login> c)
        {
            Login user = new Login();
            ResultDTO result = Repository.GetAttendance(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));

        }
    }
}