import { createBrowserRouter } from 'found';
import routes from './routes';

const BrowserRouter = createBrowserRouter({
  routeConfig: routes,
});

function App(): JSX.Element {
  return <BrowserRouter />;
}

export default App;
