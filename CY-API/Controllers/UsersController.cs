using CY_API.Controllers.Interfaces;
using CY_API.Models;
using CY_API.Models.Parameters;
using CY_API.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CY_API.Controllers;

public class UsersController : ControllerBase, ICrudController<User, UserParameters>
{
    private readonly IUserRepository _repository;

    public UsersController(IUserRepository userRepository)
    {
        _repository = userRepository;
    }

    [HttpGet("/users")]
    public async Task<IEnumerable<User>> Get([FromQuery] UserParameters userParams)
    {
        return await _repository.GetUsersAsync();
    }
    [Route("user")]
    [HttpGet("/users/{id}")]
    public async Task<User> Get(string id)
    {
        return await _repository.GetUserAsync(id);
    }

    [HttpPost("/users")]
    public async Task<User> Post([FromBody] User user)
    {
        user.Id = Guid.NewGuid().ToString();
        await _repository.SaveUserAsync(user);
        return user;
    }

    [HttpPost("/users/{id}")]
    public async Task Post(string id, [FromBody] User user)
    {
        user.Id = id;
        await _repository.SaveUserAsync(user);
    }
    [HttpDelete("/users/{id}")]
    public async Task Delete(string id)
    {
        var team = await _repository.GetUserAsync(id);
        await _repository.DeleteUserAsync(team);
    }

    [HttpPost("/set/{id}/admin")]
    public async Task SetAdmin(string id)
    {
        var user = await _repository.GetUserAsync(id);
        user.isAdmin = true;
        await _repository.SaveUserAsync(user);
    }
    [HttpPost("/unset/{id}/admin")]
    public async Task UnsetAdmin(string id)
    {
        var user = await _repository.GetUserAsync(id);
        user.isAdmin = false;
        await _repository.SaveUserAsync(user);
    }

    [HttpGet("/communities/guide/{id}")]
    public async Task<IEnumerable<Community>> GetCommunitiesGuideOf(string id)
    {
        return await _repository.GetGuidesOfAsync(id);
    }

    [HttpGet("/communities/member/{id}")]
    public async Task<Community> GetCommunityMemberOf(string id)
    {
        return (await _repository.GetCommunitiesAsync(id)).FirstOrDefault();
    }
    [HttpGet("/teams/member/{id}")]
    public async Task<IEnumerable<Team>> GetTeamsMemberOf(string id)
    {
        return await _repository.GetTeamsAsync(id);
    }
}