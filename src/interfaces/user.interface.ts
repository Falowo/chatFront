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
  notCheckedFriendRequestsNumber?:number;
  blocked?: string[];
  isAdmin?: boolean;
  desc?: string;
  city?: string;
  from?: string;
  relationship?: Relationship;
  birthDate?: Date;
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
