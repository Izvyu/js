

namespace TodoApi2.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]

    public class ComputerAssetController : ControllerBase
    {
        #region Repository
        private IComputerAssetRepository? _repository = null;
        public IComputerAssetRepository Repository
        {
            get
            {
                if (this._repository == null)
                {
                    this._repository = new ComputerAssetRepository();
                }
                return this._repository;
            }
        }
        #endregion

        [HttpPost]
        public ActionResult GetList([FromForm] ReceiveDTO<ComputerAsset> c)
        {
            ResultDTO result = Repository.GetList(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));
        }

        [HttpPost]
        public ActionResult GetListName([FromForm] ReceiveDTO<ComputerAsset> c)
        {
            ResultDTO result = Repository.GetListName(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));
        }

        [HttpPost]
        public ActionResult Insert([FromForm] ReceiveDTO<ComputerAsset> c)
        {
            ResultDTO result = Repository.Insert(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));
        }

        [HttpPost]
        public ActionResult Update([FromForm] ReceiveDTO<ComputerAsset> c)
        {
            ResultDTO result = Repository.Update(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));
        }

        [HttpPost]
        public ActionResult Delete([FromForm] ReceiveDTO<ComputerAsset> c)
        {
            ResultDTO result = Repository.Delete(c.parameter);
            var qry = new { TotalRecord = result.TotalRecord, rows = result.dtResult };
            return Content(JsonConvert.SerializeObject(qry, new IsoDateTimeConverter() { DateTimeFormat = "yyyy/MM/dd" }));
        }
    }
}
