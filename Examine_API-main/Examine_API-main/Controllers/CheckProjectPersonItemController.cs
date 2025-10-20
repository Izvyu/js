


namespace TodoApi2.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]

    public class CheckProjectPersonItemController : ControllerBase
    {
        #region 連接資料特性
        private IPersonItemRepository _repository = null;
        public IPersonItemRepository Repository
        {
            get
            {
                if (this._repository == null)
                {
                    this._repository = new CheckProjectPersonItemRepository();
                }
                return this._repository;
            }
        }
        #endregion

        // GET: CheckProject
        [HttpPost]
        public ActionResult GetData([FromForm] ReceiveDTO<PersonItem> c)
        {
            CheckProject user = new CheckProject();
            ResultDTO result = Repository.GetData(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult, PersonItemRows = result.dsResult.Tables[1] };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));
        }

    }
}