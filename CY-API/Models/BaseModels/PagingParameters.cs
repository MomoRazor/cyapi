namespace CY_API.Models.BaseModels
{
    public abstract class PagingParameters
    {
        const int maxLimit = 50;
        public int page { get; set; } = 1;

        private int _limit = 10;
        public int limit
        {
            get
            {
                return _limit;
            }
            set
            {
                _limit = value > maxLimit ? maxLimit : value;
            }
        }
    }
}
