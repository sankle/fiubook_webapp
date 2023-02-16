import { NavigationBar } from '../NavigationBar';
import styles from '@styles/AdminPage.module.css';
import {
  TabList,
  Tab,
  Tabs,
  InputGroup,
  InputLeftElement,
  Input,
} from '@chakra-ui/react';
import { SearchIcon, SettingsIcon } from '@chakra-ui/icons';
import { useRouter } from 'found';
import { useState } from 'react';
import useLoggedInUserInfoFetch from '../useLoggedInUserInfoFetch';
import { invalidateSession } from '../../../services/sessionService';

const tabIndexToRouteArray = [
  '/admin/services',
  '/admin/bookings',
  '/admin/users',
  '/admin/metrics',
];

export default function AdminPage(props: any): JSX.Element {
  const { match, router } = useRouter();

  const defaultTabIndex = tabIndexToRouteArray.findIndex(
    route => match.location.pathname === route
  );

  const { data, error } = useLoggedInUserInfoFetch();

  // TODO: check if we can move this to a common apollo handler
  if (error || (data && !data.me.is_admin)) {
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
              setTabIndex(tabIndexToRouteArray.indexOf('/admin/services'));
              console.log(
                `setting index to ${tabIndexToRouteArray.indexOf(
                  '/admin/services'
                )}`
              );
              if (searchStringValue !== '') {
                router.replace(`/admin/services?search=${searchStringValue}`);
              } else {
                router.replace(`/admin/services`);
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
            <SettingsIcon />
            &nbsp;&nbsp;Servicios
          </Tab>
          <Tab>
            <SettingsIcon />
            &nbsp;&nbsp;Reservas
          </Tab>
          <Tab>
            <SettingsIcon />
            &nbsp;&nbsp;Usuarios
          </Tab>
          <Tab>
            <SettingsIcon />
            &nbsp;&nbsp;Métricas
          </Tab>
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
