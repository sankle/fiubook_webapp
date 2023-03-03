import { Avatar } from '@chakra-ui/react';
import styles from '@styles/LoggedUserInfo.module.css';
import { Roles } from '../../global/types';
import UserBadges from '../UserBadges';

interface Props {
  dni: string;
  roles: Roles[];
  isAdmin: boolean;
}

export default function loggedUserInfo({
  dni,
  roles,
  isAdmin,
}: Props): JSX.Element {
  return (
    <div className={styles.loggedUserInfoContainer}>
      <div className={styles.nameAndBadgesContainer}>
        <p className={styles.userName}>{dni}</p>
        <UserBadges roles={roles} isAdmin={isAdmin} />
      </div>
      <Avatar name={dni} />
    </div>
  );
}
