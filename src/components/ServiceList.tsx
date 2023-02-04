import styles from '@styles/ServiceList.module.css';
import ServiceCard from './ServiceCard';
import { Service } from '../global/types';

// const ServiceListFragment = graphql`
//   fragment ServiceListFragment on Query
//   @refetchable(queryName: "ServiceListPaginationQuery")
//   @argumentDefinitions(
//     cursor: { type: "String" }
//     queryTerm: { type: String, defaultValue: null }
//     count: { type: Float, defaultValue: 10 }
//   ) {
//     services(first: $count, after: $cursor, query_term: $queryTerm)
//       @connection(key: "ServiceListFragment_services") {
//       edges {
//         ...ServiceCardFragment
//       }
//       after
//     }
//   }
// `;

export default function ServiceList({
  services,
}: {
  services: Service[];
}): JSX.Element {
  return (
    <div className={styles.servicesContainer}>
      {services.length ? (
        services.map(service => (
          <div key={service.id} className={styles.cardContainer}>
            <ServiceCard service={service} />
          </div>
        ))
      ) : (
        <p>No hay servicios disponibles</p>
      )}
    </div>
  );
}
