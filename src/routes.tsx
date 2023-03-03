import { makeRouteConfig, Redirect, Route } from 'found';
import LoginPage from './components/Pages/LoginPage/LoginPage';
import HomePage from './components/Pages/HomePage/HomePage';
import ServiceList from './components/ServiceList';
import MyBookingsList from './components/MyBookingsList';
import NewServiceForm from './components/NewServiceForm';
import MyRequestsList from './components/MyRequestsList';
import MyServicesList from './components/MyServicesList';
import Profile from './components/Profile';
import AdminPage from './components/Pages/AdminPage/AdminPage';
import AdminServiceList from './components/Pages/AdminPage/AdminServiceList';
import AdminBookingList from './components/Pages/AdminPage/AdminBookingList';
import AdminUserList from './components/Pages/AdminPage/AdminUserList';
import AdminMetrics from './components/Pages/AdminPage/AdminMetrics';

export default makeRouteConfig(
  <>
    <Route path="/" Component={HomePage}>
      <Route path="services" Component={ServiceList} />
      <Route path="requests" Component={MyRequestsList} />
      <Route path="bookings" Component={MyBookingsList} />
      <Route path="create-service" Component={NewServiceForm} />
      <Route path="my-services" Component={MyServicesList} />
      <Route path="profile" Component={Profile} />
    </Route>
    <Route path="login" Component={LoginPage} />
    <Route path="admin" Component={AdminPage}>
      <Route path="services" Component={AdminServiceList} />
      <Route path="bookings" Component={AdminBookingList} />
      <Route path="users" Component={AdminUserList} />
      <Route path="metrics" Component={AdminMetrics} />
    </Route>
    <Redirect from="*" to="/services" />
  </>
);
