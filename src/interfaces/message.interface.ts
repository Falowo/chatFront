import { IUser } from "./user.interface";


export interface IMessage {
  _id?: string;
  conversationId: string;
  senderId: string;
  receivedByIds?: string[];
  checkedByIds?: string[];
  status?: number;
  text?: string;
  img?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPMessage {
  _id?: string;
  conversationId: string;
  senderId: IUser;
  receivedByIds?: string[];
  checkedByIds?: string[];
  status?: number;
  text?: string;
  img?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
