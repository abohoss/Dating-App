﻿using API.Data;
using API.Entities;
using API.DTOs;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using API.Interfaces;

namespace API.Controllers
{
    public class AccountController(DataContext context, IServiceToken serviceToken) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> register(RegisterDTO registerDTO)
        {
            if(await isTaken(registerDTO.Username))
            {
                return BadRequest("username is already taken");
            }
            using var hmac = new HMACSHA512();
            //var user = new AppUser { 
            //    UserName = registerDTO.Username.ToLower(),
            //    PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password)),
            //    PasswordSalt = hmac.Key 
            //};
            //context.Users.Add(user);
            //await context.SaveChangesAsync();
            //return new UserDto { 
            //    Username = user.UserName,
            //    token = serviceToken.CreateToken(user)
            //};
            return Ok();
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await context.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());
            if (user == null)   return Unauthorized("invalid username");
            using var hmac = new HMACSHA512(user.PasswordSalt);
            var passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
            for (int i = 0; i < passwordHash.Length; i++)
            {
                if(passwordHash[i] != user.PasswordHash[i])
                {
                    return Unauthorized("invalid password");
                }   
            }
            return new UserDto
            {
                Username = user.UserName,
                token = serviceToken.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url
            };
        }
        private async Task<bool> isTaken(string username)
        {
            return await context.Users.AnyAsync(x => x.UserName.ToLower() == username.ToLower());
        }
    }
}
