import { Avatar, Badge } from '@chakra-ui/react';
import styles from '@styles/LoggedUserInfo.module.css';
import { graphql, useFragment } from 'react-relay';
import { Roles } from '../../../global/types';
import { LoggedUserInfoFragment$key } from './__generated__/LoggedUserInfoFragment.graphql';

const user = {
  name: 'Juan Perez',
  roles: [Roles.Administrative, Roles.Professor, Roles.Student],
};

export interface Props {
  loggedUser: LoggedUserInfoFragment$key;
}

const LoggedUserInfoFragment = graphql`
  fragment LoggedUserInfoFragment on Query {
    me {
      id
      dni
      roles
      is_admin
    }
  }
`;

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

export default function loggedUserInfo({ loggedUser }: Props): JSX.Element {
  const data = useFragment(LoggedUserInfoFragment, loggedUser);

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
