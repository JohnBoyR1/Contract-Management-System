using System.Runtime.Serialization;

namespace ContractDevApi.Models
{
    public enum Title
    {
        [EnumMember(Value = "developer")]
        Developer,

        [EnumMember(Value = "client")]
        Client,

        [EnumMember(Value = "both")]
        Both
    }
}
