using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.Model;
using CY_API.Configs;
using CY_API.Models;

namespace CY_API.Repositories.Interfaces
{
    public interface ITeamRepository
    {
        public Task SaveTeamAsync(Team team);
        public Task SaveUserAsync(string teamID, User user);

        public Task<Team> GetTeamAsync(string teamID);
        public Task<IEnumerable<Team>> GetTeamsAsync();
        public Task<IEnumerable<User>> GetUsersAsync(string teamID);

        public Task DeleteTeamAsync(Team team);
        public Task DeleteUserAsync(string teamID, User user);
    }
}
