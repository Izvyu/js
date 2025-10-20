


namespace TodoApi2.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class CheckProjectNameListController : ControllerBase
    {
        #region 連接資料特性
        private ICheckProjectNameListRepository _repository = null;
        public ICheckProjectNameListRepository Repository
        {
            get
            {
                if (this._repository == null)
                {
                    this._repository = new CheckProjectNameListRepository();
                }
                return this._repository;
            }
        }
        #endregion

        // GET: CheckProject
        [HttpPost]
        public ActionResult GetData([FromForm] ReceiveDTO<CheckProjectNameList> c)
        {
            CheckProjectNameList user = new CheckProjectNameList();
            ResultDTO result = Repository.GetData(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));
        }

    }
}