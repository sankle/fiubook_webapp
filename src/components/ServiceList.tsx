import styles from '@styles/ServiceList.module.css';
import ServiceCard from './ServiceCard';
import { gql } from '../__generated__/gql';
import { useQuery } from '@apollo/client';
import { Button, Spinner } from '@chakra-ui/react';

const getServicesQuery = gql(/* GraphQL */ `
  query GetServices($cursor: String) {
    services(first: 2, after: $cursor) {
      edges {
        node {
          id
          name
          granularity
          description
          booking_type
          max_time
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
      }
    }
  }
`);

export default function ServiceList(): JSX.Element {
  // const [isPending, startTransition] = useTransition();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const onLoadMore = () =>
  //   startTransition(() => {
  //     loadNext(3);
  //   });

  const { data, loading, fetchMore } = useQuery(getServicesQuery);

  if (loading || !data) {
    return (
      <div className={styles.servicesContainer}>
        <Spinner />
      </div>
    );
  }

  const pageInfo = data.services.pageInfo;

  return (
    <div className={styles.servicesContainer}>
      {data.services.edges.length ? (
        <>
          {data.services.edges.map(service => (
            <div key={service.node.id} className={styles.cardContainer}>
              <ServiceCard
                name={service.node.name}
                description={service.node.description}
                bookingType={service.node.booking_type}
                maxTime={service.node.max_time}
                granularity={service.node.granularity}
                id={service.node.id}
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
              Mas
            </Button>
          )}
        </>
      ) : (
        <p>No hay servicios disponibles</p>
      )}
    </div>
  );
}
