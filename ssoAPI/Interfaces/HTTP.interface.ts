export interface Response {
  errorCode: String;
  payload?: Payload;
}

export interface Payload {
  description: String;
  data?: any;
}

export interface UserRequest {
  username: String;
  passwd: String;
}

export interface UserRegisterRequest extends UserRequest {
  displayName: String;
}
