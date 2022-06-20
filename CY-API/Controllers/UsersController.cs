using CY_API.Controllers.Interfaces;
using CY_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace CY_API.Controllers;

[Route("api/[controller]")]
public class UsersController : ControllerBase, ICrudController<User,UserParameters>
{

    public IEnumerable<User> Get([FromQuery] UserParameters userParams)
    {
        throw new NotImplementedException();
    }

    public string Get(int id)
    {
        throw new NotImplementedException();
    }

    public void Post([FromBody] User user)
    {
        throw new NotImplementedException();
    }

    public void Post(int id, [FromBody] User user)
    {
        throw new NotImplementedException();
    }
    public void Delete(int id)
    {
        throw new NotImplementedException();
    }
}