import styles from '@styles/ServiceList.module.css';
import ServiceCard from './ServiceCard';

export default function ServiceList(): JSX.Element {
  // const [isPending, startTransition] = useTransition();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const onLoadMore = () =>
  //   startTransition(() => {
  //     loadNext(3);
  //   });

  const data = {
    services: {
      edges: [
        {
          node: {
            id: '1',
          },
        },
      ],
    },
  };

  return (
    <div className={styles.servicesContainer}>
      {data.services.edges.length ? (
        data.services.edges.map(service => (
          <div key={service.node.id} className={styles.cardContainer}>
            <ServiceCard />
          </div>
        ))
      ) : (
        <p>No hay servicios disponibles</p>
      )}
    </div>
  );
}
