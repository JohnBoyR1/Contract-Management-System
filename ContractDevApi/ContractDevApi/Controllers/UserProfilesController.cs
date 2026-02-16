using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ContractDevApi.DTOs;
using ContractDevApi.Models;
using ContractDevApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Configuration;

namespace ContractDevApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfilesController : ControllerBase
    {
        private readonly ContractDevContext _context;

        private readonly JwtService _jwt;

        public UserProfilesController(ContractDevContext context, JwtService jwt)
        {
            _context = context;
            _jwt = jwt;
        }

        //-----------------------
        //Update Profle - Requires that logged in user is authenticated, Checks JWT and Cookie auth
        //Recieves id of user from Front-End and updated profile fields
        //Empty or null values are ignored for updated fields - prevents dataloss
        //-----------------------
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProfile(int id, ProfileUpdateDto dto)
        {
            var profile = await _context.UserProfiles.FindAsync(id);

            if (profile == null) return NotFound("User not found");

            if (dto.PhoneNumber != null) profile.PhoneNumber = dto.PhoneNumber;
            if (dto.Bio != null) profile.Bio = dto.Bio;
            if (dto.AvailableForWork.HasValue) profile.AvailableForWork = dto.AvailableForWork;
            if (dto.OfferingWork.HasValue) profile.OfferingWork = dto.OfferingWork;
            if (dto.DisplayUserName.HasValue) profile.DisplayUserName = dto.DisplayUserName;
            if (dto.HidePhoneNumber.HasValue) profile.HidePhoneNumber = dto.HidePhoneNumber;

            int result = await _context.SaveChangesAsync();

            return Ok(new { message = "Profile updated successfully" });
        }

        //-----------------------
        //Get Profile Details - receives user id from Front-End
        //Construct full user and profile entity from shared userid and sends that back to front-end as response
        //-----------------------
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProfileDetails(int id)
        {
            var user = await _context.UserAccounts.FindAsync(id);
            if (user == null) return NotFound("User not found");

            var profile = await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserAccountId == id);
            if (profile == null) return NotFound("Profile not found");

            var response = new ProfileResponseDto
            {
                UserId = user.UserAccountId,
                FirstName = profile.FirstName,
                LastName = profile.LastName,
                Username = profile.Username,
                Email = user.Email,
                PhoneNumber = profile.PhoneNumber,
                Country = profile.Country,
                Description = profile.Description,
                Bio = profile.Bio,
                AvailableForWork = profile.AvailableForWork,
                OfferingWork = profile.OfferingWork,
                DisplayUserName = profile.DisplayUserName,
                HidePhoneNumber = profile.HidePhoneNumber
            };

            return Ok(response);
        }

        //-----------------------
        //Get All Users - Used in Front-End to build gallary of user profiles
        //Method uses linq query to construct complete list of user entities
        //Joins both tables on shared attribute - UserAccountId
        //Reponds to Front-End with List of Profile Response Dto, with expected naming scheme on Front-End
        //-----------------------
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var profiles = await _context.UserProfiles.ToListAsync();
            var users = await _context.UserAccounts.ToListAsync();

            var result =
            from u in users
            join p in profiles
                on u.UserAccountId equals p.UserAccountId
            select new ProfileResponseDto
            {
                UserId = u.UserAccountId,
                FirstName = p.FirstName,
                LastName = p.LastName,
                Username = p.Username,
                Email = u.Email,
                PhoneNumber = p.PhoneNumber,
                Country = p.Country,
                Description = p.Description,
                Bio = p.Bio,
                AvailableForWork = p.AvailableForWork,
                OfferingWork = p.OfferingWork,
                DisplayUserName = p.DisplayUserName,
                HidePhoneNumber = p.HidePhoneNumber
            };


            return Ok(result);
        }
    }
}
