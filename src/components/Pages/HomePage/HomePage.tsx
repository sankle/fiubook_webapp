import { NavigationBar, tabIndexToRouteArray } from './NavigationBar';
import styles from '@styles/HomePage.module.css';
import { useRouter } from 'found';
import { Box } from '@chakra-ui/react';

export default function HomePage(props: any): JSX.Element {
  const { match } = useRouter();

  return (
    <Box h="calc(100vh)">
      <div className={styles.pageContainer}>
        <NavigationBar
          defaultTabIndex={tabIndexToRouteArray.findIndex(
            route => match.location.pathname === route
          )}
        />
        <div className={styles.pageContent}>{props.children}</div>
      </div>
    </Box>
  );
}
