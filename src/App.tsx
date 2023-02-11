import LoginPage from './components/Pages/LoginPage/LoginPage';
import HomePage from './components/Pages/HomePage/HomePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';
import { Spinner } from '@chakra-ui/react';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/home',
    element: (
      <Suspense
        fallback={
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        }
      >
        <HomePage />
      </Suspense>
    ),
  },
]);

function App(): JSX.Element {
  return <RouterProvider router={router} />;
}

export default App;
