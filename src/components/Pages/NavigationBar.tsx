import { Button, Image, Spinner } from '@chakra-ui/react';
import fiubaLogo from '@images/fiuba_logo.jpg';
import styles from '@styles/NavigationBar.module.css';
import LoggedUserInfo from './LoggedUserInfo';
import { useRouter } from 'found';
import { Roles } from '../../global/types';
import useLoggedInUserInfoFetch from './useLoggedInUserInfoFetch';
import { invalidateSession } from '../../services/sessionService';

interface Props {
  getInputGroup: any;
  getTabs: any;
}

export function NavigationBar({ getInputGroup, getTabs }: Props): JSX.Element {
  const { router, match } = useRouter();
  const { data, error, loading } = useLoggedInUserInfoFetch();

  // TODO: check if we can move this to a common apollo handler
  if (error) {
    invalidateSession();
    router.replace('/login');
  }

  const onLogoutClick = () => {
    invalidateSession();
    router.replace('/login');
  };

  const onAdminClick = () => {
    router.replace('/admin/services');
  };

  return (
    <div className={styles.navigationContainer}>
      <div className={styles.leftNavigationContainer}>
        <h1 className={styles.logoTitle}>
          <a href={'/'}>FIUBOOK</a>
        </h1>
        <div className={styles.logoButtonsContainer}>
          <Button
            size={'sm'}
            variant={'outline'}
            colorScheme={'linkedin'}
            onClick={onLogoutClick}
          >
            Cerrar sesión
          </Button>
          {data?.me.is_admin && !match.location.pathname.includes('/admin') && (
            <Button
              size={'sm'}
              variant={'outline'}
              colorScheme={'linkedin'}
              onClick={onAdminClick}
            >
              Administración
            </Button>
          )}
        </div>
      </div>
      <div className={styles.centerNavigationContainer}>
        {getInputGroup()}
        {getTabs()}
      </div>
      <div className={styles.rightNavigationContainer}>
        <Image src={fiubaLogo} className={styles.fiubaLogo} />
        {!loading && data ? (
          <LoggedUserInfo
            isAdmin={data.me.is_admin}
            roles={data.me.roles as Roles[]}
            dni={data.me.dni}
          />
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
}
