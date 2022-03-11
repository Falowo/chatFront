enum Relationship {
  Single = 1,
  Married = 2,
  Private = 3,
}

export interface IUser {
  token?: string;
  _id?: string;
  username: string;
  email: string;
  password?: string;
  profilePicture?: string;
  coverPicture?: string;
  followersIds?: string[];
  followedIds?: string[];
  friendsRequestFrom?: string[];
  friendsRequestsTo?: string[];
  friends?: string[];
  notCheckedFriendRequestsFrom?:string[];
  blocked?: string[];
  isAdmin?: boolean;
  desc?: string;
  city?: string;
  from?: string;
  relationship?: Relationship;
  birthDate?: Date;
  numberOfMessages?: number;
}
// export interface IFakeUser {
//   token?: string;
//   _id?: string;
//   username: string;
//   email?: string;
//   password?: string;
//   profilePicture?: string;
//   coverPicture?: string;
//   followersIds?: string[];
//   followedIds?: string[];
//   isAdmin?: boolean;
//   desc?: string;
//   city?: string;
//   from?: string;
//   relationship?: Relationship;
//   birthDate?: Date;
// }
