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
    public class UserReviewsController : ControllerBase
    {
        private readonly ContractDevContext _context;

        private readonly JwtService _jwt;

        //Controller Constructor, builds inmemory database context and JWT token service
        public UserReviewsController(ContractDevContext context, JwtService jwt)
        {
            _context = context;
            _jwt = jwt;
        }

        [Authorize]
        [HttpPost("AddReview")]
        public async Task<IActionResult> AddReview([FromForm] UserReviewDto dto)
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

            //Check if both reviewer and reviewee accounts exist
            var reviewer = await _context.UserAccounts.FindAsync(dto.ReviewerId);
            var reviewee = await _context.UserAccounts.FindAsync(dto.RevieweeId);

            if (reviewer == null || reviewee == null )
            {
                return BadRequest(new { Message = "Unable to find accounts for review"});
            }

            UserRating review = new UserRating
            {
                ReviewerId = dto.ReviewerId,
                UserAccountId = dto.RevieweeId,
                TimeManagementScore = dto.TimeManagementScore,
                PaymentReliabilityScore = dto.PaymentReliabilityScore,
                CommunicationScore = dto.CommunicationScore,
                CollaborationScore = dto.CollaborationScore,
                RecommendationScore = dto.RecomendationScore,
                ReviewerAccount = reviewer,
                RevieweeAccount = reviewee  
            };

            _context.UserRatings.Add(review);

            //Try to update database -- if unsuccessful return error
            try {
                await _context.SaveChangesAsync();
            } catch(DbUpdateException e) {
                return Problem("System error occured. User Profile Update Failed."+e.Message);
            }

            return Ok(new { Message = "Rating Successful"});
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