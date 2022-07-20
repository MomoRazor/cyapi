export * from './user'
import { UserRepo } from './user'
export const userRepo = UserRepo()
userRepo.syncIndexes()

export * from './community'
import { CommunityRepo } from './community'
export const communityRepo = CommunityRepo()
communityRepo.syncIndexes()

export * from './team'
import { TeamRepo } from './team'
export const teamRepo = TeamRepo()
teamRepo.syncIndexes()
