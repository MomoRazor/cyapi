using Amazon;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using CY_API.Configs;

namespace CY_API.Repositories
{
    public class DynamoDBClientFactory
    {
        private readonly string Table;
        DynamoDBContext Context;
        public static AmazonDynamoDBClient CreateClient(AwsConfig awsConfig)
        {
            var dynamoDbConfig = new AmazonDynamoDBConfig
            {
                RegionEndpoint = RegionEndpoint.GetBySystemName(awsConfig.AwsRegion)
            };
            var awsCredentials = new AwsCredentials(awsConfig);
            return new AmazonDynamoDBClient(awsCredentials, dynamoDbConfig);
        }
    }
}
