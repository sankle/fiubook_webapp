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
import { useState } from 'react';
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

  const getInputGroup = () => {
    return (
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
                `setting index to ${tabIndexToRouteArray.indexOf('/services')}`
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
    );
  };

  const getTabs = () => {
    return (
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
