import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import '@styles/index.css';
import theme from './themes/default';
import { RelayEnvironmentProvider } from 'react-relay';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';

// TODO: move to config file
const graphqlServerUrl = 'http://127.0.0.1:3000/graph';

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise:
async function fetchQuery(
  operation: any,
  variables: any,
  cacheConfig: any,
  uploadables: any,
): Promise<any> {
  const res = await fetch(graphqlServerUrl, {
    method: 'POST',
    headers: {
      // Add authentication and other headers here
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: operation.text, // GraphQL text from input
      variables,
    }),
  });

  return await res.json();
}

// Create a network layer from the fetch function
const network = Network.create(fetchQuery);
const store = new Store(new RecordSource());

const environment = new Environment({
  network,
  store,
  // ... other options
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RelayEnvironmentProvider environment={environment}>
        <App />
      </RelayEnvironmentProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
