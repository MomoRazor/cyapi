using Amazon.DynamoDBv2.DataModel;
using CY_API.Models.BaseModels;
using System.Text.Json.Serialization;

namespace CY_API.Models
{
    public class User : IDynamoDbEntry
    {
        [JsonIgnore]
        [DynamoDBHashKey]
        public string PK { get; set; }
        [JsonIgnore]
        [DynamoDBRangeKey]
        public string? SK { get; set; }
        [JsonIgnore]
        [DynamoDBGlobalSecondaryIndexHashKey("objType")]
        public string? objType { get; set; } = "USER";

        [DynamoDBProperty("Id")]
        public string Id { get; set; }
        [DynamoDBProperty("Name")]
        public string Name { get; set; }
        [DynamoDBProperty("Surname")]
        public string Surname { get; set; }
        [DynamoDBProperty("Email")]
        public string Email { get; set; }
        [DynamoDBProperty("isAdmin")]
        public bool isAdmin { get; set; }

    }
}
