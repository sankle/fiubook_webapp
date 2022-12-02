import { useFormik } from 'formik';
import * as yup from 'yup';
import fiubaLogo from '@images/fiuba_logo.jpg';
import { Button, Input, Image, VStack, Flex } from '@chakra-ui/react';
import styles from '@styles/LoginPage.css';
import WrongLoginAlert from './WrongLoginAlert';
import { useState } from 'react';

const validationSchema = yup.object({
  dni: yup.number().required('Debe ingresar su email'),
  password: yup
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .required('Debe ingresar su contraseña'),
});

export default function LoginPage(): JSX.Element {
  const [failedLoginAttempt, setFailedLoginAttempt] = useState(false);

  const formik = useFormik({
    initialValues: {
      dni: '',
      password: '',
    },
    validationSchema,
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
      setFailedLoginAttempt(true);
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
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              (formik.touched.dni && Boolean(formik.errors.dni)) ||
              failedLoginAttempt
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
              (formik.touched.password &&
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                Boolean(formik.errors.password)) ||
              failedLoginAttempt
            }
          />
          <Button colorScheme="primary" type="submit">
            Iniciar Sesion
          </Button>
        </form>
      </Flex>
      <WrongLoginAlert isVisible={failedLoginAttempt} />
    </VStack>
  );
}
