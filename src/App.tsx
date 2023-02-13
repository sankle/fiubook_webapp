import { createFarceRouter, createRender } from 'found';
import { BrowserProtocol, queryMiddleware } from 'farce';
import { Resolver } from 'found-relay';
import environment from './relayEnvironment';
import routes from './routes';
import ErrorPage from './components/Pages/ErrorPage/ErrorPage';

const Router = createFarceRouter({
  historyProtocol: new BrowserProtocol(),
  historyMiddlewares: [queryMiddleware],
  routeConfig: routes,
  render: createRender({}),
  renderError: ({ error }) => {
    console.error('(found-relay) renderError');
    return <ErrorPage error={error} />;
  },
});

function App(): JSX.Element {
  return <Router resolver={new Resolver(environment)} />;
}

export default App;
