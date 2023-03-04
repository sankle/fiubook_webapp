import { useMutation, useQuery } from '@apollo/client';
import { BellIcon, InfoIcon } from '@chakra-ui/icons';
import {
  Heading,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import styles from '@styles/LoggedUserInfo.module.css';
import { useEffect, useState } from 'react';
import { NotificationsEdgeType } from 'src/__generated__/graphql';
import { Roles } from '../../global/types';
import { gql } from '../../__generated__/gql';
import NotificationsContent from '../NotificationsContent';
import { IoMdPerson } from 'react-icons/io';
import { ProfileField } from '../Profile';
import { useRouter } from 'found';

interface Props {
  dni: string;
  roles: Roles[];
  isAdmin: boolean;
}

const notificationsQuery = gql(/* GraphQL */ `
  query GetNotifications($cursor: String) {
    notifications(first: 6, after: $cursor) {
      edges {
        node {
          id
          ts
          type
          read
          booking {
            id
            start_date
            end_date
            service {
              name
              description
              image_url
            }
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        totalCount
      }
    }
  }
`);

const markAsReadMutation = gql(/* GraphQL */ `
  mutation MarkAsRead($until: DateTime!) {
    markAsRead(until: $until)
  }
`);

export default function loggedUserInfo({ dni }: Props): JSX.Element {
  const { router } = useRouter();
  const [showNewNotifications, setShowNewNotifications] = useState(false);
  const { data, fetchMore, startPolling, stopPolling } = useQuery(
    notificationsQuery,
    {
      onCompleted: data => {
        if (data.notifications.pageInfo.totalCount > 0) {
          setShowNewNotifications(true);
        }
      },
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
    }
  );
  const [markAsRead] = useMutation(markAsReadMutation);

  useEffect(() => {
    startPolling(3000);
  }, []);
  return (
    <div className={styles.loggedUserInfoContainer}>
      <div className={styles.dniContainer}>
        <ProfileField name="DNI">
          <Text mt={4}>{dni}</Text>
        </ProfileField>
      </div>
      <HStack>
        <IconButton
          icon={<IoMdPerson />}
          variant={'ghost'}
          size={'md'}
          aria-label={'Profile'}
          onClick={() => router.replace('/profile')}
        />
        <HStack>
          <Popover
            onOpen={() => stopPolling()}
            onClose={() => startPolling(3000)}
          >
            <PopoverTrigger>
              <IconButton
                aria-label="Notifications"
                icon={<BellIcon />}
                variant={'ghost'}
                size={'md'}
                fontSize={'20px'}
                onClick={() => {
                  setShowNewNotifications(false);
                  if ((data?.notifications.pageInfo.totalCount as number) > 0) {
                    console.log(
                      `Marking as read all notifications until:
                        ${data?.notifications.edges[0].node.ts as string}`
                    );
                    void markAsRead({
                      variables: {
                        until: new Date(data?.notifications.edges[0].node.ts),
                      },
                    });
                  }
                }}
              />
            </PopoverTrigger>
            {showNewNotifications && (
              <InfoIcon boxSize={'3'} position={'absolute'} color={'red'} />
            )}
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody>
                <div className={styles.popoverBodyContainer}>
                  <Heading size="md" marginLeft="3px">
                    Notificaciones
                  </Heading>
                  <NotificationsContent
                    notifications={
                      data?.notifications.edges as NotificationsEdgeType[]
                    }
                    hasMore={
                      data?.notifications.pageInfo.hasNextPage as boolean
                    }
                    onLoadMore={() => {
                      void fetchMore({
                        variables: {
                          cursor: data?.notifications.pageInfo.endCursor,
                        },
                      });
                    }}
                  />
                </div>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>
      </HStack>
    </div>
  );
}
