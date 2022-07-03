using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.Model;
using CY_API.Configs;
using CY_API.Models.BaseModels;

namespace CY_API.Repositories.Interfaces
{
    public interface IGlobalRepository
    {
        public Task<CreateTableResponse?> CreateTableAsync();

        public Task<IEnumerable<T>> GetAsync<T>(IDynamoDbEntry item);
        public Task<IEnumerable<T>> GetAsync<T>(string PK);
        public Task SaveAsync<T>(T item);
        public Task DeleteAsync<T>(T item);
    }
}
