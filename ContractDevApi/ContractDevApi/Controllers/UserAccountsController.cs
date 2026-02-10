using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ContractDevApi.Models;
using ContractDevApi.DTOs;

namespace ContractDevApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAccountsController : ControllerBase
    {
        private readonly ContractDevContext _context;

        public UserAccountsController(ContractDevContext context)
        {
            _context = context;
        }

        // GET: api/UserAccounts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserAccount>>> GetUserAccounts()
        {
            return await _context.UserAccounts.ToListAsync();
        }

        // GET: api/UserAccounts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserAccount>> GetUserAccount(int id)
        {
            var userAccount = await _context.UserAccounts.FindAsync(id);

            if (userAccount == null)
            {
                return NotFound();
            }

            return userAccount;
        }
        
        
        // POST: api/UserAccounts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UserAccount>> PostUserAccount(UserRegistrationDto dto)
        {
            if (!ModelState.IsValid) return BadRequest("Passwords do not match");

            bool userExists = await _context.UserAccounts.AnyAsync(x => x.Email!.ToLower() == dto.Email!.ToLower() || x.Username!.ToLower() == dto.Username!.ToLower());

            if (userExists) return Conflict("User with that email or username already exists");

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var user = new UserAccount
            {
                Username = dto.Username,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Country = dto.Country,
                Email = dto.Email,
                PasswordHash = passwordHash
            };

            _context.UserAccounts.Add(user);
            await _context.SaveChangesAsync();

            return Ok("User Created");
            
        }

        //TODO
        // PUT: api/UserAccounts/5

        //TODO
        // DELETE: api/UserAccounts/5

    }
}
