import { Avatar, Badge } from '@chakra-ui/react';
import styles from '@styles/LoggedUserInfo.module.css';
import { Roles } from '../../global/types';

interface Props {
  dni: string;
  roles: Roles[];
  isAdmin: boolean;
}

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

export default function loggedUserInfo({
  dni,
  roles,
  isAdmin,
}: Props): JSX.Element {
  return (
    <div className={styles.loggedUserInfoContainer}>
      <div className={styles.nameAndBadgesContainer}>
        <p className={styles.userName}>{dni}</p>
        <div className={styles.badgeStack}>
          {roles.map(getBadgeComponent)}
          {isAdmin ? getBadgeComponent(Roles.SystemAdmin) : null}
        </div>
      </div>
      <Avatar name={dni} />
    </div>
  );
}