using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.Model;
using CY_API.Configs;
using CY_API.Models;

namespace CY_API.Repositories.Interfaces
{
    public interface IUserRepository
    {
        public Task SaveUserAsync(User user);
        public Task SaveTeamAsync(string userID, Team team);
        public Task SaveCommunityAsync(string userID, Community community);
        public Task SaveGuideOfAsync(string userID, Community community);

        public Task<User> GetUserAsync(string userID);
        public Task<IEnumerable<User>> GetUsersAsync();
        public Task<IEnumerable<Team>> GetTeamsAsync(string userID);
        public Task<IEnumerable<Community>> GetCommunitiesAsync(string userID);
        public Task<IEnumerable<Community>> GetGuidesOfAsync(string userID);

        public Task DeleteUserAsync(User user);
        public Task DeleteTeamAsync(string userID, Team team);
        public Task DeleteCommunityAsync(string userID, Community community);
        public Task DeleteGuideOfAsync(string userID, Community community);
    }
}
