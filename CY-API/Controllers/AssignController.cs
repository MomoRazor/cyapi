using CY_API.Models;
using CY_API.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CY_API.Controllers;

public class AssignController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly ITeamRepository _teamRepository;
    private readonly ICommunityRepository _communityRepository;
    public AssignController(IUserRepository userRepository,ITeamRepository teamRepository,ICommunityRepository communityRepository)
    {
        _userRepository = userRepository;
        _teamRepository = teamRepository;
        _communityRepository = communityRepository;
    }

    [HttpPost("/assign/{userId}/team/{teamId}")]
    public async Task AssignUserTeam(string userId, string teamId)
    {
        var user = await _userRepository.GetUserAsync(userId);
        var team = await _teamRepository.GetTeamAsync(teamId);
        await _userRepository.SaveTeamAsync(userId, team);
        await _teamRepository.SaveUserAsync(teamId, user);
    }
    [HttpPost("/unassign/{userId}/team/{teamId}")]
    public async Task UnassignUserTeam(string userId, string teamId)
    {
        var user = await _userRepository.GetUserAsync(userId);
        var team = await _teamRepository.GetTeamAsync(teamId);
        await _userRepository.DeleteTeamAsync(userId, team);
        await _teamRepository.DeleteUserAsync(teamId, user);
    }
    [Route("assign")]
    [HttpPost("/assign/{userId}/community/{communityId}/member")]
    public async Task AssignUserCommunityMember(string userId, string communityId)
    {
        var user = await _userRepository.GetUserAsync(userId);
        var community = await _communityRepository.GetCommunityAsync(communityId);
        await _userRepository.SaveCommunityAsync(userId, community);
        await _communityRepository.SaveUserAsync(communityId, user);
    }
    [Route("unassign")]
    [HttpPost("/unassign/{userId}/community/{communityId}/member")]
    public async Task UnassignUserCommunityMember(string userId, string communityId)
    {
        var user = await _userRepository.GetUserAsync(userId);
        var community = await _communityRepository.GetCommunityAsync(communityId);
        await _userRepository.DeleteCommunityAsync(userId, community);
        await _communityRepository.DeleteUserAsync(communityId, user);
    }
    [Route("assign")]
    [HttpPost("/assign/{userId}/community/{communityId}/guide")]
    public async Task AssignUserCommunityGuide(string userId, string communityId)
    {
        var user = await _userRepository.GetUserAsync(userId);
        var community = await _communityRepository.GetCommunityAsync(communityId);
        await _userRepository.SaveGuideOfAsync(userId, community);
        await _communityRepository.SaveGuideAsync(communityId, user);
    }
    [Route("unassign")]
    [HttpPost("/unassign/{userId}/community/{communityId}/guide")]
    public async Task UnassignUserCommunityGuide(string userId, string communityId)
    {
        var user = await _userRepository.GetUserAsync(userId);
        var community = await _communityRepository.GetCommunityAsync(communityId);
        await _userRepository.DeleteGuideOfAsync(userId, community);
        await _communityRepository.DeleteGuideAsync(communityId, user);
    }
}