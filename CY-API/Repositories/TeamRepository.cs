using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.Model;
using CY_API.Configs;
using CY_API.Models;
using CY_API.Models.BaseModels;
using CY_API.Repositories.Interfaces;

namespace CY_API.Repositories
{
    public class TeamRepository : GlobalRepository, ITeamRepository
    {
        public TeamRepository(IAmazonDynamoDB dynamoDB) : base(dynamoDB)
        {
        }
        public async Task SaveTeamAsync(Team team)
        {
            team.PK = "TEAM#" + team.Id;
            team.SK = "#DATA#";
            await SaveAsync(team);
        }
        public async Task SaveUserAsync(string teamId, User user)
        {
            user.PK = "TEAM#" + teamId;
            user.SK = "USER#" + user.Id;
            await SaveAsync(user);
        }
        public async Task<IEnumerable<Team>> GetTeamsAsync()
        {
            return (await GetAsync<Team>("TEAM"));
        }

        public async Task<Team> GetTeamAsync(string teamId)
        {
            var dynamoDBSearch = new DynamoDbEntry();
            dynamoDBSearch.PK = "TEAM#" + teamId;
            dynamoDBSearch.SK = "#DATA#";
            return (await GetAsync<Team>(dynamoDBSearch)).FirstOrDefault();
        }
        public async Task<IEnumerable<User>> GetUsersAsync(string teamId)
        {
            var dynamoDBSearch = new DynamoDbEntry();
            dynamoDBSearch.PK = "TEAM#" + teamId;
            dynamoDBSearch.SK = "USER#";
            return (await GetAsync<User>(dynamoDBSearch));
        }
        public async Task DeleteTeamAsync(Team team)
        {
            team.PK = "TEAM#" + team.Id;
            team.SK = "#DATA#";
            await DeleteAsync(team);
        }
        public async Task DeleteUserAsync(string teamId, User user)
        {
            user.PK = "TEAM#" + teamId;
            user.SK = "USER#" + user.Id;
            await DeleteAsync(user);
        }
    }
}
