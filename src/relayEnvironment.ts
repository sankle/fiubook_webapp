import config from '@config/default';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { getToken } from './services/sessionService';

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise:
async function fetchQuery(
  operation: any,
  variables: any,
  _cacheConfig: any,
  _uploadables: any
): Promise<any> {
  const headers: any = {
    'content-type': 'application/json',
  };

  const token = getToken();

  if (token !== null) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(config.graphqlServerUrl, {
    method: 'POST',
    headers,
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
});

export default environment;
