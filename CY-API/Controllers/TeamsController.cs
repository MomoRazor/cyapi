using CY_API.Controllers.Interfaces;
using CY_API.Models;
using CY_API.Models.Parameters;
using CY_API.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CY_API.Controllers;

public class TeamsController : ControllerBase, ICrudController<Team, TeamParameters>
{
    private readonly ITeamRepository _repository;

    public TeamsController(ITeamRepository teamRepository)
    {
        _repository = teamRepository;
    }

    [HttpGet("/teams")]
    public async Task<IEnumerable<Team>> Get([FromQuery] TeamParameters teamParams)
    {
        return await _repository.GetTeamsAsync();
    }

    [HttpGet("/teams/{id}")]
    public async Task<Team> Get(string id)
    {
        return await _repository.GetTeamAsync(id);
    }

    [HttpPost("teams")]
    public async Task<Team> Post([FromBody] Team team)
    {
        team.Id = Guid.NewGuid().ToString();
        await _repository.SaveTeamAsync(team);
        return team;
    }

    [HttpPost("/teams/{id}")]
    public async Task Post(string id, [FromBody] Team team)
    {
        team.Id = id;
        await _repository.SaveTeamAsync(team);
    }

    [HttpDelete("/teams/{id}")]
    public async Task Delete(string id)
    {
        var team = await _repository.GetTeamAsync(id);
        await _repository.DeleteTeamAsync(team);
    }

    [HttpGet("/users/members/team/{id}")]
    public async Task<IEnumerable<User>> GetUsers(string id)
    {
        return await _repository.GetUsersAsync(id);
    }

}