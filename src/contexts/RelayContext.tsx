import { useContext, ReactNode } from 'react';
import { RelayEnvironmentProvider } from 'react-relay';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { UserContext } from './UserContext';

// TODO: move to config file
const graphqlServerUrl = 'http://127.0.0.1:3000/graph';

export default function RelayContext({ children }: { children: ReactNode }) {
  const { sessionService } = useContext(UserContext);

  // Define a function that fetches the results of an operation (query/mutation/etc)
  // and returns its results as a Promise:
  async function fetchQuery(
    operation: any,
    variables: any,
    cacheConfig: any,
    uploadables: any,
  ): Promise<any> {
    const userToken = sessionService.getUserToken();

    const headers: any = {
      'content-type': 'application/json',
    };

    if (userToken) {
      headers.Authorization = `Bearer ${userToken}`;
    }

    const res = await fetch(graphqlServerUrl, {
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

  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
}
