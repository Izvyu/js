

namespace TodoApi2
{
    public interface IComputerAssetRepository
    {
        ResultDTO GetList(ComputerAsset c);
        ResultDTO GetListName(ComputerAsset c);
        ResultDTO GetById(ComputerAsset c);
        ResultDTO Insert(ComputerAsset c);
        ResultDTO Update(ComputerAsset c);
        ResultDTO Delete(ComputerAsset c);
        ResultDTO BatchUpdateStatus(ComputerAssetBatchStatus c, string actionBy, string actionHost, string actionIp);
        ResultDTO InsertLog(ComputerAsset c, string actionType, string actionBy, string actionHost, string actionIp, string oldData, string newData, string remark);
    }
}
