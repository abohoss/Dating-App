namespace API.Helpers
{
    public class PaginationHeader
    {
        public int pageSize { get; set; }
        public int totalCount { get; set; }
        public int currentPage { get; set; }
        public int totalPages { get; set; }

        public PaginationHeader(int PageSize, int totalCount, int currentPage, int totalPages)
        {
            this.currentPage = currentPage;
            this.pageSize = PageSize;
            this.totalPages = totalPages;
            this.totalCount = totalCount;
        }
    }
}
