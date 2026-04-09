using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
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
    public class UserRatingsController : ControllerBase
    {
        private readonly ContractDevContext _context;

        private readonly JwtService _jwt;

        //Controller Constructor, builds inmemory database context and JWT token service
        public UserRatingsController(ContractDevContext context, JwtService jwt)
        {
            _context = context;
            _jwt = jwt;
        }

        [Authorize]
        [HttpPost("AddRating")]
        public async Task<IActionResult> AddRating([FromForm] UserRatingDto dto)
        {
            //Checks UserReviewDto Model to ensure that all incoming values match the Model constraints
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            //Get the authenticated user ID from JWT token claim
            var authenticatedUserId = GetAuthenticatedUserId();
            if (authenticatedUserId == null)
            {
                return Unauthorized(new { Message = "Invalid token" });
            }

            //Verify the authenticated user is trying to add review from own account
            if (authenticatedUserId.Value != dto.ReviewerId)
            {
                return Forbid(); // 403 Forbidden - user is authenticated but attempting to add review from another account
            }

            //Veify that reviewer is not reviewing themsevles
            if (dto.ReviewerId == dto.RevieweeId)
            {
                return BadRequest(new { Message = "Users cannot review themselves"});
            }

            //Check if both reviewer and reviewee accounts exist
            var reviewer = await _context.UserAccounts.FindAsync(dto.ReviewerId);
            var reviewee = await _context.UserAccounts.FindAsync(dto.RevieweeId);

            if (reviewer == null || reviewee == null )
            {
                return BadRequest(new { Message = "Unable to find accounts for review"});
            }

            var existingRating = await _context.UserRatings.FirstOrDefaultAsync(x => x.ReviewerId == dto.ReviewerId && x.RevieweeId == dto.RevieweeId);
            if (existingRating != null)
            {
                //Rating already exists, update existing rating with new values
                existingRating.TimeManagementScore = dto.TimeManagementScore;
                existingRating.PaymentReliabilityScore = dto.PaymentReliabilityScore;
                existingRating.CommunicationScore = dto.CommunicationScore;
                existingRating.CollaborationScore = dto.CollaborationScore;
                existingRating.RecommendationScore = dto.RecommendationScore;
                existingRating.ReviewerAccount = reviewer;
                existingRating.RevieweeAccount = reviewee;
            }else
            {
                //Rating does not exist, create new rating entry
                UserRating review = new UserRating
                {
                    ReviewerId = dto.ReviewerId,
                    RevieweeId = dto.RevieweeId,
                    TimeManagementScore = dto.TimeManagementScore,
                    PaymentReliabilityScore = dto.PaymentReliabilityScore,
                    CommunicationScore = dto.CommunicationScore,
                    CollaborationScore = dto.CollaborationScore,
                    RecommendationScore = dto.RecommendationScore,
                    ReviewerAccount = reviewer,
                    RevieweeAccount = reviewee  
                };
                _context.UserRatings.Add(review);
            }

            //Try to update database -- if unsuccessful return error
            try {
                await _context.SaveChangesAsync();
            } catch(DbUpdateException e) {
                return Problem("System error occured. Add User Rating Failed."+e.Message);
            }

            return Ok(new { Message = "Rating Successful"});
        }

        [Authorize]
        [HttpDelete("DeleteRating")]
        public async Task<IActionResult> DeleteRating([FromForm] UserRatingDeleteDto dto)
        {
            //Checks UserReviewDeleteDto Model to ensure that all incoming values match the Model constraints
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            //Get the authenticated user ID from JWT token claim
            var authenticatedUserId = GetAuthenticatedUserId();
            if (authenticatedUserId == null)
            {
                return Unauthorized(new { Message = "Invalid token" });
            }

            //Verify the authenticated user is trying to add review from own account
            if (authenticatedUserId.Value != dto.ReviewerId)
            {
                return Forbid(); // 403 Forbidden - user is authenticated but attempting to delete review from another account
            }

            //Verify if rating exists
            var existingRating = await _context.UserRatings.FirstOrDefaultAsync(x => x.ReviewerId == dto.ReviewerId && x.RevieweeId == dto.RevieweeId);

            if (existingRating == null)
            {
                return BadRequest(new { Message = "Unable to find rating for deletion" });
            }

            _context.UserRatings.Remove(existingRating);

            //Try to update database -- if unsuccessful return error
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException e)
            {
                return Problem("System error occured. Delete User Rating Failed." + e.Message);
            }

            return Ok(new { Message = "User Rating Deleted."});

        }

        private int? GetAuthenticatedUserId()
        {
            //Retrieve current user from http context - bearer token authentication
            var principal = HttpContext?.User;
            if (principal?.Identity?.IsAuthenticated != true)
            {
                return null; //no bearer token is currently provided - return null for user id
            }

            //The "sub" (subject) claim contains the user ID
            var userIdClaim = principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

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