using CY_API.Models.BaseModels;
using Microsoft.AspNetCore.Mvc;

namespace CY_API.Controllers.Interfaces
{
    public interface ICrudController<T,TParams>
    {
        [HttpGet]
        public Task<IEnumerable<T>> Get([FromQuery] TParams objParams);

        // GET api/values/5
        [HttpGet("{id}")]
        public Task<T> Get(string id);

        // POST api/values
        [HttpPost]
        public Task<T> Post([FromBody] T obj);

        [HttpPost("{id}")]
        public Task Post(string id, [FromBody] T obj);

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public Task Delete(string id);
    }
}
