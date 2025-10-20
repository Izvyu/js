


namespace TodoApi2.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]

    public class CheckProjectController : ControllerBase
    {
        #region 連接資料特性
        private ICheckProjectRepository _repository = null;
        public ICheckProjectRepository Repository
        {
            get
            {
                if (this._repository == null)
                {
                    this._repository = new CheckProjectRepository();
                }
                return this._repository;
            }
        }
        #endregion

        // GET: CheckProject
        [HttpPost]
        public ActionResult GetData([FromForm] ReceiveDTO<CheckProject> c)
        {
            CheckProject user = new CheckProject();
            ResultDTO result = Repository.GetData(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));
        }
        [HttpPost]
        public ActionResult Update66([FromForm] ReceiveDTO<CheckProject> c)
        {
            CheckProject user = new CheckProject();
            ResultDTO result = Repository.Update(c.Action, c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));
        }
        [HttpPost]
        public ActionResult GetLiveData([FromForm] ReceiveDTO<CheckProject> c)
        {
            CheckProject user = new CheckProject();
            ResultDTO result = Repository.GetLiveData(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));
        }

    }
}