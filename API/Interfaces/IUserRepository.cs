using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        Task<AppUser?> GetUserByIdAsync(int id);
        Task<bool> SaveChangesAsync();
        Task<IEnumerable<AppUser>> GetUsersAsync();
        Task<AppUser?> GetUserByUsernameAsync(string username);

        Task<MemberDto?> GetMemberByUsernameAsync(string username);
        Task<IEnumerable<MemberDto>> GetMembersAsync();

    }
}
