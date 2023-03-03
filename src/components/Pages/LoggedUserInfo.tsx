import { useQuery } from '@apollo/client';
import { BellIcon, InfoIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Heading,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import styles from '@styles/LoggedUserInfo.module.css';
import { NotificationsEdgeType } from 'src/__generated__/graphql';
import { Roles } from '../../global/types';

import { gql } from '../../__generated__/gql';
import NotificationsContent from '../NotificationsContent';

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
          type
          read
          booking {
            id
            start_date
            end_date
            service {
              name
              description
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

export default function loggedUserInfo({ dni }: Props): JSX.Element {
  const { data } = useQuery(notificationsQuery);
  console.log(data);
  return (
    <div className={styles.loggedUserInfoContainer}>
      <HStack alignItems={'center'} marginRight={'5px'}>
        <HStack>
          <Popover>
            <PopoverTrigger>
              <IconButton
                aria-label="Notifications"
                icon={<BellIcon />}
                variant={'ghost'}
                size={'md'}
                fontSize={'20px'}
              ></IconButton>
            </PopoverTrigger>
            {data?.notifications.pageInfo.totalCount && (
              <InfoIcon boxSize={'2'} position={'absolute'} color={'red'} />
            )}
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody>
                <Heading size={'md'}>Notificaciones</Heading>
                <NotificationsContent
                  notifications={
                    data?.notifications.edges as NotificationsEdgeType[]
                  }
                />
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>
        <p className={styles.userName}>{dni}</p>
      </HStack>
      <Avatar name={dni} />
    </div>
  );
}
