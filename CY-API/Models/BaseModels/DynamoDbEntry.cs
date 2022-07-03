using Amazon.DynamoDBv2.DataModel;
using System.Text.Json.Serialization;

namespace CY_API.Models.BaseModels
{
    public class DynamoDbEntry : IDynamoDbEntry
    {
        [JsonIgnore]
        [DynamoDBHashKey]
        public string PK { get; set; }
        [JsonIgnore]
        [DynamoDBRangeKey]
        public string? SK { get; set; }
        [JsonIgnore]
        [DynamoDBGlobalSecondaryIndexHashKey("objType")]
        public string? objType { get; set; }
    }
}
