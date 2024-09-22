using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers
{
    [Authorize]
    public class UsersController(IUserRepository _userRepo, IMapper mapper, IPhotoService photoService) : BaseApiController
    {

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var users = await _userRepo.GetMembersAsync();
            return Ok(users);
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            var user = await _userRepo.GetMemberByUsernameAsync(username);
            if (user == null) return NotFound();
            return user;
        }
        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdate)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (username == null) return BadRequest("username is not present in token");

            var user = await _userRepo.GetUserByUsernameAsync(username);

            if (user == null) return BadRequest("user not found");
            mapper.Map(memberUpdate, user);
            if (await _userRepo.SaveChangesAsync()) return NoContent();
            return BadRequest("Failed to update User");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> UploadPhotoAsync(IFormFile file)
        {
            var user = await _userRepo.GetUserByUsernameAsync(User.GetUsername());
            if (user == null)
            {
                return BadRequest("cannot find user with this username");
            }
            var result = await photoService.AddPhotoAsync(file);
            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            user.Photos.Add(photo);

            if (await _userRepo.SaveChangesAsync())
            {
                return CreatedAtAction(nameof(GetUser), new { username = user.UserName }, mapper.Map<PhotoDto>(photo));
            }

            return BadRequest("photo upload failed");
        }

        [HttpPut("set-main-photo/{photoId:int}")]
        public async Task<ActionResult> SetMain(int photoId)
        {
            var user = await _userRepo.GetUserByUsernameAsync(User.GetUsername());
            if (user == null) return BadRequest("cannot find user");
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
            if (photo == null || photo.IsMain) return BadRequest("cannot update main photo");
            var currentphoto = user.Photos.FirstOrDefault(x => x.IsMain == true);
            if(currentphoto != null) currentphoto.IsMain = false;
            photo.IsMain = true;
            if(await _userRepo.SaveChangesAsync()) return NoContent();
            return BadRequest("couldn't save changes");

        }

        [HttpDelete("delete-photo/{photoId:int}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _userRepo.GetUserByUsernameAsync(User.GetUsername());
            if (user == null) return BadRequest("user not found");
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
            if (photo == null) return BadRequest("photo not found");
            if(photo.IsMain) return BadRequest("you cannot delete your main photo");
            if (photo.PublicId != null)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
                
            }
            user.Photos.Remove(photo);
            if (await _userRepo.SaveChangesAsync()) return Ok();
            return BadRequest("cannot delete photo");
        }

    }
}
