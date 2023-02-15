import styles from '@styles/MyBookingsList.module.css';
import BookingCard from './BookingCard';
import { gql } from '../__generated__/gql';
import { useQuery } from '@apollo/client';
import { Spinner } from '@chakra-ui/react';
import { Service } from 'src/__generated__/graphql';

const myBookingsQuery = gql(/* GraphQL */ `
  query MyBookingsQuery($cursor: String) {
    myBookings(first: 10, after: $cursor) {
      edges {
        node {
          id
          booking_status
          start_date
          end_date
          service {
            name
            description
          }
        }
      }
    }
  }
`);

export default function MyBookingsList(): JSX.Element {
  const { data, loading } = useQuery(myBookingsQuery);

  if (loading || !data) {
    return <Spinner />;
  }

  return (
    <div className={styles.servicesContainer}>
      {data.myBookings.edges.length ? (
        data.myBookings.edges.map(booking => (
          <div key={booking.node.id} className={styles.cardContainer}>
            <BookingCard
              isPublisher={false}
              startDate={booking.node.start_date}
              endDate={booking.node.end_date}
              bookingStatus={booking.node.booking_status}
              service={booking.node.service as Service}
            />
          </div>
        ))
      ) : (
        <p>No hay servicios disponibles</p>
      )}
    </div>
  );
}
