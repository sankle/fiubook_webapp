import styles from '@styles/MyBookingsList.module.css';
import BookingCard from './BookingCard';

export default function MyBookingsList(): JSX.Element {
  // const [isPending, startTransition] = useTransition();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const onLoadMore = () =>
  //   startTransition(() => {
  //     loadNext(3);
  //   });

  const data = {
    myBookings: {
      edges: [
        {
          node: {
            id: 1,
          },
        },
      ],
    },
  };

  return (
    <div className={styles.servicesContainer}>
      {data.myBookings.edges.length ? (
        data.myBookings.edges.map(booking => (
          <div key={booking.node.id} className={styles.cardContainer}>
            <BookingCard isPublisher={false} />
          </div>
        ))
      ) : (
        <p>No hay servicios disponibles</p>
      )}
    </div>
  );
}
