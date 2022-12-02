import NavigationBar from './NavigationBar';
import styles from '@styles/HomePage.css';
import { useState } from 'react';
import { HomeMenuOptions } from '../../../global/types';

export default function HomePage(): JSX.Element {
  const [currentMenuOption, setCurrentMenuOption] = useState(
    HomeMenuOptions.ServicesList,
  );

  return (
    <div className={styles.pageContainer}>
      <NavigationBar setCurrentMenuOption={setCurrentMenuOption} />
      <div className={styles.pageContent}>
        {currentMenuOption === HomeMenuOptions.ServicesList && (
          <p>Services List</p>
        )}
        {currentMenuOption === HomeMenuOptions.BookingsList && (
          <p>Bookings List</p>
        )}
      </div>
    </div>
  );
}
