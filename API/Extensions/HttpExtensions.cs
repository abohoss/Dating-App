using API.Helpers;
using System.Text.Json;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void addHeader<T>(this HttpResponse response, PagedList<T> list)
        {
            var pagedHeader = new PaginationHeader(list.pageSize, list.totalCount, list.currentPage, list.totalPages);

            var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            response.Headers.Append("Pagination", JsonSerializer.Serialize(pagedHeader, jsonOptions));
            response.Headers.Append("Access-Control-Expose-Headers", "Pagination");
        }

    }
}
