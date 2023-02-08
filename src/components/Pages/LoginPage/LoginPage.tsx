import { useFormik } from 'formik';
import * as yup from 'yup';
import fiubaLogo from '@images/fiuba_logo.jpg';
import { Button, Input, Image, VStack, Flex } from '@chakra-ui/react';
import styles from '@styles/LoginPage.module.css';
import WrongLoginAlert from './WrongLoginAlert';
import { useState } from 'react';
import { useMutation } from 'react-relay';
import { graphql } from 'relay-runtime';
import { useNavigate } from 'react-router-dom';
import { LoginPageCreateSessionMutation } from './__generated__/LoginPageCreateSessionMutation.graphql';
import { isUserLoggedIn, setToken } from '../../../services/sessionService';

const INVALID_CREDENTIALS_ERROR_MSG = 'Credenciales Incorrectas';

const validationSchema = yup.object({
  dni: yup.number().required('Debe ingresar su email'),
  password: yup
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .required('Debe ingresar su contraseña'),
});

const CreateSessionMutation = graphql`
  mutation LoginPageCreateSessionMutation($dni: String!, $password: String!) {
    createSession(credentials: { dni: $dni, password: $password }) {
      token
    }
  }
`;

export default function LoginPage(): JSX.Element {
  const navigate = useNavigate();

  if (isUserLoggedIn()) {
    console.log('calling replace');
    navigate('/home');
  }

  const [failedLoginAttempt, setFailedLoginAttempt] = useState({
    showFailedLoginError: false,
    errorMsg: INVALID_CREDENTIALS_ERROR_MSG,
  });

  const [commitMutation, isMutationInFlight] =
    useMutation<LoginPageCreateSessionMutation>(CreateSessionMutation);

  const formik = useFormik({
    initialValues: {
      dni: '',
      password: '',
    },
    validationSchema,
    onSubmit: ({ dni, password }) => {
      commitMutation({
        variables: {
          dni,
          password,
        },
        onCompleted(data) {
          const token = data.createSession.token;
          setToken(token);
          navigate('/home');
        },
        onError(err: Error) {
          setFailedLoginAttempt({
            showFailedLoginError: true,
            errorMsg: err.message,
          });
        },
      });
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
          />
          <Button
            colorScheme="primary"
            type="submit"
            disabled={isMutationInFlight}
            isLoading={isMutationInFlight}
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
