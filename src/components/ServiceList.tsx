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
          <ServiceCard key={service.id} service={service} />
        ))
      ) : (
        <p>No hay servicios disponibles</p>
      )}
    </div>
  );
}
