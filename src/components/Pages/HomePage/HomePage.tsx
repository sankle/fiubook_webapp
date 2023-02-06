import NavigationBar from './NavigationBar';
import styles from '@styles/HomePage.module.css';
import { useState } from 'react';
import { HomeMenuOptions } from '../../../global/types';
import ServiceList from '../../ServiceList';
import { graphql } from 'relay-runtime';
import { useLazyLoadQuery } from 'react-relay';
import { HomePageQuery as HomePageQueryType } from './__generated__/HomePageQuery.graphql';

const HomePageQuery = graphql`
  query HomePageQuery {
    ...ServiceListFragment
  }
`;

// const services = [
//   {
//     id: 1,
//     imageUrl:
//       'https://http2.mlstatic.com/D_NQ_NP_2X_648723-MLA42476970499_072020-F.webp',
//     name: 'Designing Data Intensive Applications',
//     description:
//       'Libro Designing Data intensive applications, ofrecido por el departamento de computación. Libro Designing Data intensive applications, ofrecido por el departamento de computación. Libro Designing Data intensive applications, ofrecido por el departamento de computación. ',
//     tags: ['Computación', 'Libro'],
//     bookable: true,
//     minBooking: '1hs',
//     maxBooking: '4hs',
//     requiresConfirmation: true,
//   },
//   {
//     id: 2,
//     imageUrl: 'https://bit.ly/2Z4KKcF',
//     name: 'Casa cheta que tiene un título extremadamente largo que prácticamente no tiene sentido, como la vida... tiene sentido?',
//     description: 'Casa cheta',
//     tags: ['Computación', 'Equipo'],
//     bookable: true,
//     maxBooking: '4hs',
//     requiresConfirmation: true,
//   },
//   {
//     id: 3,
//     imageUrl:
//       'https://pbs.twimg.com/media/DJnDZ9AXcAE2niM?format=jpg&name=large',
//     name: 'Aula 200',
//     description: 'Descripción chiquitita.',
//     tags: ['Bedelía', 'Aula'],
//     bookable: false,
//     requiresConfirmation: true,
//   },
//   {
//     id: 4,
//     name: 'Designing Data Intensive Applications',
//     description:
//       'Libro Designing Data intensive applications, ofrecido por el departamento de computación. Libro Designing Data intensive applications, ofrecido por el departamento de computación. Libro Designing Data intensive applications, ofrecido por el departamento de computación. ',
//     tags: ['Computación', 'Equipo'],
//     bookable: true,
//     minBooking: '1hs',
//     maxBooking: '4hs',
//     requiresConfirmation: true,
//   },
//   {
//     id: 5,
//     name: 'Designing Data Intensive Applications',
//     description:
//       'Libro Designing Data intensive applications, ofrecido por el departamento de computación. Libro Designing Data intensive applications, ofrecido por el departamento de computación. Libro Designing Data intensive applications, ofrecido por el departamento de computación. ',
//     tags: ['Computación', 'Equipo'],
//     bookable: true,
//     maxBooking: '4hs',
//     requiresConfirmation: true,
//   },
// ];

export default function HomePage(): JSX.Element {
  // TODO: replace lazy query with preloaded query
  const data = useLazyLoadQuery<HomePageQueryType>(HomePageQuery, {});

  const [currentMenuOption, setCurrentMenuOption] = useState(
    HomeMenuOptions.ServicesList
  );

  return (
    <div className={styles.pageContainer}>
      <NavigationBar setCurrentMenuOption={setCurrentMenuOption} />
      <div className={styles.pageContent}>
        {currentMenuOption === HomeMenuOptions.ServicesList && (
          <ServiceList services={data} />
        )}
        {currentMenuOption === HomeMenuOptions.BookingsList && (
          <p>Aún no has efectuado ninguna reserva.</p>
        )}
      </div>
    </div>
  );
}
