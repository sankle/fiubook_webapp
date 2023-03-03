import { EditIcon } from '@chakra-ui/icons';
import { Button, Heading, HStack, Spinner, Text } from '@chakra-ui/react';
import styles from '@styles/Profile.module.css';
import { Roles } from 'src/global/types';
import IconWithText from './IconWithText';
import useLoggedInUserInfoFetch from './Pages/useLoggedInUserInfoFetch';
import UserBadges from './UserBadges';

const UNCONFIGURED_PLACEHOLDER = 'Sin configurar';

function ProfileField({ name, children }: { name: string; children: any }) {
  return (
    <HStack>
      <Heading fontSize="m">{name}:</Heading>
      {children}
    </HStack>
  );
}

export default function Profile(): JSX.Element {
  const { data, loading } = useLoggedInUserInfoFetch();

  if (loading || !data) {
    return <Spinner />;
  }

  return (
    <div className={styles.profileContainer}>
      <ProfileField name="ID">
        <Text mt={4}>{data.me.id}</Text>
      </ProfileField>
      <ProfileField name="Fecha de registro">
        <Text mt={4}>{data.me.ts}</Text>
      </ProfileField>
      <ProfileField name="DNI">
        <Text mt={4}>{data?.me.dni}</Text>
      </ProfileField>
      <ProfileField name="Nombre">
        <Text mt={4}>{data.me.name || UNCONFIGURED_PLACEHOLDER}</Text>
      </ProfileField>
      <ProfileField name="Apellido">
        <Text mt={4}>{data.me.lastname || UNCONFIGURED_PLACEHOLDER}</Text>
      </ProfileField>
      <ProfileField name="Email">
        <Text mt={4}>{data.me.email || UNCONFIGURED_PLACEHOLDER}</Text>
      </ProfileField>
      <ProfileField name="Roles">
        <UserBadges
          roles={data.me.roles as Roles[]}
          isAdmin={data.me.is_admin}
        />
      </ProfileField>
      <ProfileField name="Puede publicar servicios">
        <Text mt={4}>{data.me.can_publish_services ? 'Sí' : 'No'}</Text>
      </ProfileField>
      <Button
        colorScheme="linkedin"
        onClick={() => console.log('TODO')}
        className={styles.editButton}
      >
        <IconWithText icon={<EditIcon />} text={<p>Editar Perfil</p>} />
      </Button>
    </div>
  );
}
