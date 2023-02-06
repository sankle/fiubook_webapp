import styles from '@styles/ServiceList.module.css';
import ServiceCard from './ServiceCard';
import { graphql } from 'relay-runtime';
import { usePaginationFragment } from 'react-relay';
import { ServiceListFragment$key } from './__generated__/ServiceListFragment.graphql';

export interface Props {
  services: ServiceListFragment$key;
}

const ServiceListFragment = graphql`
  fragment ServiceListFragment on Query
  @refetchable(queryName: "ServiceListPaginationQuery")
  @argumentDefinitions(
    cursor: { type: "String" }
    queryTerm: { type: String, defaultValue: null }
    count: { type: Float, defaultValue: 3 }
  ) {
    services(first: $count, after: $cursor, query_term: $queryTerm)
      @connection(key: "ServiceListFragment_services") {
      edges {
        node {
          id
          ...ServiceCardFragment
        }
      }
    }
  }
`;

export default function ServiceList({ services }: Props): JSX.Element {
  // const [isPending, startTransition] = useTransition();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, loadNext } = usePaginationFragment(
    ServiceListFragment,
    services
  );
  // const onLoadMore = () =>
  //   startTransition(() => {
  //     loadNext(3);
  //   });

  return (
    <div className={styles.servicesContainer}>
      {data.services.edges.length ? (
        data.services.edges.map(service => (
          <div key={service.node.id} className={styles.cardContainer}>
            <ServiceCard service={service.node} />
          </div>
        ))
      ) : (
        <p>No hay servicios disponibles</p>
      )}
    </div>
  );
}
