import { gql, useQuery } from '@apollo/client';
import { DeleteIcon } from '@chakra-ui/icons';
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
import styles from '@styles/AdminBookingList.module.css';
import { useRouter } from 'found';
import { useEffect } from 'react';
import CancelBookingModal from '../../Modals/CancelBookingModal';
import { renderButtonAndModal } from '../../ServiceCard';

const getBookingsAdminQuery = gql(/* GraphQL */ `
  query GetBookingsAdmin($cursor: String) {
    bookings(first: 3, after: $cursor) {
      edges {
        node {
          id
          booking_status
          start_date
          end_date
          service {
            name
          }
          requestor {
            dni
          }
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

export default function AdminBookingList(): JSX.Element {
  const { match } = useRouter();

  const { data, loading, fetchMore, refetch } = useQuery(
    getBookingsAdminQuery,
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

  if (loading || !data) {
    return (
      <div className={styles.bookingsContainer}>
        <Spinner />
      </div>
    );
  }

  const pageInfo = data.bookings.pageInfo;

  return (
    <div className={styles.bookingsContainer}>
      {data.bookings.edges.length ? (
        <TableContainer>
          <Table variant="simple" colorScheme="linkedin">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Servicio</Th>
                <Th>DNI</Th>
                <Th>Desde</Th>
                <Th>Hasta</Th>
                <Th>Estado</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.bookings.edges.map((booking: any) => {
                const primaryButton = {
                  buttonLabel: 'Cancelar',
                  ButtonIcon: <DeleteIcon />,
                  colorScheme: 'red',
                  Modal: CancelBookingModal,
                  modalProps: {
                    startDateString: booking.node.start_date,
                    serviceName: booking.node.service.name,
                    id: booking.node.id,
                  },
                };

                return (
                  <Tr key={booking.node.id}>
                    <Td>{booking.node.id}</Td>
                    <Td>{booking.node.service.name}</Td>
                    <Td>{booking.node.requestor.dni}</Td>
                    <Td>{booking.node.start_date}</Td>
                    <Td>{booking.node.end_date}</Td>
                    <Td>{booking.node.booking_status}</Td>
                    <Td>
                      <div className={styles.actionButtonsContainer}>
                        {booking.node.booking_status !== 'CANCELLED'
                          ? renderButtonAndModal(
                            primaryButton,
                            isOpenPrimaryModal,
                            onOpenPrimaryModal,
                            onClosePrimaryModal
                          )
                          : '-'}
                      </div>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      ) : null}
      {!data.bookings.edges.length && <p>No hay reservas disponibles</p>}
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
