using CY_API.Controllers.Interfaces;
using CY_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace CY_API.Controllers;

[Route("api/[controller]")]
public class CommunitiesController : ControllerBase,ICrudController<Community,CommunityParameters>
{
    public IEnumerable<Community> Get([FromQuery] CommunityParameters communityParams)
    {
        throw new NotImplementedException();
    }

    public string Get(int id)
    {
        throw new NotImplementedException();
    }

    public void Post([FromBody] Community community)
    {
        throw new NotImplementedException();
    }

    public void Post(int id, [FromBody] Community community)
    {
        throw new NotImplementedException();
    }
    public void Delete(int id)
    {
        throw new NotImplementedException();
    }

}