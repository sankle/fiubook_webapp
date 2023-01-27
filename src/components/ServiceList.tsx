import styles from '@styles/ServiceList.css';
import ServiceCard from './ServiceCard';
import { Service } from '../global/types';

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
