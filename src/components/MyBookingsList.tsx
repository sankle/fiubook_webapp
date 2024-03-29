import styles from '@styles/MyBookingsList.module.css';
import BookingCard from './BookingCard';
import { gql } from '../__generated__/gql';
import { useQuery } from '@apollo/client';
import { Button, Spinner, VStack, Text } from '@chakra-ui/react';
import { Service, User } from 'src/__generated__/graphql';
import { useRouter } from 'found';
import { useEffect } from 'react';

const myBookingsQuery = gql(/* GraphQL */ `
  query MyBookingsQuery($cursor: String, $queryTerm: String) {
    myBookings(first: 6, after: $cursor, query_term: $queryTerm) {
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
            returnable
          }
          requestor {
            dni
          }
        }
      }
      pageInfo {
        startCursor
        hasNextPage
        endCursor
        totalCount
      }
    }
  }
`);

export default function MyBookingsList(): JSX.Element {
  document.title = 'Mis Reservas | FIUBOOK';

  const { match } = useRouter();
  const { data, loading, refetch, fetchMore } = useQuery(myBookingsQuery, {
    variables: {
      queryTerm: match.location.query.search,
    },
  });

  useEffect(() => {
    void refetch({
      queryTerm: match.location.query.search,
    });
  }, [match.location.query.search]);

  if (loading || !data) {
    return <Spinner />;
  }

  const pageInfo = data.myBookings.pageInfo;

  return (
    <div className={styles.servicesContainer}>
      {data.myBookings.edges.length ? (
        <>
          {data.myBookings.edges.map(booking => (
            <div key={booking.node.id} className={styles.cardContainer}>
              <BookingCard
                isPublisher={false}
                startDate={booking.node.start_date}
                endDate={booking.node.end_date}
                bookingStatus={booking.node.booking_status}
                service={booking.node.service as Service}
                id={booking.node.id}
                requestor={booking.node.requestor as User}
              />
            </div>
          ))}
          <VStack>
            <Text color={'gray'}>
              Mostrando {data.myBookings.edges.length} de {pageInfo.totalCount}{' '}
              reservas.
            </Text>
          </VStack>
          {pageInfo.hasNextPage && (
            <Button
              className={styles.loadMoreButton}
              variant={'outline'}
              colorScheme={'linkedin'}
              onClick={() => {
                void fetchMore({
                  variables: {
                    cursor: pageInfo.endCursor,
                  },
                });
              }}
            >
              Más
            </Button>
          )}
        </>
      ) : (
        <p>Aún no tienes ninguna reserva</p>
      )}
    </div>
  );
}
