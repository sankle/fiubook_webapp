import { useRouteError } from 'react-router-dom';
import styles from '@styles/ErrorPage.module.css';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className={styles.errorPageContainer}>
      <h1>Oops!</h1>
      <p>Lo sentimos, ocurrió un error inesperado.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
