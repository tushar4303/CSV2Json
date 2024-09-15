export interface IUser {
  name: IName;
  age: number;
  address?: string;
  additionalInfo?: string;
}

export interface IName {
  firstName: string;
  lastName: string;
}