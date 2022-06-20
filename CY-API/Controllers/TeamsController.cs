using CY_API.Controllers.Interfaces;
using CY_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace CY_API.Controllers;

[Route("api/[controller]")]
public class TeamsController : ControllerBase,ICrudController<Team,TeamParameters>
{
    public IEnumerable<Team> Get([FromQuery] TeamParameters teamParams)
    {
        throw new NotImplementedException();
    }

    public string Get(int id)
    {
        throw new NotImplementedException();
    }

    public void Post([FromBody] Team team)
    {
        throw new NotImplementedException();
    }

    public void Post(int id, [FromBody] Team team)
    {
        throw new NotImplementedException();
    }
    public void Delete(int id)
    {
        throw new NotImplementedException();
    }
}