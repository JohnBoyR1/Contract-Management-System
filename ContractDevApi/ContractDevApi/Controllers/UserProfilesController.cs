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
using System.IdentityModel.Tokens.Jwt;

namespace ContractDevApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfilesController : ControllerBase
    {
        private readonly ContractDevContext _context;

        private readonly JwtService _jwt;

        //Controller Constructor, builds inmemory database context and JWT token service
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
        [HttpPut("UpdateProfile")]
        public async Task<IActionResult> UpdateProfile([FromForm] ProfileUpdateDto dto)
        {
            //Get the authenticated user ID from JWT token claim
            var authenticatedUserId = GetAuthenticatedUserId();
            if (authenticatedUserId == null)
            {
                return Unauthorized(new { Message = "Invalid token" });
            }

            //Verify the authenticated user is trying to change their own profile
            if (authenticatedUserId.Value != dto.Id)
            {
                return Forbid(); // 403 Forbidden - user is authenticated but attempting to change the profile of another user
            }

            var profile = await _context.UserProfiles.FindAsync(dto.Id);

            if (profile == null) return NotFound("User not found");

            if (dto.PhoneNumber != null) profile.PhoneNumber = dto.PhoneNumber;
            if (dto.Bio != null) profile.Bio = dto.Bio;
            if (dto.AvailableForWork.HasValue) profile.AvailableForWork = dto.AvailableForWork;
            if (dto.OfferingWork.HasValue) profile.OfferingWork = dto.OfferingWork;
            if (dto.DisplayUserName.HasValue) profile.DisplayUserName = dto.DisplayUserName;
            if (dto.HidePhoneNumber.HasValue) profile.HidePhoneNumber = dto.HidePhoneNumber;

            int result = await _context.SaveChangesAsync();

            if (result <= 0) return Problem("System error occured. User Profile Update Failed.");

            return Ok(new { message = "Profile updated successfully" });
        }

        //-----------------------
        //Get Profile Details - receives user id from Front-End
        //Construct full user and profile entity from shared userid and sends that back to front-end as response
        //-----------------------
        [Authorize]
        [HttpGet("ProfileDetails")]
        public async Task<IActionResult> GetProfileDetails([FromQuery] int id)
        {

            //Get the authenticated user ID from JWT token claim
            var authenticatedUserId = GetAuthenticatedUserId();
            if (authenticatedUserId == null)
            {
                return Unauthorized(new { Message = "Invalid token" });
            }

            //Verify the authenticated user is trying to get their own details
            if (authenticatedUserId.Value != id)
            {
                return Forbid(); // 403 Forbidden - user is authenticated but attempting to retrieve the details of another user
            }

            var user = await _context.UserAccounts.FindAsync(id);
            if (user == null) return NotFound("User not found");

            var profile = await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserAccountId == id);
            if (profile == null) return NotFound("Profile not found");

            var profilePicture = await _context.UserFiles.FirstOrDefaultAsync(x => x.UserAccountId == id);
            //if user has no uploaded a file to UserFiles table, default profile picture is used in place

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
                HidePhoneNumber = profile.HidePhoneNumber,
                ProfileImagePath = profilePicture!.FilePath
            };

            return Ok(response);
        }

        //-----------------------
        //Get All Users - Used in Front-End to build gallary of user profiles
        //Method uses linq query to construct complete list of user entities
        //Joins both tables on shared attribute - UserAccountId
        //Reponds to Front-End with List of Profile Response Dto, with expected naming scheme on Front-End
        //-----------------------
        [Authorize]
        [HttpGet("ProfileGallery")]
        public async Task<IActionResult> GetAllUsers()
        {
            var profiles = await _context.UserProfiles.ToListAsync();
            var users = await _context.UserAccounts.ToListAsync();
            var files = await _context.UserFiles.ToListAsync();

            var response =
            from u in users
            join p in profiles
                on u.UserAccountId equals p.UserAccountId
            join f in files
                on u.UserAccountId equals f.UserAccountId
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

            return Ok(response);
        }

        //-----------------------
        //Upload Profile File - used by Frontend to upload profile specific files (e.g., profile picture)
        //Ensure that file upload associated to profile is valid and token user is authorized to make changes
        //-----------------------
        [Authorize]
        [HttpPut("UploadProfileFile")]
        public async Task<IActionResult> UploadProfileFile([FromForm] ProfileUploadDto dto)
        {
            //Get the authenticated user ID from JWT token claim
            var authenticatedUserId = GetAuthenticatedUserId();
            if (authenticatedUserId == null)
            {
                return Unauthorized(new { Message = "Invalid token" });
            }

            //Verify the authenticated user is trying to get their own details
            if (authenticatedUserId.Value != dto.Id)
            {
                return Forbid(); // 403 Forbidden - user is authenticated but attempting to retrieve the details of another user
            }

            //Ensure that user and profile exist
            var user = await _context.UserAccounts.FindAsync(dto.Id);
            if (user == null) return NotFound("User not found");

            var profile = await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserAccountId == dto.Id);
            if (profile == null) return NotFound("Profile not found");

            //Check if file exists
            if (dto.file.Length == 0) return BadRequest("No file uploaded");

            //Define path to save file
            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
            //If directory doesnt exist, create directory for file storage
            if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);

            //Generate unique filename - Security risk if we use user provided filename (prevents collisions and malicious attempts to save file outside of chosen directory (example: "../../../.jpg")
            var fileName = $"{Guid.NewGuid()}{dto.Extension}";
            //Combine filepath and new file name
            var filePath = Path.Combine(folderPath, fileName);

            //relative path for file "/images/filename.jpg"
            var dbRelativePath = $"/images/{fileName}";

            //Use FileStream to save file to image directory
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.file.CopyToAsync(stream);
            }

            //Update existing filepath and extension if such exists, else create new one
            var updateFile = await _context.UserFiles.FirstOrDefaultAsync(x => x.UserAccountId == dto.Id);
            if (updateFile != null)
            {
                updateFile.FilePath = dbRelativePath;
                updateFile.Extension = dto.Extension;
            }else
            {
                var newFile = new UserFile
                {
                    FilePath = filePath,
                    Extension = dto.Extension,
                    UserAccountId = dto.Id,
                    UserAccount = user
                };
            }
            
            int result = await _context.SaveChangesAsync();

            if (result <= 0) return Problem("System error occured. User Profile Image Upload Failed.");

            return Ok(new {path = dbRelativePath});
        }

        //-----------------------
        //Helper method to retrieve JWT token claim and check if user ID matches JWT sub (user ID)
        //Returns null if claim could not be found or if invalid
        //-----------------------
        private int? GetAuthenticatedUserId()
        {
            // The "sub" (subject) claim contains the user ID
            var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                //sub claim not found in token
                return null;
            }

            if (int.TryParse(userIdClaim, out int userId))
            {
                return userId;
            }

            //Unable to parse user ID from claim
            return null;
        }
    }
}
