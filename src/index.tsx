import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import '@styles/index.css';
import theme from './themes/default';
import { UserContextProvider } from './contexts/UserContext';
import RelayContext from './contexts/RelayContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <UserContextProvider>
        <RelayContext>
          <App />
        </RelayContext>
      </UserContextProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
