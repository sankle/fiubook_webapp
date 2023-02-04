import {
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  TabList,
  Tab,
  Tabs,
} from '@chakra-ui/react';
import { CalendarIcon, HamburgerIcon, SearchIcon } from '@chakra-ui/icons';
import fiubaLogo from '@images/fiuba_logo.jpg';
import styles from '@styles/NavigationBar.module.css';
import LoggedUserInfo from './LoggedUserInfo';
import { HomeMenuOptions } from '../../../global/types';

const tabIndexToMenuOptionArray = [
  HomeMenuOptions.ServicesList,
  HomeMenuOptions.BookingsList,
];

export default function NavigationBar({
  setCurrentMenuOption,
}: {
  setCurrentMenuOption: React.Dispatch<React.SetStateAction<HomeMenuOptions>>;
}): JSX.Element {
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
