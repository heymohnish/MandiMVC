using Mandi.Repository.Interface;

namespace Mandi.Controllers.Base
{
	public class RepositoryApiControllerBase<T> : ApiControllerBase where T : IRepository
    {
		protected readonly T repository;

		public RepositoryApiControllerBase(T repository)
		{
			this.repository = repository;
		}
	}
}
