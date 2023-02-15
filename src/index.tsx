import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import '@styles/index.module.css';
import theme from './themes/default';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import config from '../config/default';
import { setContext } from '@apollo/client/link/context';
import { getToken } from './services/sessionService';
import { relayStylePagination } from '@apollo/client/utilities';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const baseLink = createHttpLink({
  uri: config.graphqlServerUrl,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        services: relayStylePagination(),
        myBookings: relayStylePagination(),
        myBookingsForPublisher: relayStylePagination(),
      },
    },
  },
});

const client = new ApolloClient({
  link: authLink.concat(baseLink),
  cache,
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
