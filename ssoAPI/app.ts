import express = require('express');
import bodyParser = require('body-parser');
import { User } from './Interfaces/User.interface';
import { Response, Payload } from './Interfaces/HTTP.interface';
import { SSO } from './SSO/SSO';
import { ResultCollectionUsers, ResultInsertUser, ResultDeleteUser } from './SSO/SSO.interfaces';
import { enviroment } from '../enviroment/enviroment';
const app: express.Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/auth/login', async function(req, res) {
  let sso = new SSO(enviroment.db.user, enviroment.db.password, enviroment.db.host);
  let token: String = '';
  let user: User | undefined;
  sso.login({username: req.body.user, passwd: req.body.passwd}).then((result: ResultCollectionUsers) => {
    let responseToSend: Response;
    if(result.users?.length === 0) {
      res.status(404);
      responseToSend = {
        errorCode: '0',
        payload: {
          description: 'Usuario no encontrado'
        },
      };
      return res.json(responseToSend);
    }
    user = result.users?.pop();
    token = sso.generateToken(enviroment.token.secret, {logged: true, documentID: user?.id});
    responseToSend = {
      errorCode: '0',
      payload: {
        description: 'Usuario encontrado',
        data: {
          user: user,
          token: token
        }
      }
    }
    res.status(200);
    res.json(responseToSend);
  }).catch((error: ResultCollectionUsers) => {
    let responseErrorToSend: Response = {
      errorCode: error.errorCode,
      payload: {
        description: error.description ? error.description : ''
      }
    };
    console.log(error)
    res.status(handleErrors(error.errorCode));
    res.json(responseErrorToSend);
  });
});

app.post('/auth/register', async function(req, res) {
  let sso = new SSO(enviroment.db.user, enviroment.db.password, enviroment.db.host);
  sso.register({
    username: req.body.user,
    passwd: req.body.passwd,
    displayName: req.body.displayName
  }).then((result: ResultInsertUser) => {
    let responseToSend: Response;
    responseToSend = {
      errorCode: '0',
      payload: {
        description: 'Usuario agregado correctamente',
        data: {
          id: result.userId,
        }
      }
    };
    res.status(200);
    res.json(responseToSend);
  }).catch((error: ResultInsertUser) => {
    let responseErrorToSend: Response = {
      errorCode: error.errorCode,
      payload: {
        description: error.description ? error.description : ''
      }
    };
    console.log(error)
    res.status(handleErrors(error.errorCode));
    res.json(responseErrorToSend);
  })
});

app.post('/auth/delete', async function(req, res) {
  let sso = new SSO(enviroment.db.user, enviroment.db.password, enviroment.db.host);
  sso.delete(req.body.userId).then((result: ResultDeleteUser) => {
    let responseToSend: Response;
    responseToSend = {
      errorCode: '0',
      payload: {
        description: 'Usuario borrado correctamente',
        data: {
          registers: result.registersDeleted
        }
      }
    };
    res.status(200);
    res.json(responseToSend);
  }).catch((error: ResultDeleteUser) => {
    let responseToSend: Response = {
      errorCode: error.errorCode,
      payload: {
        description: error.description ? error.description : ''
      }
    };
    console.log(error);
    res.status(handleErrors(error.errorCode));
    res.json(responseToSend);
  });
});

app.post('/auth/users', async function(req, res) {
  let sso = new SSO(enviroment.db.user, enviroment.db.password, enviroment.db.host);
  sso.getUsers().then((result: ResultCollectionUsers) => {
    let responseToSend: Response;
    responseToSend = {
      errorCode: '0',
      payload: {
        description: 'Usuarios encontrados',
        data: {
          users: result.users,
        }
      }
    }
    res.status(200);
    res.json(responseToSend);
  })
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

function handleErrors(errorCode: String) {
  switch(errorCode) {
    case '-1':
    case '-4':
      return 404;
    case '-2':
    case '-3':
      return 500;
    default:
      return 501;
  }
}
