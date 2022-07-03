using Amazon.DynamoDBv2;
using CY_API.Configs;
using CY_API.Repositories;
using CY_API.Repositories.Interfaces;

namespace CY_API;

public class Startup
{
    private readonly AwsConfig AwsConfig = new AwsConfig();
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
        AwsConfig = Configuration.GetSection("AwsConfig").Get<AwsConfig>();
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container
    public void ConfigureServices(IServiceCollection services)
    {
        services.Configure<AwsConfig>(Configuration);
        services.AddControllers();
        services.AddSingleton<IAmazonDynamoDB>(x => DynamoDBClientFactory.CreateClient(AwsConfig));
        services.AddSingleton<IGlobalRepository,GlobalRepository>();
        services.AddSingleton<IUserRepository, UserRepository>();
        services.AddSingleton<ICommunityRepository, CommunityRepository>();
        services.AddSingleton<ITeamRepository, TeamRepository>();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseHttpsRedirection();

        app.UseRouting();

        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
            endpoints.MapGet("/", async context =>
            {
                await context.Response.WriteAsync("Welcome to running ASP.NET Core on AWS Lambda");
            });
        });
    }
}