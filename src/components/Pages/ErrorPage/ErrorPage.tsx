import styles from '@styles/ErrorPage.module.css';
import { HttpError } from 'found';

interface Props {
  error: Error | HttpError | null;
}

export default function ErrorPage({ error }: Props) {
  console.error('Error page: ', error);

  return (
    <div className={styles.errorPageContainer}>
      <h1>Oops!</h1>
      <p>Lo sentimos, ocurrió un error inesperado.</p>
      <p>
        <i>{`${(error && (error.status as string)) || ''}: ${
          (error && (error.data as string)) ||
          (error && (error.message as string)) ||
          'Error desconocido'
        }`}</i>
      </p>
    </div>
  );
}
