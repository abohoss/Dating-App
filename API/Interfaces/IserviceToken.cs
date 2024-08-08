using API.Entities;

namespace API.Interfaces
{
    public interface IServiceToken
    {
        public string CreateToken(AppUser user);
    }
}
