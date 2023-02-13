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
import { graphql, useFragment } from 'react-relay';
import { NavigationBarFragment$key } from './__generated__/NavigationBarFragment.graphql';
import { useRouter } from 'found';

export interface Props {
  defaultTabIndex: number;
  loggedUser: NavigationBarFragment$key;
}

export const tabIndexToRouteArray = [
  '/services',
  '/bookings',
  '/create-service',
  '/requests',
];

const navigationBarFragment = graphql`
  fragment NavigationBarFragment on Query {
    me {
      is_admin
      can_publish_services
    }
    ...LoggedUserInfoFragment
  }
`;

export function NavigationBar({
  loggedUser,
  defaultTabIndex,
}: Props): JSX.Element {
  const data = useFragment(navigationBarFragment, loggedUser);
  const { router } = useRouter();

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
        <LoggedUserInfo loggedUser={data} />
      </div>
    </div>
  );
}
