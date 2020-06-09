import { User } from "../Interfaces/User.interface";

interface GeneralErrorSSOOperations {
  errorCode: String;
  description?: String;
}

export interface ResultCollectionUsers extends GeneralErrorSSOOperations {
  users?: Array<User>;
  
}

export interface ResultInsertUser extends GeneralErrorSSOOperations {
  userId?: String;
}

export interface ResultDeleteUser extends GeneralErrorSSOOperations {
  registersDeleted?: String;
}
