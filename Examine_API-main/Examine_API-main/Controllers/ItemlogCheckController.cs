

namespace TodoApi2.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]

    public class ItemlogCheckController : ControllerBase
    {
        #region 連接資料特性
        private ItemlogCheckRepository _repository = null;
        public ItemlogCheckRepository Repository
        {
            get
            {
                if (this._repository == null)
                {
                    this._repository = new ItemlogCheckRepository();
                }
                return this._repository;
            }
        }
        #endregion

        // [Route("[action]")]

        [HttpPost]
        public ActionResult GetItemlogCheck([FromForm] ReceiveDTO<Login> c)
        {
            Login user = new Login();
            ResultDTO result = Repository.GetItemlogCheck(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry));

        }
    }
}