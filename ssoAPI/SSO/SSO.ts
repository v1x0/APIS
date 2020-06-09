import { MongoDB } from "../MongoDB/MongoDB";
import { AuthDB } from "../AuthDB/AuthDB";
import { User } from "../Interfaces/User.interface";
import { UserRequest, UserRegisterRequest } from "../Interfaces/HTTP.interface";
import { UserDocument } from "../MongoDB/interfaces/UserDocument.interface";
const jsonwebtoken = require('jsonwebtoken');
import { ResultCollectionUsers, ResultInsertUser, ResultDeleteUser } from "./SSO.interfaces";

export class SSO {

  mongoDriver: any;
  client: any;
  authDB: AuthDB;

  constructor(userDB: String, passwordDB: String, url: String) {
    this.mongoDriver = new MongoDB({
      userDB: userDB,
      password: passwordDB,
      url: url
    });
    this.authDB = new AuthDB('auth');
  }
  
  login(userClient: UserRequest): Promise<ResultCollectionUsers> {
    return new Promise(async (resolve, reject) => {
      try{
        await this.mongoDriver.connect();
        this.client = this.mongoDriver.getClient();
        this.authDB.getUser(this.client, userClient).toArray(function(err: any, data: Array<UserDocument>) {
          if(err) {
            return reject({errorCode: '-1', description: 'Error en la obtencion de la coleccion'})
          }
          let users: Array<User> = data.map((user: UserDocument) => ({name: user.displayName, lastConnection: user.lastConnection, id: user._id, admin: user.admin}));
          return resolve({errorCode: '0', users: users});
        });
      } catch (err) {
        console.log(err);
        return reject({errorCode: '-99', description: 'Error en la base de datos'});
      }
    });
  }

  register(userClientRegister: UserRegisterRequest): Promise<ResultInsertUser> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.mongoDriver.connect();
        this.client = this.mongoDriver.getClient();
        this.authDB.registerUser(this.client, userClientRegister).then(function(data: any) {
          return resolve({errorCode: '0', userId: data.insertedId});
        }).catch(function(err: any) {
          console.log(err);
          return reject({errorCode: '-2', description: 'Error al guardar el usuario'})
        });
      } catch (err) {
        console.log(err);
        return reject({errorCode: '-99', description: 'Error en la base de datos'});
      }
    })
  }

  delete(id: string): Promise<ResultDeleteUser> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.mongoDriver.connect();
        this.client = this.mongoDriver.getClient();
        this.authDB.deleteUser(this.client, id).then(function(data: any) {
          return resolve({errorCode: '0', registersDeleted: data.result.n});
        }).catch(function(error: any) {
          console.log(error);
          return reject({errorCode: '-3', description: 'Error al borrar usuario'});
        })
      } catch (err) {
        console.log(err);
        return reject({errorCode: '-99', description: 'Error en la base de datos'});
      }
    });
  }

  getUsers(): Promise<ResultCollectionUsers> {
    return new Promise(async (resolve, reject) => {
      try{
        await this.mongoDriver.connect();
        this.client = this.mongoDriver.getClient();
        this.authDB.getUsers(this.client).toArray(function(err: any, data: Array<UserDocument>) {
          if(err) {
            return reject({errorCode: '-4', description: 'Error en la obtencion de los usuarios'})
          }
          let users: Array<User> = data.map((user: UserDocument) => ({name: user.displayName, lastConnection: user.lastConnection, id: user._id, admin: user.admin}));
          return resolve({errorCode: '0', users: users});
        });
      } catch (err) {
        console.log(err);
        return reject({errorCode: '-99', description: 'Error en la base de datos'});
      }
    });
  }

  generateToken(secretkey: String, payload: any): String {
    let token = jsonwebtoken.sign(payload, secretkey);
    return token;
  }
}
