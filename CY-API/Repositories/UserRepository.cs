using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.Model;
using CY_API.Configs;
using CY_API.Models;
using CY_API.Models.BaseModels;
using CY_API.Repositories.Interfaces;

namespace CY_API.Repositories
{
    public class UserRepository : GlobalRepository, IUserRepository
    {

        public UserRepository(IAmazonDynamoDB dynamoDB) : base(dynamoDB)
        {
        }
        public async Task SaveUserAsync(User user)
        {
            user.PK = "USER#" + user.Id;
            user.SK = "#DATA#";
            await SaveAsync(user);
        }
        public async Task SaveTeamAsync(string userID, Team team)
        {
            team.PK = "USER#" + userID;
            team.SK = "TEAM#" + team.Name;
            await SaveAsync(team);
        }
        public async Task SaveCommunityAsync(string userID, Community community)
        {
            community.PK = "USER#" + userID;
            community.SK = "COMMUNITY#" + community.Name;
            await SaveAsync(community);
        }
        public async Task SaveGuideOfAsync(string userID, Community community)
        {
            community.PK = "USER#" + userID;
            community.SK = "GUIDEOF#" + community.Name;
            await SaveAsync(community);
        }

        public async Task<User> GetUserAsync(string userID)
        {
            var dynamoDBSearch = new DynamoDbEntry();
            dynamoDBSearch.PK = "USER#" + userID;
            dynamoDBSearch.SK = "#DATA#";
            return (await GetAsync<User>(dynamoDBSearch)).FirstOrDefault();
        }
        public async Task<IEnumerable<User>> GetUsersAsync()
        {
            return (await GetAsync<User>("USER"));
        }
        public async Task<IEnumerable<Team>> GetTeamsAsync(string userID)
        {
            var dynamoDBSearch = new DynamoDbEntry();
            dynamoDBSearch.PK = "USER#" + userID;
            dynamoDBSearch.SK = "TEAM#";
            return (await GetAsync<Team>(dynamoDBSearch));
        }
        public async Task<IEnumerable<Community>> GetCommunitiesAsync(string userID)
        {
            var dynamoDBSearch = new DynamoDbEntry();
            dynamoDBSearch.PK = "USER#" + userID;
            dynamoDBSearch.SK = "COMMUNITY#";
            return (await GetAsync<Community>(dynamoDBSearch));
        }
        public async Task<IEnumerable<Community>> GetGuidesOfAsync(string userID)
        {
            var dynamoDBSearch = new DynamoDbEntry();
            dynamoDBSearch.PK = "USER#" + userID;
            dynamoDBSearch.SK = "GUIDEOF#";
            return (await GetAsync<Community>(dynamoDBSearch));
        }
        public async Task DeleteUserAsync(User user)
        {
            user.PK = "USER#" + user.Id;
            user.SK = "#DATA#";
            await DeleteAsync(user);
        }
        public async Task DeleteTeamAsync(string userID, Team team)
        {
            team.PK = "USER#" + userID;
            team.SK = "TEAM#" + team.Name;
            await DeleteAsync(team);
        }
        public async Task DeleteCommunityAsync(string userID, Community community)
        {
            community.PK = "USER#" + userID;
            community.SK = "COMMUNITY#" + community.Name;
            await DeleteAsync(community);
        }
        public async Task DeleteGuideOfAsync(string userID, Community community)
        {
            community.PK = "USER#" + userID;
            community.SK = "GUIDEOF#" + community.Name;
            await DeleteAsync(community);
        }
    }
}
