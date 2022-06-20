using CY_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace CY_API.Controllers;

[Route("api/[controller]")]
public class AssignController : ControllerBase
{
    public IEnumerable<Community> Get()
    {
        throw new NotImplementedException();
    }

    public string Get(int id)
    {
        throw new NotImplementedException();
    }

    public void Post([FromBody] Community poco)
    {
        throw new NotImplementedException();
    }

    public void Post(int id, [FromBody] Community poco)
    {
        throw new NotImplementedException();
    }
    public void Delete(int id)
    {
        throw new NotImplementedException();
    }
}