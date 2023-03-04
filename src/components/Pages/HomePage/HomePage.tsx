import { NavigationBar } from '../NavigationBar';
import styles from '@styles/HomePage.module.css';
import {
  Input,
  InputGroup,
  InputLeftElement,
  TabList,
  Tab,
  Tabs,
} from '@chakra-ui/react';
import {
  AddIcon,
  AtSignIcon,
  CalendarIcon,
  HamburgerIcon,
  SearchIcon,
  SettingsIcon,
} from '@chakra-ui/icons';
import { useRouter } from 'found';
import { useEffect, useState } from 'react';
import useLoggedInUserInfoFetch from '../useLoggedInUserInfoFetch';
import { invalidateSession } from '../../../services/sessionService';

const tabIndexToRouteArray = [
  '/services',
  '/bookings',
  '/my-services',
  '/create-service',
  '/requests',
  '/admin',
];

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
          <SettingsIcon />
          &nbsp;&nbsp;Mis Servicios
        </Tab>
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

const getSearchbarPlaceholder = (pathname: string) => {
  if (pathname === '/bookings') {
    return 'Buscar Reservas';
  }
  if (pathname === '/requests') {
    return 'Buscar Solicitudes';
  }
  return 'Buscar Servicios';
};

const getSearchPath = (pathname: string, searchString: string) => {
  if (searchString !== '') {
    return `${pathname}?search=${searchString}`;
  }
  return pathname;
};

export default function HomePage(props: any): JSX.Element {
  const { match, router } = useRouter();

  const defaultTabIndex = tabIndexToRouteArray.findIndex(
    route => match.location.pathname === route
  );

  const { data, error, loading } = useLoggedInUserInfoFetch();

  // TODO: check if we can move this to a common apollo handler
  if (error) {
    invalidateSession();
    router.replace('/login');
  }

  const [tabIndex, setTabIndex] = useState(defaultTabIndex);
  const [searchStringValue, setSearchStringValue] = useState('');

  useEffect(() => {
    setTabIndex(tabIndexToRouteArray.indexOf(match.location.pathname));
  }, [match.location.pathname]);
  const getInputGroup = () => {
    return (
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon />
        </InputLeftElement>
        <Input
          placeholder={getSearchbarPlaceholder(match.location.pathname)}
          onChange={event => setSearchStringValue(event.target.value)}
          disabled={match.location.pathname === '/create-service'}
          value={searchStringValue}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              router.replace(
                getSearchPath(match.location.pathname, searchStringValue)
              );
            }
          }}
        />
      </InputGroup>
    );
  };

  const getTabs = () => {
    return (
      <Tabs
        defaultIndex={defaultTabIndex}
        isLazy
        onChange={index => {
          setSearchStringValue('');
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
              canPublishServices={data.me.can_publish_services}
            />
          ) : null}
        </TabList>
      </Tabs>
    );
  };

  return (
    <div className={styles.pageContainer}>
      <NavigationBar getInputGroup={getInputGroup} getTabs={getTabs} />
      <div className={styles.pageContent}>{props.children}</div>
    </div>
  );
}
