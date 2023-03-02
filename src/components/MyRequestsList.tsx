import styles from '@styles/MyBookingsList.module.css';
import BookingCard from './BookingCard';
import { gql } from '../__generated__/gql';
import { useQuery } from '@apollo/client';
import { Spinner } from '@chakra-ui/spinner';
import { Service, User } from '../__generated__/graphql';
import { Button } from '@chakra-ui/button';
import { useRouter } from 'found';
import { useEffect } from 'react';
import { VStack, Text } from '@chakra-ui/react';

const myRequestsQuery = gql(/* GraphQL */ `
  query MyRequestsQuery($cursor: String, $queryTerm: String) {
    myBookingsForPublisher(first: 6, after: $cursor, query_term: $queryTerm) {
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
          requestor {
            dni
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        totalCount
      }
    }
  }
`);

export default function MyRequestsList(): JSX.Element {
  const { match } = useRouter();

  const { data, loading, fetchMore, refetch } = useQuery(myRequestsQuery, {
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
                requestor={booking.node.requestor as User}
              />
            </div>
          ))}
          <VStack>
            <Text color={'gray'}>
              Mostrando {data.myBookingsForPublisher.edges.length} de{' '}
              {pageInfo.totalCount} reservas.
            </Text>
          </VStack>
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
        <p>Aún no tienes solicitudes de reserva</p>
      )}
    </div>
  );
}
