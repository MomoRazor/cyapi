using Amazon.DynamoDBv2.Model;
using CY_API.Controllers.Interfaces;
using CY_API.Models;
using CY_API.Models.Parameters;
using CY_API.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CY_API.Controllers;

public class TableController : ControllerBase
{
    private readonly IGlobalRepository _repository;
    public TableController(IGlobalRepository repository)
    {
        _repository = repository;
    }

    [HttpPost("/table")]
    public async Task<CreateTableResponse?> Post()
    {
        return await _repository.CreateTableAsync();
    }

}