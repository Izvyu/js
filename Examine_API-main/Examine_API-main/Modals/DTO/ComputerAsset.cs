

namespace TodoApi2
{
    public class ComputerAsset
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }

        public string? AssetType { get; set; }
        public string? AssetNo { get; set; }
        public string? FinanceAssetNo { get; set; }

        public DateTime? ReceiveDate { get; set; }

        public string? Department { get; set; }
        public string? UserName { get; set; }
        public string? Area { get; set; }

        public string? CPU { get; set; }
        public string? Memory { get; set; }
        public string? Disk { get; set; }
        public string? GPU { get; set; }

        public string? Monitor { get; set; }
        public string? MACAddress { get; set; }

        public string? Status { get; set; }
        public string? Remark { get; set; }

        public string? CreatedBy { get; set; }

        public DateTime? CreateTime { get; set; }
        public DateTime? UpdateTime { get; set; }
        public bool IsDeleted { get; set; }

        public string? Name { get; set; }
    }
}
