import { GetFollowersData } from '../requests/followers-request';
import { GetFollowingData } from '../requests/following-request';
import { getUserData } from '../requests/user-request';

const PER_PAGE = 100;

const MAX_PAGES_PER_LIST = parseInt(process.env.GITHUB_MAX_PAGES ?? '100', 10); // up to 10k entries
const MAX_CONCURRENT = parseInt(process.env.GITHUB_MAX_CONCURRENT ?? '5', 10);

async function runWithConcurrency<T>(
  count: number,
  limit: number,
  worker: (index: number) => Promise<T>,
): Promise<T[]> {
  const results: T[] = new Array(count);
  let next = 0;
  const lanes = Array.from({ length: Math.min(Math.max(limit, 1), Math.max(count, 1)) }, async () => {
    while (true) {
      const i = next++;
      if (i >= count) return;
      results[i] = await worker(i);
    }
  });
  await Promise.all(lanes);
  return results;
}

export async function fetchUserFollowData(
  userName: string,
): Promise<{ followers: Set<string>; following: Set<string> } | null> {
  try {
    const userData = await getUserData(userName);
    if (!userData) return null;

    const followersPageCount = Math.min(
      Math.ceil((userData.Followers ?? 0) / PER_PAGE),
      MAX_PAGES_PER_LIST,
    );
    const followingPageCount = Math.min(
      Math.ceil((userData.Following ?? 0) / PER_PAGE),
      MAX_PAGES_PER_LIST,
    );

    const [followerPages, followingPages] = await Promise.all([
      runWithConcurrency(followersPageCount, MAX_CONCURRENT, (i) =>
        GetFollowersData(userName, i + 1),
      ),
      runWithConcurrency(followingPageCount, MAX_CONCURRENT, (i) =>
        GetFollowingData(userName, i + 1),
      ),
    ]);

    const followers = new Set<string>();
    const following = new Set<string>();

    followerPages.forEach((page) => page?.forEach((f) => followers.add(f.Name)));
    followingPages.forEach((page) => page?.forEach((f) => following.add(f.Name)));

    return { followers, following };
  } catch (error) {
    console.error('Erro ao buscar dados de seguidores/seguidos:', error);
    return null;
  }
}
