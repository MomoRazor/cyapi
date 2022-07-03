using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.DynamoDBv2.Model;
using CY_API.Configs;
using CY_API.Models.BaseModels;
using CY_API.Repositories.Interfaces;

namespace CY_API.Repositories
{
    public class GlobalRepository : IGlobalRepository
    {
        protected readonly string _tableName = "CY-DB";
        protected readonly IAmazonDynamoDB _client;
        protected readonly IDynamoDBContext _context;
        protected readonly DynamoDBOperationConfig _operationConfig;

        public GlobalRepository(IAmazonDynamoDB dynamoDB)
        {
            _client = dynamoDB;
            _context = new DynamoDBContext(dynamoDB);

            _operationConfig = new DynamoDBOperationConfig
            {
                OverrideTableName = _tableName
            };
        }
        public async Task<CreateTableResponse?> CreateTableAsync()
        {
            var request = new CreateTableRequest
            {
                TableName = _tableName,
                KeySchema = new List<KeySchemaElement>
                {
                    new KeySchemaElement
                    {
                        AttributeName = "PK",
                        KeyType = "HASH"
                    },
                    new KeySchemaElement
                    {
                        AttributeName = "SK",
                        KeyType = "RANGE"
                    }
                },
                AttributeDefinitions = new List<AttributeDefinition>
                {
                    new AttributeDefinition
                    {
                        AttributeName = "PK",
                        AttributeType = "S"
                    },
                    new AttributeDefinition
                    {
                        AttributeName = "SK",
                        AttributeType = "S"
                    },
                    new AttributeDefinition
                    {
                        AttributeName = "Type",
                        AttributeType = "S"
                    }
                },
                GlobalSecondaryIndexes = new List<GlobalSecondaryIndex>
                {
                    new GlobalSecondaryIndex
                    {
                        IndexName = "typeIndex",
                        KeySchema = new List<KeySchemaElement>()
                        {
                            new KeySchemaElement()
                            {
                                AttributeName = "objType",
                                KeyType = "HASH"
                            }
                        },
                        Projection = new Projection()
                        {
                            ProjectionType = "ALL"
                        },
                        ProvisionedThroughput = new ProvisionedThroughput()
                        {
                            ReadCapacityUnits = 10,
                            WriteCapacityUnits = 10
                        }
                    }
                },
                ProvisionedThroughput = new ProvisionedThroughput
                {
                    ReadCapacityUnits = 10,
                    WriteCapacityUnits = 10
                },
                StreamSpecification = new StreamSpecification
                {
                    StreamEnabled = true,
                    StreamViewType = StreamViewType.NEW_AND_OLD_IMAGES
                }
            };

            return await _client.CreateTableAsync(request);
        }

        public async Task SaveAsync<T>(T item)
        {
            await _context.SaveAsync(item, _operationConfig);
        }
        public async Task<IEnumerable<T>> GetAsync<T>(string GSI)
        {
            AsyncSearch<T> query;
            
            query = _context.FromQueryAsync<T>(new QueryOperationConfig()
            {
                IndexName = "typeIndex",
                KeyExpression = new Expression()
                {
                    ExpressionAttributeValues = new Dictionary<string, DynamoDBEntry>()
                    {
                        {":Type",GSI }
                    },
                    ExpressionStatement = "objType = :Type"
                }
            },_operationConfig);
            return await query.GetRemainingAsync();

        }
        public async Task<IEnumerable<T>> GetAsync<T>(IDynamoDbEntry item)
        {
            AsyncSearch<T> query;
            if (item.SK != null)
            {
                query = _context.QueryAsync<T>(item.PK, QueryOperator.BeginsWith, values: new string[] { item.SK },_operationConfig);
            }
            else
            {
                query = _context.QueryAsync<T>(item.PK, _operationConfig);
            }
            return await query.GetRemainingAsync();

        }
        public async Task DeleteAsync<T>(T item)
        {
            await _context.DeleteAsync(value: item, _operationConfig);
        }
    }
}
