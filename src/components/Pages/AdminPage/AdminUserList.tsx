import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Checkbox,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import styles from '@styles/AdminUserList.module.css';
import { useRouter } from 'found';
import { useEffect } from 'react';
import { getErrorMessage } from '../../../utils/errorUtils';
import {
  userPermissionsModificationFailedToast,
  userPermissionsModifiedSuccessfullyToast,
} from '../../notificationToasts';

const getUsersAdminQuery = gql(/* GraphQL */ `
  query GetUsersAdmin($cursor: String) {
    users(first: 10, after: $cursor) {
      edges {
        node {
          id
          ts
          dni
          roles
          can_publish_services
          is_admin
          is_banned
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

const updateUserMutation = gql(/* GraphQL */ `
  mutation UpdateUserMutation($id: String!, $updateArgs: UpdateUserArgs!) {
    updateUser(id: $id, update_args: $updateArgs) {
      id
    }
  }
`);

export default function AdminBookingList(): JSX.Element {
  document.title = 'Administrar Usuarios | FIUBOOK';

  const { match } = useRouter();
  const toast = useToast();

  const { data, loading, fetchMore, refetch } = useQuery(getUsersAdminQuery, {
    variables: {
      queryTerm: match.location.query.search,
    },
  });

  useEffect(() => {
    void refetch({
      queryTerm: match.location.query.search,
    });
  }, [match.location.query.search]);

  const [updateUser, { loading: mutationLoading }] = useMutation(
    updateUserMutation,
    {
      refetchQueries: ['GetUsersAdmin'],
      onCompleted: response => {
        toast(userPermissionsModifiedSuccessfullyToast(response.updateUser.id));
      },
      onError: error => {
        console.error(JSON.stringify(error));
        toast(userPermissionsModificationFailedToast(getErrorMessage(error)));
      },
    }
  );

  if (loading || !data) {
    return (
      <div className={styles.usersContainer}>
        <Spinner />
      </div>
    );
  }

  const pageInfo = data.users.pageInfo;

  const onUserChange = (
    userId: string,
    propertyToChange: string,
    newValue: any
  ) => {
    void updateUser({
      variables: { id: userId, updateArgs: { [propertyToChange]: newValue } },
    });
  };

  return (
    <div className={styles.usersContainer}>
      {data.users.edges.length ? (
        <TableContainer>
          <Table variant="simple" colorScheme="linkedin">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>DNI</Th>
                <Th>Registro</Th>
                <Th>Estudiante</Th>
                <Th>Profesor</Th>
                <Th>No Docente</Th>
                <Th>Puede Publicar Servicios</Th>
                <Th>Es Administrador</Th>
                <Th>Bloqueado</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.users.edges.map((user: any) => {
                return (
                  <Tr key={user.node.id}>
                    <Td>{user.node.id}</Td>
                    <Td>{user.node.dni}</Td>
                    <Td>{user.node.ts}</Td>
                    <Td>
                      <div className={styles.checkboxContainer}>
                        <Checkbox
                          colorScheme="red"
                          size="lg"
                          isChecked={user.node.roles.includes('STUDENT')}
                          onChange={event => {
                            console.log('checked: ', event.target.checked);
                            onUserChange(
                              user.node.id,
                              'roles',
                              event.target.checked
                                ? [...user.node.roles, 'STUDENT']
                                : user.node.roles.filter(
                                  (role: string) => role !== 'STUDENT'
                                )
                            );
                          }}
                          disabled={mutationLoading}
                        />
                      </div>
                    </Td>
                    <Td>
                      <div className={styles.checkboxContainer}>
                        <Checkbox
                          colorScheme="red"
                          size="lg"
                          isChecked={user.node.roles.includes('PROFESSOR')}
                          onChange={event => {
                            onUserChange(
                              user.node.id,
                              'roles',
                              event.target.checked
                                ? [...user.node.roles, 'PROFESSOR']
                                : user.node.roles.filter(
                                  (role: string) => role !== 'PROFESSOR'
                                )
                            );
                          }}
                          disabled={mutationLoading}
                        />
                      </div>
                    </Td>
                    <Td>
                      <div className={styles.checkboxContainer}>
                        <Checkbox
                          colorScheme="red"
                          size="lg"
                          isChecked={user.node.roles.includes('NODO')}
                          onChange={event => {
                            onUserChange(
                              user.node.id,
                              'roles',
                              event.target.checked
                                ? [...user.node.roles, 'NODO']
                                : user.node.roles.filter(
                                  (role: string) => role !== 'NODO'
                                )
                            );
                          }}
                          disabled={mutationLoading}
                        />
                      </div>
                    </Td>
                    <Td>
                      <div className={styles.checkboxContainer}>
                        <Checkbox
                          colorScheme="red"
                          size="lg"
                          isChecked={user.node.can_publish_services}
                          onChange={event => {
                            onUserChange(
                              user.node.id,
                              'can_publish_services',
                              event.target.checked
                            );
                          }}
                          disabled={mutationLoading}
                        />
                      </div>
                    </Td>
                    <Td>
                      <div className={styles.checkboxContainer}>
                        <Checkbox
                          colorScheme="red"
                          size="lg"
                          isChecked={user.node.is_admin}
                          onChange={event => {
                            onUserChange(
                              user.node.id,
                              'is_admin',
                              event.target.checked
                            );
                          }}
                          disabled={mutationLoading}
                        />
                      </div>
                    </Td>
                    <Td>
                      <div className={styles.checkboxContainer}>
                        <Checkbox
                          colorScheme="red"
                          size="lg"
                          isChecked={user.node.is_banned}
                          onChange={event => {
                            onUserChange(
                              user.node.id,
                              'is_banned',
                              event.target.checked
                            );
                          }}
                          disabled={mutationLoading}
                        />
                      </div>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      ) : null}
      {!data.users.edges.length && <p>No hay usuarios disponibles</p>}
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
