export const communityTags = [
  "place",
  "map_point",
  "landmark",
  "other",
] as const;

export type CommunityTag = (typeof communityTags)[number];

