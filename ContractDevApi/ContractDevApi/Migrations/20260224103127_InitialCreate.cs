using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ContractDevApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:Enum:public.title", "developer,client,both");

            migrationBuilder.CreateTable(
                name: "user_accounts",
                columns: table => new
                {
                    user_account_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_signup_email = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    security_question = table.Column<string>(type: "text", nullable: false),
                    security_answer = table.Column<string>(type: "text", nullable: false),
                    hashed_password = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_accounts", x => x.user_account_id);
                    table.CheckConstraint("allowed_email_providers", "user_signup_email ILIKE '%@gmail.com' OR user_signup_email ILIKE '%@outlook.com' OR user_signup_email ILIKE '%@icloud.com' OR user_signup_email ILIKE '%@yahoo.com' OR user_signup_email ILIKE '%@hotmail.com' OR user_signup_email ILIKE '%@proton.me' OR user_signup_email ILIKE '%@protonmail.com' OR user_signup_email ILIKE '%@pm.me'");
                });

            migrationBuilder.CreateTable(
                name: "social_connections",
                columns: table => new
                {
                    user_account_id = table.Column<int>(type: "integer", nullable: false),
                    facebook_link = table.Column<string>(type: "text", nullable: false),
                    user_social_email_link = table.Column<string>(type: "text", nullable: false),
                    x_link = table.Column<string>(type: "text", nullable: false),
                    github_link = table.Column<string>(type: "text", nullable: false),
                    linkedin_link = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_social_connections", x => x.user_account_id);
                    table.ForeignKey(
                        name: "fk_social_connections_user_accounts_user_account_id",
                        column: x => x.user_account_id,
                        principalTable: "user_accounts",
                        principalColumn: "user_account_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "user_profiles",
                columns: table => new
                {
                    user_profile_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    username = table.Column<string>(type: "varchar(50)", maxLength: 100, nullable: false),
                    first_name = table.Column<string>(type: "varchar(30)", maxLength: 100, nullable: false),
                    last_name = table.Column<string>(type: "varchar(30)", maxLength: 100, nullable: false),
                    country = table.Column<string>(type: "varchar(2)", maxLength: 2, nullable: false),
                    bio = table.Column<string>(type: "varchar(255)", nullable: false),
                    phone_number = table.Column<string>(type: "varchar(20)", maxLength: 15, nullable: false),
                    user_title = table.Column<string>(type: "text", nullable: false),
                    available_for_work = table.Column<bool>(type: "boolean", nullable: true),
                    offering_work = table.Column<bool>(type: "boolean", nullable: true),
                    last_login = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    username_display = table.Column<bool>(type: "boolean", nullable: true),
                    hide_phone_number = table.Column<bool>(type: "boolean", nullable: true),
                    profile_picture_filepath = table.Column<string>(type: "varchar(512)", nullable: false),
                    profile_picture_extension = table.Column<string>(type: "varchar(5)", nullable: false),
                    user_account_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_profiles", x => x.user_profile_id);
                    table.CheckConstraint("allowed_user_titles", "user_title ILIKE 'developer' OR user_title ILIKE 'client' OR user_title ILIKE 'both'");
                    table.ForeignKey(
                        name: "fk_user_profiles_user_accounts_user_account_id",
                        column: x => x.user_account_id,
                        principalTable: "user_accounts",
                        principalColumn: "user_account_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "user_reviews",
                columns: table => new
                {
                    user_account_id = table.Column<int>(type: "integer", nullable: false),
                    number_of_reviews = table.Column<int>(type: "integer", nullable: false),
                    total_review_points = table.Column<float>(type: "real", nullable: false),
                    average_review_score = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_reviews", x => x.user_account_id);
                    table.ForeignKey(
                        name: "fk_user_reviews_user_accounts_user_account_id",
                        column: x => x.user_account_id,
                        principalTable: "user_accounts",
                        principalColumn: "user_account_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_user_accounts_user_signup_email",
                table: "user_accounts",
                column: "user_signup_email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_user_profiles_user_account_id",
                table: "user_profiles",
                column: "user_account_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "social_connections");

            migrationBuilder.DropTable(
                name: "user_profiles");

            migrationBuilder.DropTable(
                name: "user_reviews");

            migrationBuilder.DropTable(
                name: "user_accounts");
        }
    }
}
