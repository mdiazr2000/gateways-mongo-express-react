import {storeonDevtools} from "storeon/devtools";

const auth = (store) => {
  store.on('@init', () => ({
    auth: {
      accessToken: ''
    }
  }));
  store.on('addToken', ({ auth }, token) => {
    return {
      auth: {
        accessToken: token
      }
    }
  });
  store.on('removeToken', ({ auth }) => {
    return {
      auth: {
        accessToken: ''
      }
    }
  });
}

export default auth;


