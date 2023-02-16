import {
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  TabList,
  Tab,
  Tabs,
  Spinner,
} from '@chakra-ui/react';
import {
  AddIcon,
  AtSignIcon,
  CalendarIcon,
  HamburgerIcon,
  SearchIcon,
} from '@chakra-ui/icons';
import fiubaLogo from '@images/fiuba_logo.jpg';
import styles from '@styles/NavigationBar.module.css';
import LoggedUserInfo from './LoggedUserInfo';
import { useRouter } from 'found';
import { useQuery } from '@apollo/client';
import { gql } from '../../../__generated__/gql';
import { Roles } from '../../../global/types';
import { useState } from 'react';

export interface Props {
  defaultTabIndex: number;
}

export const tabIndexToRouteArray = [
  '/services',
  '/bookings',
  '/create-service',
  '/requests',
];

const getUserInfoQuery = gql(/* GraphQL */ `
  query GetUserInfo {
    me {
      id
      dni
      roles
      is_admin
    }
  }
`);

const PublisherTabs = ({
  isAdmin,
  canPublishServices,
}: {
  isAdmin: boolean;
  canPublishServices: boolean;
}) => {
  if (canPublishServices || isAdmin) {
    return (
      <>
        <Tab>
          <AddIcon />
          &nbsp;&nbsp;Nuevo Servicio
        </Tab>
        <Tab>
          <AtSignIcon />
          &nbsp;&nbsp;Solicitudes
        </Tab>
      </>
    );
  }
  return null;
};

export function NavigationBar({ defaultTabIndex }: Props): JSX.Element {
  const { router } = useRouter();
  const { data, loading } = useQuery(getUserInfoQuery, {
    onError: error => {
      console.log(JSON.stringify(error));
    },
  });

  const [tabIndex, setTabIndex] = useState(defaultTabIndex);
  const [searchStringValue, setSearchStringValue] = useState('');

  return (
    <div className={styles.navigationContainer}>
      <div className={styles.leftNavigationContainer}>
        <h1 className={styles.logoTitle}>FIUBOOK</h1>
      </div>
      <div className={styles.centerNavigationContainer}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon />
          </InputLeftElement>
          <Input
            placeholder="Buscar Servicios"
            onChange={event => setSearchStringValue(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                setTabIndex(tabIndexToRouteArray.indexOf('/services'));
                console.log(
                  `setting index to ${tabIndexToRouteArray.indexOf(
                    '/services'
                  )}`
                );
                if (searchStringValue !== '') {
                  router.replace(`/services?search=${searchStringValue}`);
                } else {
                  router.replace(`/services`);
                }
              }
            }}
          />
        </InputGroup>
        <Tabs
          defaultIndex={defaultTabIndex}
          isLazy
          onChange={index => {
            setTabIndex(index);
            router.replace(tabIndexToRouteArray[index]);
          }}
          colorScheme="linkedin"
          index={tabIndex}
        >
          <TabList>
            <Tab>
              <HamburgerIcon />
              &nbsp;&nbsp;Servicios
            </Tab>
            <Tab>
              <CalendarIcon />
              &nbsp;&nbsp;Mis Reservas
            </Tab>
            {!loading && data ? (
              <PublisherTabs
                isAdmin={data.me.is_admin}
                canPublishServices={true}
              />
            ) : null}
          </TabList>
        </Tabs>
      </div>
      <div className={styles.rightNavigationContainer}>
        <Image src={fiubaLogo} className={styles.fiubaLogo} />
        {!loading && data ? (
          <LoggedUserInfo
            isAdmin={data.me.is_admin}
            roles={data.me.roles as Roles[]}
            dni={data.me.dni}
          />
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
}
