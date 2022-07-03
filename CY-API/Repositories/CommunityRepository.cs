using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.Model;
using CY_API.Configs;
using CY_API.Models;
using CY_API.Models.BaseModels;
using CY_API.Repositories.Interfaces;

namespace CY_API.Repositories
{
    public class CommunityRepository : GlobalRepository, ICommunityRepository
    {

        public CommunityRepository(IAmazonDynamoDB dynamoDB) : base(dynamoDB)
        {
        }
        public async Task SaveCommunityAsync(Community community)
        {
            community.PK = "COMMUNITY#" + community.Id;
            community.SK = "#DATA#";
            await SaveAsync(community);
        }
        public async Task SaveUserAsync(string communityId, User user)
        {
            user.PK = "COMMUNITY#" + communityId;
            user.SK = "USER#" + user.Id;
            await SaveAsync(user);
        }
        public async Task SaveGuideAsync(string communityId, User user)
        {
            user.PK = "COMMUNITY#" + communityId;
            user.SK = "GUIDE#" + user.Id;
            await SaveAsync(user);
        }

        public async Task<Community> GetCommunityAsync(string communityId)
        {
            var dynamoDBSearch = new DynamoDbEntry();
            dynamoDBSearch.PK = "COMMUNITY#" + communityId;
            dynamoDBSearch.SK = "#DATA#";
            return (await GetAsync<Community>(dynamoDBSearch)).FirstOrDefault();
        }
        public async Task<IEnumerable<Community>> GetCommunitiesAsync()
        {
            return (await GetAsync<Community>("COMMUNITY"));
        }
        public async Task<IEnumerable<User>> GetUsersAsync(string communityId)
        {
            var dynamoDBSearch = new DynamoDbEntry();
            dynamoDBSearch.PK = "COMMUNITY#" + communityId;
            dynamoDBSearch.SK = "USER#";
            return (await GetAsync<User>(dynamoDBSearch));
        }
        public async Task<IEnumerable<User>> GetGuidesAsync(string communityId)
        {
            var dynamoDBSearch = new DynamoDbEntry();
            dynamoDBSearch.PK = "COMMUNITY#" + communityId;
            dynamoDBSearch.SK = "GUIDE#";
            return (await GetAsync<User>(dynamoDBSearch));
        }
        public async Task DeleteCommunityAsync(Community community)
        {
            community.PK = "COMMUNITY#" + community.Id;
            community.SK = "#DATA#";
            await DeleteAsync(community);
        }
        public async Task DeleteUserAsync(string communityId, User user)
        {
            user.PK = "COMMUNITY#" + communityId;
            user.SK = "USER#" + user.Id;
            await DeleteAsync(user);
        }
        public async Task DeleteGuideAsync(string communityId, User user)
        {
            user.PK = "COMMUNITY#" + communityId;
            user.SK = "GUIDE#" + user.Id;
            await DeleteAsync(user);
        }
    }
}
