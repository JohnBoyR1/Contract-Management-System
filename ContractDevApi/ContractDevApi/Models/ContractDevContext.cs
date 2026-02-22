using Microsoft.EntityFrameworkCore;

namespace ContractDevApi.Models
{
    //-----------------------
    //Context forms the Model/Table definition sent and received from the database
    //-----------------------
    public class ContractDevContext : DbContext
    {
        public ContractDevContext(DbContextOptions<ContractDevContext> options) : base(options)
        {
        }

        protected ContractDevContext()
        {
        }

        //-----------------------
        //All models that should be reflected on the Database as tables will be defined here using DbSet type
        //-----------------------
        public DbSet<UserAccount> UserAccounts { get; set; }

        public DbSet<UserProfile> UserProfiles { get; set; }

        public DbSet<UserFile> UserFiles { get; set; }

        //-----------------------
        //By default Entity Framework will throw an error when attempting to assign a List as a data type for database
        //To store the two-factor authentication recovery codes, stored here as list of hashed strings
        //it is necessary to define the bespoke insturctions for reading and writing data to and from the database
        //-----------------------
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
