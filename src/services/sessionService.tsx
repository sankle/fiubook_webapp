let cachedUserToken: string;

function getUserToken(): string {
  return cachedUserToken;
}

function setUserToken(token: string) {
  cachedUserToken = token;
}

export default {
  getUserToken,
  setUserToken,
};
