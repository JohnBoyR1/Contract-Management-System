using Microsoft.EntityFrameworkCore;

namespace ContractDevApi.Models
{
    public class ContractDevContext : DbContext
    {
        public ContractDevContext(DbContextOptions<ContractDevContext> options) : base(options)
        {
        }

        protected ContractDevContext()
        {
        }
        
        public DbSet<UserAccount> UserAccounts { get; set; }

        public DbSet<UserProfile> UserProfiles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserAccount>(entity =>
            {
                // Configure the recoverCode property to be stored as JSON
                entity.Property(e => e.RecoveryCodesHash)
                    .HasColumnType("jsonb")
                    .HasConversion(
                        v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions)null),
                        v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions)null) ?? new List<string>()
                    );
            });
        }
    }
}
