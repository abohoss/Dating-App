using Microsoft.EntityFrameworkCore;

namespace API.Helpers
{
    public class PagedList<T> : List<T>
    {
        public int pageSize { get; set; }
        public int totalCount { get; set; }
        public int currentPage { get; set; }
        public int totalPages { get; set; }

        public PagedList(IEnumerable<T> items, int count, int pageSize, int pageNumber)
        {
            AddRange(items);
            this.totalCount = count;
            this.currentPage = pageNumber;
            this.pageSize = pageSize;
            this.totalPages =   (int)Math.Ceiling(count / (double)pageSize);
        }

        public static async Task<PagedList<T>> createAsync(IQueryable<T> source, int pageNumber, int pageSize)
        {
            var count = await source.CountAsync();
            var items = await source.Skip((pageNumber-1) * pageSize).Take(pageSize).ToListAsync();

            return new PagedList<T>(items, count, pageSize, pageNumber);
        }
    }
}
