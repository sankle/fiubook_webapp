import { Badge } from '@chakra-ui/react';
import styles from '@styles/UserBadges.module.css';
import { Roles } from '../global/types';

interface Props {
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

export default function UserBadges({ roles, isAdmin }: Props) {
  return (
    <div className={styles.badgeStack}>
      {roles.map(getBadgeComponent)}
      {isAdmin ? getBadgeComponent(Roles.SystemAdmin) : null}
    </div>
  );
}
