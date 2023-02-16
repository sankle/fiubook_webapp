import styles from '@styles/MyBookingsList.module.css';
import BookingCard from './BookingCard';
import { gql } from '../__generated__/gql';
import { useQuery } from '@apollo/client';
import { Spinner } from '@chakra-ui/spinner';
import { Service } from '../__generated__/graphql';
import { Button } from '@chakra-ui/button';

const myRequestsQuery = gql(/* GraphQL */ `
  query MyRequestsQuery($cursor: String) {
    myBookingsForPublisher(first: 6, after: $cursor) {
      edges {
        node {
          id
          booking_status
          start_date
          end_date
          service {
            name
            description
            tags
            image_url
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`);

export default function MyRequestsList(): JSX.Element {
  const { data, loading, fetchMore } = useQuery(myRequestsQuery);

  if (loading || !data) {
    return <Spinner />;
  }

  const pageInfo = data.myBookingsForPublisher.pageInfo;

  return (
    <div className={styles.servicesContainer}>
      {data.myBookingsForPublisher.edges.length ? (
        <>
          {data.myBookingsForPublisher.edges.map(booking => (
            <div key={booking.node.id} className={styles.cardContainer}>
              <BookingCard
                isPublisher
                bookingStatus={booking.node.booking_status}
                startDate={booking.node.start_date}
                endDate={booking.node.end_date}
                id={booking.node.id}
                service={booking.node.service as Service}
              />
            </div>
          ))}
          {pageInfo.hasNextPage && (
            <Button
              className={styles.loadMoreButton}
              variant={'outline'}
              colorScheme={'linkedin'}
              onClick={() => {
                if (pageInfo.hasNextPage) {
                  void fetchMore({
                    variables: {
                      cursor: pageInfo.endCursor,
                    },
                  });
                }
              }}
            >
              Más
            </Button>
          )}
        </>
      ) : (
        <p>No hay servicios disponibles</p>
      )}
    </div>
  );
}
