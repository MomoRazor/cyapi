using CY_API.Controllers.Interfaces;
using CY_API.Models;
using CY_API.Models.Parameters;
using CY_API.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CY_API.Controllers;

public class CommunitiesController : ControllerBase, ICrudController<Community, CommunityParameters>
{
    private readonly ICommunityRepository _repository;

    public CommunitiesController(ICommunityRepository communityRepository)
    {
        _repository = communityRepository;
    }
    [HttpGet("/communities")]
    public async Task<IEnumerable<Community>> Get([FromQuery] CommunityParameters communityParams)
    {
        return await _repository.GetCommunitiesAsync();
    }
    [HttpGet("/communities/{id}")]
    public async Task<Community> Get(string id)
    {
        return await _repository.GetCommunityAsync(id);
    }
    [HttpPost("/communities")]
    public async Task<Community> Post([FromBody] Community community)
    {
        community.Id = Guid.NewGuid().ToString();
        await _repository.SaveCommunityAsync(community);
        return community;
    }
    [HttpPost("/communities/{id}")]
    public async Task Post(string id, [FromBody] Community community)
    {
        community.Id = id;
        await _repository.SaveCommunityAsync(community);
    }
    [HttpDelete("/communities/{id}")]
    public async Task Delete(string id)
    {
        var community = await _repository.GetCommunityAsync(id);
        await _repository.DeleteCommunityAsync(community);
    }

    [HttpGet("/users/members/community/{id}")]
    public async Task<IEnumerable<User>> GetUsers(string id)
    {
        return await _repository.GetUsersAsync(id);
    }
    [HttpGet("/users/guides/community/{id}")]
    public async Task<IEnumerable<User>> GetGuides(string id)
    {
        return await _repository.GetGuidesAsync(id);
    }
}