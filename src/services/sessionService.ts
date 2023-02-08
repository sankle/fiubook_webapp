import Cookies from 'js-cookie';

const cookieExpirationDays = 7;

export interface Session {
  token: string;
}

export const setSessionCookie = (session: Session): void => {
  Cookies.remove('session');
  Cookies.set('session', JSON.stringify(session), {
    expires: cookieExpirationDays,
  });
};

export const getSessionCookie = (): Session | null => {
  const sessionCookie = Cookies.get('session');

  if (sessionCookie === undefined) {
    return null;
  } else {
    return JSON.parse(sessionCookie);
  }
};

export const setToken = (token: string): void => {
  setSessionCookie({ token });
  localStorage.setItem('token', token);
};

export const getToken = (): string | null => {
  const sessionCookie = getSessionCookie();
  const localStorageSessionToken = localStorage.getItem('token');

  return localStorageSessionToken || (sessionCookie && sessionCookie.token);
};

export const isUserLoggedIn = (): boolean => {
  return !!getToken();
};
