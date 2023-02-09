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
  CalendarIcon,
  HamburgerIcon,
  SearchIcon,
} from '@chakra-ui/icons';
import fiubaLogo from '@images/fiuba_logo.jpg';
import styles from '@styles/NavigationBar.module.css';
import LoggedUserInfo from './LoggedUserInfo';
import { HomeMenuOptions } from '../../../global/types';
import { graphql, useFragment } from 'react-relay';
import { NavigationBarFragment$key } from './__generated__/NavigationBarFragment.graphql';

export interface Props {
  loggedUser: NavigationBarFragment$key;
  setCurrentMenuOption: React.Dispatch<React.SetStateAction<HomeMenuOptions>>;
}

const tabIndexToMenuOptionArray = [
  HomeMenuOptions.ServicesList,
  HomeMenuOptions.BookingsList,
  HomeMenuOptions.NewService,
];

const navigationBarFragment = graphql`
  fragment NavigationBarFragment on Query {
    me {
      is_admin
    }
    ...LoggedUserInfoFragment
  }
`;

export default function NavigationBar({
  loggedUser,
  setCurrentMenuOption,
}: Props): JSX.Element {
  const data = useFragment(navigationBarFragment, loggedUser);
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
          isLazy
          onChange={index =>
            setCurrentMenuOption(tabIndexToMenuOptionArray[index])
          }
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
            <Tab>
              <AddIcon />
              &nbsp;&nbsp;Nuevo Servicio
            </Tab>
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
