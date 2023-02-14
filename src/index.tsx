import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import '@styles/index.module.css';
import theme from './themes/default';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import config from '../config/default';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const client = new ApolloClient({
  uri: config.graphqlServerUrl,
  cache: new InMemoryCache(),
});

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </ChakraProvider>
  </React.StrictMode>
);
