import { NavigationBar, tabIndexToRouteArray } from './NavigationBar';
import styles from '@styles/HomePage.module.css';
import { useRouter } from 'found';

export default function HomePage(props: any): JSX.Element {
  const { match } = useRouter();

  return (
    <div className={styles.pageContainer}>
      <NavigationBar
        defaultTabIndex={tabIndexToRouteArray.findIndex(
          route => match.location.pathname === route
        )}
      />
      <div className={styles.pageContent}>{props.children}</div>
    </div>
  );
}
