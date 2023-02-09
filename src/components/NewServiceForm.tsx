import styles from '@styles/NewServiceForm.module.css';
import {
  Heading,
  Input,
  Stack,
  Tab,
  TabList,
  Tabs,
  Textarea,
} from '@chakra-ui/react';
// import * as yup from 'yup';

// const validationSchema = yup.object({
//   name: yup
//     .string()
//     .min(3, 'El nombre debe tener al menos 3 caracteres')
//     .required('El nombre no puede estar vacío'),
//   description: yup
//     .string()
//     .min(8, 'La descripción debe tener al menos 8 caracteres')
//     .required('La descripción no puede estar vacía'),
//   automatic_confirmation: yup
//     .string()
//     .oneOf(['AUTOMATIC', 'REQUIRES_CONFIRMATION'])
//     .required(),
// });

export default function NewServiceForm(): JSX.Element {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.titleContainer}>
        <Heading as="h1" size="lg" className={styles.title}>
          Crear nuevo servicio
        </Heading>
      </div>
      <div className={styles.formContainer}>
        <Stack>
          <Heading as="h2" size="sm" className={styles.fieldTitle}>
            1. Nombre
          </Heading>
          <Input placeholder="Nombre del servicio" variant={'flushed'} />
        </Stack>
        <Stack>
          <Heading as="h2" size="sm" className={styles.fieldTitle}>
            2. Descripción
          </Heading>
          <Textarea
            placeholder="Descripción del servicio"
            resize={'none'}
            variant={'flushed'}
          />
        </Stack>
        <Stack>
          <Heading as="h2" size="sm" className={styles.fieldTitle}>
            3. Confirmación de la reserva
          </Heading>
          <Tabs variant="solid-rounded" colorScheme="linkedin">
            <TabList>
              <Tab>Automática</Tab>
              <Tab>Manual</Tab>
            </TabList>
          </Tabs>
        </Stack>
      </div>
    </div>
  );
}
