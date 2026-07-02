

namespace TodoApi2
{
    public interface IComputerAssetRepository
    {
        ResultDTO GetList(ComputerAsset c);
        ResultDTO GetListName(ComputerAsset c);
        ResultDTO Insert(ComputerAsset c);
        ResultDTO Update(ComputerAsset c);
        ResultDTO Delete(ComputerAsset c);
    }
}
