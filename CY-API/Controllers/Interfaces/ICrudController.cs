using CY_API.Models.BaseModels;
using Microsoft.AspNetCore.Mvc;

namespace CY_API.Controllers.Interfaces
{
    public interface ICrudController<T,TParams>
    {
        [HttpGet]
        public IEnumerable<T> Get([FromQuery] TParams objParams);

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id);

        // POST api/values
        [HttpPost]
        public void Post([FromBody] T obj);

        [HttpPost("{id}")]
        public void Post(int id, [FromBody] T obj);

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id);
    }
}
