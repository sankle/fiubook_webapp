import { createContext, ReactNode } from 'react';
import sessionService from '../services/sessionService';

const UserContext = createContext({ sessionService });

const UserContextProvider = ({ children }: { children: ReactNode }) => (
  <UserContext.Provider value={{ sessionService }}>
    {children}
  </UserContext.Provider>
);

export { UserContext, UserContextProvider };
