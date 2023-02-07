import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import '@styles/index.module.css';
import theme from './themes/default';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import RelayContext from './contexts/RelayContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RelayContext>
        <App />
      </RelayContext>
    </ChakraProvider>
  </React.StrictMode>
);
