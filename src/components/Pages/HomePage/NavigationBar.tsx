import {
  Image,
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
} from '@chakra-ui/icons';
import fiubaLogo from '@images/fiuba_logo.jpg';
import styles from '@styles/NavigationBar.module.css';
import LoggedUserInfo from './LoggedUserInfo';
import { useRouter } from 'found';

export interface Props {
  defaultTabIndex: number;
}

export const tabIndexToRouteArray = [
  '/services',
  '/bookings',
  '/create-service',
  '/requests',
];

export function NavigationBar({ defaultTabIndex }: Props): JSX.Element {
  const { router } = useRouter();
  const data = {
    me: {
      can_publish_services: true,
      is_admin: true,
    },
  };

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
          <Input placeholder="Buscar Servicios" />
        </InputGroup>
        <Tabs
          defaultIndex={defaultTabIndex}
          isLazy
          onChange={index => router.replace(tabIndexToRouteArray[index])}
          colorScheme="linkedin"
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
            {(data.me.can_publish_services || data.me.is_admin) && (
              <Tab>
                <AddIcon />
                &nbsp;&nbsp;Nuevo Servicio
              </Tab>
            )}
            {(data.me.can_publish_services || data.me.is_admin) && (
              <Tab>
                <AtSignIcon />
                &nbsp;&nbsp;Solicitudes
              </Tab>
            )}
          </TabList>
        </Tabs>
      </div>
      <div className={styles.rightNavigationContainer}>
        <Image src={fiubaLogo} className={styles.fiubaLogo} />
        <LoggedUserInfo />
      </div>
    </div>
  );
}
