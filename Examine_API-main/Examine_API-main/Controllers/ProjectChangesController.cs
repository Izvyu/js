

namespace TodoApi2.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]

    public class ProjectChangesController : ControllerBase
    {
        #region 連接資料特性
        private ProjectChangesRepository _repository = null;
        public ProjectChangesRepository Repository
        {
            get
            {
                if (this._repository == null)
                {
                    this._repository = new ProjectChangesRepository();
                }
                return this._repository;
            }
        }
        #endregion

        // [Route("[action]")]

        [HttpPost]
        public ActionResult GetProjectChanges([FromForm] ReceiveDTO<Login> c)
        {
            Login user = new Login();
            ResultDTO result = Repository.GetProjectChanges(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry));

        }
    }
}