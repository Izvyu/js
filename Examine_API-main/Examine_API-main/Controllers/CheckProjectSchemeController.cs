


namespace TodoApi2.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]

    public class CheckProjectSchemeController : ControllerBase
    {
        #region 連接資料特性
        private ICheckProjectSchemeRepository _repository = null;
        public ICheckProjectSchemeRepository Repository
        {
            get
            {
                if (this._repository == null)
                {
                    this._repository = new CheckProjectSchemeRepository();
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
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dsResult.Tables[0], rowsGroup = result.dsResult.Tables[1] };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));
        }
    }
}