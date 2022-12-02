import { Avatar, Badge } from '@chakra-ui/react';
import styles from '@styles/LoggedUserInfo.css';
import { Roles } from '../../../global/types';

const user = {
  name: 'Juan Perez',
  roles: [Roles.Administrative, Roles.Professor, Roles.Student],
};

const roleBadges = {
  [Roles.Professor]: {
    text: 'Profesor',
    colorScheme: 'green',
  },
  [Roles.Student]: {
    text: 'Estudiante',
    colorScheme: 'blue',
  },
  [Roles.Administrative]: {
    text: 'No Docente',
    colorScheme: 'purple',
  },
};

const getBadgeComponent = (role: Roles): JSX.Element => {
  const { colorScheme, text } = roleBadges[role];
  return (
    <Badge colorScheme={colorScheme} variant="subtle">
      {text}
    </Badge>
  );
};

export default function loggedUserInfo(): JSX.Element {
  return (
    <div className={styles.loggedUserInfoContainer}>
      <div className={styles.nameAndBadgesContainer}>
        <p className={styles.userName}>{user.name}</p>
        <div className={styles.badgeStack}>
          {user.roles.map(getBadgeComponent)}
        </div>
      </div>
      <Avatar name={user.name} />
    </div>
  );
}
