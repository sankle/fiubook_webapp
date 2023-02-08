import styles from '@styles/ServiceList.module.css';
import { graphql } from 'relay-runtime';
import { usePaginationFragment } from 'react-relay';
import { MyBookingsListFragment$key } from './__generated__/MyBookingsListFragment.graphql';
import BookingCard from './BookingCard';

export interface Props {
  bookings: MyBookingsListFragment$key;
}

const MyBookingsListFragment = graphql`
  fragment MyBookingsListFragment on Query
  @refetchable(queryName: "MyBookingsListPaginationQuery")
  @argumentDefinitions(
    cursor: { type: "String" }
    count: { type: Float, defaultValue: 3 }
  ) {
    myBookings(first: $count, after: $cursor)
      @connection(key: "MyBookingsListFragment_myBookings") {
      edges {
        node {
          id
          ...BookingCardFragment
        }
      }
    }
  }
`;

export default function MyBookingsList({ bookings }: Props): JSX.Element {
  // const [isPending, startTransition] = useTransition();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, loadNext } = usePaginationFragment(
    MyBookingsListFragment,
    bookings
  );
  // const onLoadMore = () =>
  //   startTransition(() => {
  //     loadNext(3);
  //   });

  return (
    <div className={styles.servicesContainer}>
      {data.myBookings.edges.length ? (
        data.myBookings.edges.map(booking => (
          <div key={booking.node.id} className={styles.cardContainer}>
            <BookingCard booking={booking.node} />
          </div>
        ))
      ) : (
        <p>No hay servicios disponibles</p>
      )}
    </div>
  );
}
