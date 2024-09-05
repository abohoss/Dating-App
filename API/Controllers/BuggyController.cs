using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController(DataContext context) : BaseApiController
    {
        [Authorize]
        [HttpGet("auth")]
        public ActionResult<string> Getauth()
        {
            return "secret text";
        }
        [HttpGet("server-error")]
        public  ActionResult<AppUser> GetServerError()
        {
            var thing = context.Users.Find(-1) ?? throw new Exception("bad thing happened");
            return thing;
        }
        [HttpGet("not-found")]
        public  ActionResult<AppUser> GetNotFound()
        {
            var user = context.Users.Find(-1);
            if(user == null) return NotFound();
            return user;
            
        }
        [HttpGet("bad-request")]
        public  ActionResult<string> GetBadRequest()
        {
            return BadRequest("this was a bad request");
        }



    }
}
