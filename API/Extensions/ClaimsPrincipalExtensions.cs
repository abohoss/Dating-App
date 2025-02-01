using System.Runtime.CompilerServices;
using System.Security.Claims;

namespace API.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetUsername(this ClaimsPrincipal User)
        {
            var username = User.FindFirstValue(ClaimTypes.Name) ?? throw new Exception("username not provided in claims");
            return username;
        }

        public static int GetUserId(this ClaimsPrincipal User)
        {
            int userId =int.Parse( User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new Exception("user id not provided in claims"));
            return userId;
        }
    }
}
