import { NavigationBar, tabIndexToRouteArray } from './NavigationBar';
import styles from '@styles/HomePage.module.css';
import React, { Suspense } from 'react';
import { Spinner } from '@chakra-ui/react';
import { useRouter } from 'found';

export default function HomePage(props: any): JSX.Element {
  const { match } = useRouter();

  return (
    <Suspense
      fallback={
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      }
    >
      <div className={styles.pageContainer}>
        <NavigationBar
          loggedUser={props}
          defaultTabIndex={tabIndexToRouteArray.findIndex(
            route => match.location.pathname === route
          )}
        />
        <div className={styles.pageContent}>
          {React.Children.map(props.children, child => {
            // self-made hack to pass relay query references to children
            if (React.isValidElement(child)) {
              return React.cloneElement(child, props);
            }
            return child;
          })}
        </div>
      </div>
    </Suspense>
  );
}
