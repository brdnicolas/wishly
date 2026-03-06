import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
});

export function useCollections() {
  return useSWR<Array<{
    id: string;
    name: string;
    description: string | null;
    slug: string;
    isPublic: boolean;
    createdAt: string;
    _count: { wishes: number };
    wishes: { imageUrl: string | null }[];
    role?: "owner" | "collaborator";
  }>>("/api/collections", fetcher);
}

export function useCollection(id: string) {
  return useSWR(id ? `/api/collections/${id}` : null, fetcher);
}

export function useProfile() {
  return useSWR<{
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    description: string | null;
    slug: string | null;
  }>("/api/profile", fetcher);
}

export function useFollowStats() {
  return useSWR<{ followersCount: number; followingCount: number }>(
    "/api/follows/me?tab=stats",
    fetcher
  );
}

export function useFriendCollections() {
  return useSWR("/api/follows/me?tab=friends-collections", fetcher, {
    revalidateOnFocus: false,
  });
}

export function useNotifications() {
  return useSWR<Array<{
    id: string;
    type: string;
    data: Record<string, string | undefined>;
    read: boolean;
    createdAt: string;
  }>>("/api/notifications", fetcher, {
    refreshInterval: 30000,
  });
}
