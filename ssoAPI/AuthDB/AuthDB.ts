const {ObjectID} = require('mongodb');
import { UserRequest, UserRegisterRequest } from "../Interfaces/HTTP.interface";

export class AuthDB {
  dbName: String = 'auth';
  collection: String = 'users';

  constructor(dbName: String) {
    this.dbName = dbName;
  }

  getUsers(client: any) {
    return client.db(this.dbName).collection(this.collection).find({});
  }

  getUser(client: any, user: UserRequest) {
    return client.db(this.dbName).collection(this.collection).find({userName: user.username, passwd: user.passwd});
  }

  registerUser(client: any, user: UserRegisterRequest) {
    const userToInsert = {...user, admin: false, lastConnection: ''};
    return client.db(this.dbName).collection(this.collection).insertOne(userToInsert);
  }

  deleteUser(client: any, idUser: String) {
    return client.db(this.dbName).collection(this.collection).deleteOne({_id: new ObjectID(idUser)});
  }
  
}