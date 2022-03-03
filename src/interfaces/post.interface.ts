
export interface IPost {
  _id?: string;
  userId: string;
  desc?: string;
  img?: string;
  likersId?: string[];
  onTheWallOf?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
