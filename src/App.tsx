import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/Pages/LoginPage/LoginPage';
import HomePage from './components/Pages/HomePage/HomePage';
import { UserContextProvider } from './contexts/UserContext';

function App(): JSX.Element {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
