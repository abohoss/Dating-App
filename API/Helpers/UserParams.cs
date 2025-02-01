namespace API.Helpers
{
    public class UserParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int _pagesize { get; set; } = 10;
        public int PageSize
        {
            get => _pagesize;
            set => _pagesize = value > MaxPageSize ? MaxPageSize : value;
        }
        public string? CurrentUser { get; set; } 
        public string? gender { get; set; }
        public int minAge { get; set; } = 18;
        public int maxAge { get; set; } = 65;

        public string OrderBy { get; set; } = "LastActive";
    }
}
