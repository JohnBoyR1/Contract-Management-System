using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ContractDevApi.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserAccounts",
                columns: table => new
                {
                    UserAccountId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Email = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    PasswordHash = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    Is2faEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    EncryptedTOTPSecret = table.Column<string>(type: "text", nullable: false),
                    RecoveryCodesHash = table.Column<string>(type: "jsonb", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserAccounts", x => x.UserAccountId);
                });

            migrationBuilder.CreateTable(
                name: "UserProfiles",
                columns: table => new
                {
                    UserProfileId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Username = table.Column<string>(type: "varchar(50)", maxLength: 100, nullable: false),
                    FirstName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    Country = table.Column<string>(type: "varchar(2)", maxLength: 2, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    PhoneNumber = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false),
                    Bio = table.Column<string>(type: "text", nullable: false),
                    AvailableForWork = table.Column<bool>(type: "boolean", nullable: true),
                    OfferingWork = table.Column<bool>(type: "boolean", nullable: true),
                    DisplayUserName = table.Column<bool>(type: "boolean", nullable: true),
                    HidePhoneNumber = table.Column<bool>(type: "boolean", nullable: true),
                    UserAccountId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfiles", x => x.UserProfileId);
                    table.ForeignKey(
                        name: "FK_UserProfiles_UserAccounts_UserAccountId",
                        column: x => x.UserAccountId,
                        principalTable: "UserAccounts",
                        principalColumn: "UserAccountId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserProfiles_UserAccountId",
                table: "UserProfiles",
                column: "UserAccountId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserProfiles");

            migrationBuilder.DropTable(
                name: "UserAccounts");
        }
    }
}
