

namespace TodoApi2
{
    public interface ICheckProjectRepository
    {
        ResultDTO GetData(CheckProject c);

        ResultDTO Update(string a, CheckProject c);

        ResultDTO GetLiveData(CheckProject c);

    }
}
