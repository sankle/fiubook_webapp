import { Avatar, Badge } from '@chakra-ui/react';
import styles from '@styles/LoggedUserInfo.module.css';
import { Roles } from '../../../global/types';

const user = {
  name: 'Juan Perez',
  roles: [Roles.Administrative, Roles.Professor, Roles.Student],
};

const roleBadges = {
  [Roles.Professor]: {
    text: 'Profesor',
    colorScheme: 'green',
    variant: 'outline',
  },
  [Roles.Student]: {
    text: 'Estudiante',
    colorScheme: 'blue',
    variant: 'outline',
  },
  [Roles.Administrative]: {
    text: 'No Docente',
    colorScheme: 'purple',
    variant: 'outline',
  },
  [Roles.SystemAdmin]: {
    text: 'Administador',
    colorScheme: 'red',
    variant: 'solid',
  },
};

const getBadgeComponent = (role: Roles): JSX.Element => {
  const { colorScheme, text, variant } = roleBadges[role];
  return (
    <Badge key={text} colorScheme={colorScheme} variant={variant}>
      {text}
    </Badge>
  );
};

export default function loggedUserInfo(): JSX.Element {
  const data = {
    me: {
      dni: '41010465',
      is_admin: true,
      roles: ['STUDENT'],
    },
  };
  return (
    <div className={styles.loggedUserInfoContainer}>
      <div className={styles.nameAndBadgesContainer}>
        <p className={styles.userName}>{data.me.dni}</p>
        <div className={styles.badgeStack}>
          {(data.me.roles as Roles[]).map(getBadgeComponent)}
          {data.me.is_admin ? getBadgeComponent(Roles.SystemAdmin) : null}
        </div>
      </div>
      <Avatar name={user.name} />
    </div>
  );
}
