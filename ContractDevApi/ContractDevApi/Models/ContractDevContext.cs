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

        public DbSet<UserReview> UserReviews { get; set; }

        public DbSet<SocialConnection> SocialConnections { get; set; }

        //-----------------------
        //Additional constraint mapping for database tables that Entity Framework requires for valid migrations
        //-----------------------
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //Map database enum to model enum Title
            modelBuilder.HasPostgresEnum<Title>(
                schema: "public",
                name: "title"
            );

            modelBuilder.Entity<UserAccount>(entity =>
            {
                //Map UserAccounts to user_accounts table
                entity.ToTable("user_accounts");

                //Email entity contraints
                entity.ToTable("user_accounts", t => t.HasCheckConstraint(
                    "allowed_email_providers",
                    "user_signup_email ILIKE '%@gmail.com' OR " +
                    "user_signup_email ILIKE '%@outlook.com' OR " +
                    "user_signup_email ILIKE '%@icloud.com' OR " +
                    "user_signup_email ILIKE '%@yahoo.com' OR " +
                    "user_signup_email ILIKE '%@hotmail.com' OR " +
                    "user_signup_email ILIKE '%@proton.me' OR " +
                    "user_signup_email ILIKE '%@protonmail.com' OR " +
                    "user_signup_email ILIKE '%@pm.me'"
                ));
                //Additional DB email constraint, must be unique
                entity.HasIndex(e => e.UserSignupEmail).IsUnique();

            });

            modelBuilder.Entity<UserProfile>(entity =>
            {
                //Map UserProfiles to user_profiles table
                entity.ToTable("user_profiles");

                //UserTitle enum constraint
                entity.ToTable("user_profiles", t => t.HasCheckConstraint(
                    "allowed_descriptions",
                    "description ILIKE 'developer' OR " +
                    "description ILIKE 'client' OR " +
                    "description ILIKE 'both'"
                ));


            });

            modelBuilder.Entity<SocialConnection>(entity =>
            {
                entity.ToTable("social_connections");

            });

            modelBuilder.Entity<UserReview>(entity =>
            {
                entity.ToTable("user_reviews");
            });
        }
    }
}
