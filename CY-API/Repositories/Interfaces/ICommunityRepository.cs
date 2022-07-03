using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.Model;
using CY_API.Configs;
using CY_API.Models;

namespace CY_API.Repositories.Interfaces
{
    public interface ICommunityRepository
    {
        public Task SaveCommunityAsync(Community community);
        public Task SaveUserAsync(string communityName, User user);
        public Task SaveGuideAsync(string communityName, User user);

        public Task<Community> GetCommunityAsync(string communityName);
        public Task<IEnumerable<Community>> GetCommunitiesAsync();
        public Task<IEnumerable<User>> GetUsersAsync(string communityName);
        public Task<IEnumerable<User>> GetGuidesAsync(string communityName);

        public Task DeleteCommunityAsync(Community community);
        public Task DeleteUserAsync(string communityName, User user);
        public Task DeleteGuideAsync(string communityName, User user);
    }
}
