

namespace TodoApi2.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]

    public class CheckItemController : ControllerBase
    {
        #region 連接資料特性
        private ICheckItemRepository _repository = null;
        public ICheckItemRepository Repository
        {
            get
            {
                if (this._repository == null)
                {
                    this._repository = new CheckItemRepository();
                }
                return this._repository;
            }
        }
        #endregion

        // [Route("[action]")]
        [HttpPost]
        public ActionResult GetData([FromForm] ReceiveDTO<CheckItem> c)
        {
            CheckItem user = new CheckItem();
            ResultDTO result = Repository.GetData(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));
        }

    }
}