import { useFormik } from 'formik';
import * as yup from 'yup';
import fiubaLogo from '@images/fiuba_logo.jpg';
import { Button, Input, Image, VStack, Flex } from '@chakra-ui/react';
import styles from '@styles/LoginPage.module.css';
import WrongLoginAlert from './WrongLoginAlert';
import { useState } from 'react';
import constants from '../../../constants';
import { useMutation } from '@apollo/client';
import { setToken } from '../../../services/sessionService';
import { useRouter } from 'found';
import { gql } from '../../../__generated__/gql';
import { getErrorMessage } from '../../../utils/errorUtils';

const validationSchema = yup.object({
  dni: yup.number().required('Debe ingresar su email'),
  password: yup
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .required('Debe ingresar su contraseña'),
});

const createSessionMutation = gql(/* GraphQL */ `
  mutation CreateSession($dni: String!, $password: String!) {
    createSession(credentials: { dni: $dni, password: $password }) {
      token
    }
  }
`);

export default function LoginPage(): JSX.Element {
  const { router } = useRouter();

  const [failedLoginAttempt, setFailedLoginAttempt] = useState({
    showFailedLoginError: false,
    errorMsg: constants.invalidCredentialsErrorMessage,
  });

  const [createSession, { loading }] = useMutation(createSessionMutation, {
    onCompleted: data => {
      const token = data.createSession.token;
      setToken(token);
      router.replace('/services');
    },
    onError: error => {
      setFailedLoginAttempt({
        showFailedLoginError: true,
        errorMsg: getErrorMessage(error),
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      dni: '',
      password: '',
    },
    validationSchema,
    onSubmit: async ({ dni, password }) => {
      await createSession({ variables: { dni, password } });
    },
  });

  return (
    <VStack
      alignItems="center"
      float="none"
      h="calc(100vh)"
      justifyContent="center"
    >
      <Image src={fiubaLogo} className={styles.fiubaLogo} />
      <Flex>
        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <h1 className={styles.logoTitle}>FIUBOOK</h1>
          <h1 className={styles.formTitle}>Inicio de sesión</h1>
          <Input
            id="dni"
            name="dni"
            placeholder="DNI"
            value={formik.values.dni}
            onChange={formik.handleChange}
            isInvalid={
              (formik.touched.dni && Boolean(formik.errors.dni)) ||
              failedLoginAttempt.showFailedLoginError
            }
            isDisabled={loading}
          />
          <Input
            id="password"
            name="password"
            placeholder="Contraseña"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            isInvalid={
              (formik.touched.password && Boolean(formik.errors.password)) ||
              failedLoginAttempt.showFailedLoginError
            }
            isDisabled={loading}
          />
          <Button
            colorScheme="primary"
            type="submit"
            isDisabled={loading}
            isLoading={loading}
          >
            Iniciar Sesion
          </Button>
        </form>
      </Flex>
      <WrongLoginAlert
        isVisible={failedLoginAttempt.showFailedLoginError}
        errorMsg={failedLoginAttempt.errorMsg}
      />
    </VStack>
  );
}
