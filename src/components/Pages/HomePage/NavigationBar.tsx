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
import { gql, useQuery } from '@apollo/client';

export interface Props {
  defaultTabIndex: number;
}

export const tabIndexToRouteArray = [
  '/services',
  '/bookings',
  '/create-service',
  '/requests',
];

const getUserInfoQuery = gql`
  query GetUserInfo {
    me {
      id
      dni
      roles
      is_admin
    }
  }
`;

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
      // TODO hacer algo
      console.log(JSON.stringify(error));
    },
  });

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
            {!loading ? (
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
        {loading ? (
          <Spinner />
        ) : (
          <LoggedUserInfo
            isAdmin={data.me.is_admin}
            roles={data.me.roles}
            dni={data.me.dni}
          />
        )}
      </div>
    </div>
  );
}
