import NavigationBar from './NavigationBar';
import styles from '@styles/HomePage.module.css';
import { useState } from 'react';
import { HomeMenuOptions } from '../../../global/types';
import ServiceList from '../../ServiceList';
import { graphql } from 'relay-runtime';
import { useLazyLoadQuery } from 'react-relay';
import { HomePageQuery as HomePageQueryType } from './__generated__/HomePageQuery.graphql';
import MyBookingsList from '../../MyBookingsList';
import NewServiceForm from '../../NewServiceForm';

const HomePageQuery = graphql`
  query HomePageQuery {
    ...ServiceListFragment
    ...NavigationBarFragment
    ...MyBookingsListFragment
  }
`;

export default function HomePage(): JSX.Element {
  // TODO: replace lazy query with preloaded query
  const data = useLazyLoadQuery<HomePageQueryType>(HomePageQuery, {});

  const [currentMenuOption, setCurrentMenuOption] = useState(
    HomeMenuOptions.ServicesList
  );

  return (
    <div className={styles.pageContainer}>
      <NavigationBar
        setCurrentMenuOption={setCurrentMenuOption}
        loggedUser={data}
      />
      <div className={styles.pageContent}>
        {currentMenuOption === HomeMenuOptions.ServicesList && (
          <ServiceList services={data} />
        )}
        {currentMenuOption === HomeMenuOptions.BookingsList && (
          <MyBookingsList bookings={data} />
        )}
        {currentMenuOption === HomeMenuOptions.NewService && <NewServiceForm />}
      </div>
    </div>
  );
}
