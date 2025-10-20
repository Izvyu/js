

namespace TodoApi2.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]

    public class GeneralStockController : ControllerBase
    {
        #region 連接資料特性
        private GeneralStockRepository _repository = null;
        public GeneralStockRepository Repository
        {
            get
            {
                if (this._repository == null)
                {
                    this._repository = new GeneralStockRepository();
                }
                return this._repository;
            }
        }
        #endregion

        // [Route("[action]")]

        [HttpPost]
        public ActionResult GetGeneralStock([FromForm] ReceiveDTO<Login> c)
        {
            Login user = new Login();
            ResultDTO result = Repository.GetGeneralStock(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry));

        }
    }
}