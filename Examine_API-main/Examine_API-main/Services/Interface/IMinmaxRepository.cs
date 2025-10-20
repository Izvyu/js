


namespace TodoApi2
{
    public interface IMinmaxRepository
    {
        ResultDTO GetData(Login c);
        ResultDTO GetBarcode(Login c);
        ResultDTO GetGaugeData(Login c);

        ResultDTO GetLabData(Login c);
        ResultDTO GetFullData(Login c);

        ResultDTO GetIDList(Login c);
        ResultDTO GetCheckDateList(Login c);

        






    }
}
