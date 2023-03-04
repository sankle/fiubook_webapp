import { gql, useQuery } from '@apollo/client';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Button,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import styles from '@styles/AdminServiceList.module.css';
import { useRouter } from 'found';
import { useEffect } from 'react';
import DeleteServiceModal from '../../Modals/DeleteServiceModal';
import EditServiceModal from '../../Modals/EditServiceModal';
import { renderButtonAndModal } from '../../ServiceCard';

const getServicesAdminQuery = gql(/* GraphQL */ `
  query GetServicesAdmin($cursor: String, $queryTerm: String) {
    services(first: 10, after: $cursor, query_term: $queryTerm) {
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
      }
    }
  }
`);

export default function AdminServiceList(): JSX.Element {
  document.title = 'Administrar Servicios | FIUBOOK';

  const { match } = useRouter();

  const { data, loading, fetchMore, refetch } = useQuery(
    getServicesAdminQuery,
    {
      variables: {
        queryTerm: match.location.query.search,
      },
    }
  );

  useEffect(() => {
    void refetch({
      queryTerm: match.location.query.search,
    });
  }, [match.location.query.search]);

  const {
    isOpen: isOpenPrimaryModal,
    onOpen: onOpenPrimaryModal,
    onClose: onClosePrimaryModal,
  } = useDisclosure();

  const {
    isOpen: isOpenSecondaryModal,
    onOpen: onOpenSecondaryModal,
    onClose: onCloseSecondaryModal,
  } = useDisclosure();

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
        <TableContainer>
          <Table variant="striped" colorScheme="linkedin">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Nombre</Th>
                <Th>ID del Publicador</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.services.edges.map((service: any) => {
                const primaryButton = {
                  buttonLabel: 'Editar',
                  ButtonIcon: <EditIcon />,
                  colorScheme: 'linkedin',
                  Modal: EditServiceModal,
                  modalProps: { service: service.node },
                };

                const secondaryButton = {
                  buttonLabel: 'Eliminar',
                  ButtonIcon: <DeleteIcon />,
                  colorScheme: 'red',
                  Modal: DeleteServiceModal,
                  modalProps: { service: service.node },
                };

                return (
                  <Tr key={service.node.id}>
                    <Td>{service.node.id}</Td>
                    <Td>{service.node.name}</Td>
                    <Td>{service.node.publisher_id}</Td>
                    <Td>
                      <div className={styles.actionButtonsContainer}>
                        {renderButtonAndModal(
                          primaryButton,
                          isOpenPrimaryModal,
                          onOpenPrimaryModal,
                          onClosePrimaryModal
                        )}
                        {secondaryButton &&
                          renderButtonAndModal(
                            secondaryButton,
                            isOpenSecondaryModal,
                            onOpenSecondaryModal,
                            onCloseSecondaryModal
                          )}
                      </div>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      ) : null}
      {!data.services.edges.length && <p>No hay servicios disponibles</p>}
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
    </div>
  );
}
