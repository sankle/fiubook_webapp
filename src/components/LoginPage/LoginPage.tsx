import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import fiubaIcon from '../../../images/logo-fiuba.png';

import styles from './styles.css';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Ingrese una dirección de email válida')
    .required('Debe ingresar su email'),
  password: yup
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .required('Debe ingresar su contraseña'),
});

const onClickFederatedLogin = (): void => alert('se presiono login federado');

export default function LoginPage(): JSX.Element {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div className={styles.formContainer}>
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <h1 className={styles.formTitle}>Inicio de sesión</h1>
        <TextField
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          id="password"
          name="password"
          label="Contraseña"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button color="primary" variant="contained" type="submit">
          Acceder
        </Button>
        <Button
          color="secondary"
          variant="contained"
          type="button"
          onClick={onClickFederatedLogin}
        >
          <input type="image" src={fiubaIcon} className={styles.fiubaIcon} />
          Conectar con FIUBA
        </Button>
      </form>
    </div>
  );
}
