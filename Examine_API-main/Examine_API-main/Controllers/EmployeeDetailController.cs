

namespace TodoApi2.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]

    public class EmployeeDetailController : ControllerBase
    {
        #region 連接資料特性
        private EmployeeDetailRepository _repository = null;
        public EmployeeDetailRepository Repository
        {
            get
            {
                if (this._repository == null)
                {
                    this._repository = new EmployeeDetailRepository();
                }
                return this._repository;
            }
        }
        #endregion

        // [Route("[action]")]

        [HttpPost]
        public ActionResult GetEmployeeDetail([FromForm] ReceiveDTO<Login> c)
        {
            Login user = new Login();
            ResultDTO result = Repository.GetEmployeeDetail(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry));

        }
    }
}