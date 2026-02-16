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

namespace ContractDevApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfilesController : ControllerBase
    {
        private readonly ContractDevContext _context;

        private readonly JwtService _jwt;   // <-- Inject JWT service

        public UserProfilesController(ContractDevContext context, JwtService jwt)
        {
            _context = context;
            _jwt = jwt;
        }

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

            return Ok(new { message = "Profile update successfully" });
        }

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


        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var profiles = await _context.UserProfiles.ToListAsync();
            var users = await _context.UserAccounts.ToListAsync();

            var listOfUserProfiles = new List<ProfileResponseDto>();

            for (int i = 0; i < profiles.Count; i++)
            {
                var dto = new ProfileResponseDto
                {
                    UserId = users[i].UserAccountId,
                    FirstName = profiles[i].FirstName,
                    LastName = profiles[i].LastName,
                    Username = profiles[i].Username,
                    Email = users[i].Email,
                    PhoneNumber = profiles[i].PhoneNumber,
                    Country = profiles[i].Country,
                    Description = profiles[i].Description,
                    Bio = profiles[i].Bio,
                    AvailableForWork = profiles[i].AvailableForWork,
                    OfferingWork = profiles[i].OfferingWork,
                    DisplayUserName = profiles[i].DisplayUserName,
                    HidePhoneNumber = profiles[i].HidePhoneNumber
                };

                listOfUserProfiles.Add(dto);
            }

            return Ok(listOfUserProfiles);
        }
    }
}
