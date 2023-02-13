import styles from '@styles/MyBookingsList.module.css';
import { graphql } from 'relay-runtime';
import { usePaginationFragment } from 'react-relay';
import BookingCard from './BookingCard';
import { MyRequestsListFragment$key } from './__generated__/MyRequestsListFragment.graphql';

const MyRequestsListFragment = graphql`
  fragment MyRequestsListFragment on Query
  @refetchable(queryName: "MyRequestsListPaginationQuery")
  @argumentDefinitions(
    cursor: { type: "String" }
    count: { type: Float, defaultValue: 3 }
  ) {
    myBookingsForPublisher(first: $count, after: $cursor)
      @connection(key: "bookings_myBookingsForPublisher") {
      edges {
        node {
          id
          ...BookingCardFragment
        }
      }
    }
  }
`;

export default function MyRequestsList(
  requests: MyRequestsListFragment$key
): JSX.Element {
  // const [isPending, startTransition] = useTransition();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, loadNext } = usePaginationFragment(
    MyRequestsListFragment,
    requests
  );
  // const onLoadMore = () =>
  //   startTransition(() => {
  //     loadNext(3);
  //   });

  return (
    <div className={styles.servicesContainer}>
      {data.myBookingsForPublisher.edges.length ? (
        data.myBookingsForPublisher.edges.map(booking => (
          <div key={booking.node.id} className={styles.cardContainer}>
            <BookingCard booking={booking.node} isPublisher />
          </div>
        ))
      ) : (
        <p>No hay servicios disponibles</p>
      )}
    </div>
  );
}
