import { EditIcon, InfoIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Button,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import styles from '@styles/Profile.module.css';
import { Roles } from 'src/global/types';
import IconWithText from './IconWithText';
import useLoggedInUserInfoFetch from './Pages/useLoggedInUserInfoFetch';
import UserBadges from './UserBadges';
import { gql } from '../__generated__/gql';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useMutation } from '@apollo/client';
import {
  userProfileUpdatedSuccessfullyToast,
  userProfileUpdateFailedToast,
} from './notificationToasts';
import { getErrorMessage } from '../utils/errorUtils';
import { useState } from 'react';

const UNCONFIGURED_PLACEHOLDER = 'Sin configurar';

const validationSchema = yup.object({
  name: yup
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(64, 'El nombre debe tener como mucho 64 caracteres')
    .required('El nombre no puede estar vacío'),
  lastname: yup
    .string()
    .min(3, 'El apellido debe tener al menos 3 caracteres')
    .max(64, 'El apellido debe tener como mucho 64 caracteres')
    .required('El apellido no puede estar vacío'),
  email: yup
    .string()
    .email('Formato de email inválido')
    .min(3, 'El mail debe tener al menos 3 caracteres')
    .max(320, 'El mail debe tener como mucho 320 caracteres')
    .required('El mail no puede estar vacío'),
});

const updateUserMutation = gql(/* GraphQL */ `
  mutation ProfileUpdateUserMutation(
    $user_id: String!
    $update_args: UpdateUserArgs!
  ) {
    updateUser(id: $user_id, update_args: $update_args) {
      id
    }
  }
`);

export function ProfileField({
  name,
  children,
}: {
  name: string;
  children: any;
}) {
  return (
    <HStack>
      <Heading fontSize="m">{name}:</Heading>
      {children}
    </HStack>
  );
}

export default function Profile(): JSX.Element {
  document.title = 'Perfil | FIUBOOK';

  const { data, loading } = useLoggedInUserInfoFetch();

  const [editMode, setEditMode] = useState(false);

  const initialValues = {
    name: data?.me.name || '',
    lastname: data?.me.lastname || '',
    email: data?.me.email || '',
  };

  const toast = useToast();

  const [updateUser, { loading: mutationLoading }] = useMutation(
    updateUserMutation,
    {
      onCompleted: response => {
        setEditMode(false);
        toast(userProfileUpdatedSuccessfullyToast());
      },
      onError: error => {
        console.error(JSON.stringify(error));
        toast(userProfileUpdateFailedToast(getErrorMessage(error)));
      },
      refetchQueries: ['GetUserInfo'],
    }
  );

  const onSubmit = (values: any) => {
    void updateUser({
      variables: {
        user_id: data?.me.id,
        update_args: {
          name: values.name,
          lastname: values.lastname,
          email: values.email,
        },
      },
    });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  if (loading || !data) {
    return <Spinner />;
  }

  return (
    <form onSubmit={formik.handleSubmit} className={styles.profileContainer}>
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
        {editMode ? (
          <InputGroup>
            <Input
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.name}
              isInvalid={formik.touched.name && !!formik.errors.name}
              placeholder={'Nombre'}
              variant={'flushed'}
              fontSize={'sm'}
              isDisabled={loading || mutationLoading}
              onBlur={() => {
                void formik.setFieldTouched('name', true);
              }}
            />
            {formik.touched.name && !!formik.errors.name && (
              <InputRightElement>
                <Tooltip label={formik.errors.name}>
                  <InfoIcon color="red" />
                </Tooltip>
              </InputRightElement>
            )}
          </InputGroup>
        ) : (
          <Text mt={4}>{data.me.name || UNCONFIGURED_PLACEHOLDER}</Text>
        )}
      </ProfileField>
      <ProfileField name="Apellido">
        {editMode ? (
          <InputGroup>
            <Input
              id="lastname"
              name="lastname"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.lastname}
              isInvalid={formik.touched.lastname && !!formik.errors.lastname}
              placeholder={'Apellido'}
              variant={'flushed'}
              fontSize={'sm'}
              isDisabled={loading || mutationLoading}
              onBlur={() => {
                void formik.setFieldTouched('lastname', true);
              }}
            />
            {formik.touched.lastname && !!formik.errors.lastname && (
              <InputRightElement>
                <Tooltip label={formik.errors.lastname}>
                  <InfoIcon color="red" />
                </Tooltip>
              </InputRightElement>
            )}
          </InputGroup>
        ) : (
          <Text mt={4}>{data.me.lastname || UNCONFIGURED_PLACEHOLDER}</Text>
        )}
      </ProfileField>
      <ProfileField name="Email">
        {editMode ? (
          <InputGroup>
            <Input
              id="email"
              name="email"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.email}
              isInvalid={formik.touched.email && !!formik.errors.email}
              placeholder={'Email'}
              variant={'flushed'}
              fontSize={'sm'}
              isDisabled={loading || mutationLoading}
              onBlur={() => {
                void formik.setFieldTouched('email', true);
              }}
            />
            {formik.touched.email && !!formik.errors.email && (
              <InputRightElement>
                <Tooltip label={formik.errors.email}>
                  <InfoIcon color="red" />
                </Tooltip>
              </InputRightElement>
            )}
          </InputGroup>
        ) : (
          <Text mt={4}>{data.me.email || UNCONFIGURED_PLACEHOLDER}</Text>
        )}
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
      {editMode ? (
        <div className={styles.formButtonsContainer}>
          <Button
            className={styles.formButton}
            colorScheme="linkedin"
            type="button"
            isDisabled={mutationLoading || !formik.dirty || !formik.isValid}
            onClick={() => onSubmit(formik.values)}
          >
            <IconWithText icon={<EditIcon />} text={<p>Guardar</p>} />
          </Button>
          <Button
            className={styles.formButton}
            colorScheme="red"
            type="button"
            isDisabled={mutationLoading}
            onClick={() => setEditMode(false)}
          >
            <IconWithText icon={<CloseIcon />} text={<p>Cancelar</p>} />
          </Button>
        </div>
      ) : (
        <Button
          colorScheme="linkedin"
          type="button"
          onClick={() => setEditMode(true)}
          disabled={loading}
          className={styles.editButton}
        >
          <IconWithText icon={<EditIcon />} text={<p>Editar Perfil</p>} />
        </Button>
      )}
    </form>
  );
}
