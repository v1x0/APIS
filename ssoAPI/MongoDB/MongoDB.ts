import { MongoConnect } from "./interfaces/MongoConnect";
const {MongoClient} = require('mongodb');

export class MongoDB {

  mongodbConnect: MongoConnect;
  client: any;

  constructor(mongodbObject: MongoConnect) {
    this.mongodbConnect = mongodbObject;
  }

  async connect(): Promise<any> {
    let uri = this.getURI(this.mongodbConnect);
    this.client = new MongoClient(uri);
    return this.client.connect();
  }

  private getURI(mongodb: MongoConnect) {
    let uri = 'mongodb://';
    uri += mongodb.userDB + ':';
    uri += mongodb.password + '@';
    uri += mongodb.url + '/?authSource=admin';
    return uri;
  }

  public getClient(): any {
    return this.client;
  }

}