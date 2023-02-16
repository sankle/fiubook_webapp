import styles from '@styles/ServiceList.module.css';
import ServiceCard from './ServiceCard';
import { gql } from '../__generated__/gql';
import { useQuery } from '@apollo/client';
import { Button, Spinner } from '@chakra-ui/react';
import { useRouter } from 'found';
import { useEffect } from 'react';
import { EditIcon } from '@chakra-ui/icons';
import BookServiceModal from './BookServiceModal';

const getMyServicesQuery = gql(/* GraphQL */ `
  query GetMyServices($cursor: String, $queryTerm: String) {
    myServices(first: 6, after: $cursor, query_term: $queryTerm) {
      edges {
        node {
          id
          name
          granularity
          description
          booking_type
          max_time
          allowed_roles
          publisher_id
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
  const { match } = useRouter();

  const { data, loading, fetchMore, refetch } = useQuery(getMyServicesQuery, {
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
    return (
      <div className={styles.servicesContainer}>
        <Spinner />
      </div>
    );
  }

  const pageInfo = data.myServices.pageInfo;

  return (
    <div className={styles.servicesContainer}>
      {data.myServices.edges.length ? (
        <>
          {data.myServices.edges.map((service: any) => (
            <div key={service.node.id} className={styles.cardContainer}>
              <ServiceCard
                service={service.node}
                buttonLabel={'Editar'}
                ButtonIcon={<EditIcon />}
                ModalOnClickButton={BookServiceModal}
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
