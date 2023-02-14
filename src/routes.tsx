import { makeRouteConfig, Route } from 'found';
import LoginPage from './components/Pages/LoginPage/LoginPage';
import HomePage from './components/Pages/HomePage/HomePage';
import ServiceList from './components/ServiceList';
import MyBookingsList from './components/MyBookingsList';
import NewServiceForm from './components/NewServiceForm';
import MyRequestsList from './components/MyRequestsList';

export default makeRouteConfig(
  <>
    <Route path="/" Component={HomePage}>
      <Route path="services" Component={ServiceList} />
      <Route path="requests" Component={MyRequestsList} />
      <Route path="bookings" Component={MyBookingsList} />
      <Route path="create-service" Component={NewServiceForm} />
    </Route>
    <Route path="login" Component={LoginPage} />
  </>
);
