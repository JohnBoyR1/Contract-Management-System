namespace ContractDevApi.DTOs
{
    public class ProfileUploadDto
    {
        public int Id { get; set; }
        public IFormFile File { get; set; } = null!;
    }
}
