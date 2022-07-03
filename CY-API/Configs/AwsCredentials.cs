using Amazon.Runtime;

namespace CY_API.Configs
{
    public class AwsCredentials : AWSCredentials
	{
		private readonly AwsConfig _awsConfig;

		public AwsCredentials(AwsConfig awsConfig)
		{
			_awsConfig = awsConfig;
		}

		public override ImmutableCredentials GetCredentials()
		{
			return new ImmutableCredentials(_awsConfig.AwsAccessKey,
							_awsConfig.AwsSecretKey, null);
		}
	}
}
