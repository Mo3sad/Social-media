export type UserDataType = {
  _id: string;
  id: string;
  name: string;
  username: string;
  email: string;
  dateOfBirth: string;
  gender: "male" | "female";
  photo: string;
  cover: string;
  createdAt: string;
  bookmarks: string[];
  bookmarksCount: number;
  followers: string[];
  followersCount: number;
  following: string[];
  followingCount: number;
};
