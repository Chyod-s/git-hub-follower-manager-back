import { fetchUserFollowData } from "../fetchUserFollowData/fetchUserFollowDataUseCase";

export async function checkUnfollowAndFollow(userName: string): Promise<string[] | null> {
    const userToFollow: string[] = [];
    
    const userFollowData = await fetchUserFollowData(userName);
    if (!userFollowData) 
        return null;

    const following = userFollowData.following;
    const followers = userFollowData.followers;

    followers.forEach(user => {
        if (!following.has(user))  // ← .has() para Set
            userToFollow.push(user);
    });
    
    if (userToFollow.length === 0) 
        return ['No user to follow'];

    return userToFollow;
}
