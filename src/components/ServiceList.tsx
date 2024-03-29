import styles from '@styles/ServiceList.module.css';
import ServiceCard from './ServiceCard';
import { gql } from '../__generated__/gql';
import { useQuery } from '@apollo/client';
import { Button, Spinner, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'found';
import { useEffect } from 'react';
import { CalendarIcon } from '@chakra-ui/icons';
import BookServiceModal from './Modals/BookServiceModal';

const getServicesQuery = gql(/* GraphQL */ `
  query GetServices($cursor: String, $queryTerm: String) {
    services(first: 6, after: $cursor, query_term: $queryTerm) {
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
          tags
          image_url
          returnable
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        totalCount
      }
    }
  }
`);

export default function ServiceList(): JSX.Element {
  document.title = 'Servicios | FIUBOOK';

  const { match } = useRouter();

  const { data, loading, fetchMore, refetch } = useQuery(getServicesQuery, {
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

  const pageInfo = data.services.pageInfo;

  return (
    <div className={styles.servicesContainer}>
      {data.services.edges.length ? (
        <>
          {data.services.edges.map((service: any) => (
            <div key={service.node.id} className={styles.cardContainer}>
              <ServiceCard
                service={service.node}
                primaryButton={{
                  colorScheme: 'linkedin',
                  buttonLabel: 'Reservar',
                  ButtonIcon: <CalendarIcon />,
                  Modal: BookServiceModal,
                  modalProps: { service: service.node },
                }}
                secondaryButton={null}
              />
            </div>
          ))}
          <VStack>
            <Text color={'gray'}>
              Mostrando {data.services.edges.length} de {pageInfo.totalCount}{' '}
              servicios.
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
        <p>No hay servicios disponibles</p>
      )}
    </div>
  );
}
