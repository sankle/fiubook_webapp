import styles from '@styles/MyBookingsList.module.css';
import BookingCard from './BookingCard';

export default function MyRequestsList(): JSX.Element {
  // const [isPending, startTransition] = useTransition();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const onLoadMore = () =>
  //   startTransition(() => {
  //     loadNext(3);
  //   });
  const data = {
    myBookingsForPublisher: {
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
      {data.myBookingsForPublisher.edges.length ? (
        data.myBookingsForPublisher.edges.map(booking => (
          <div key={booking.node.id} className={styles.cardContainer}>
            <BookingCard isPublisher />
          </div>
        ))
      ) : (
        <p>No hay servicios disponibles</p>
      )}
    </div>
  );
}
