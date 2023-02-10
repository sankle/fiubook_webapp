import styles from '@styles/NewServiceForm.module.css';
import {
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Tab,
  TabList,
  Tabs,
  Textarea,
  Tooltip,
  Text,
  Divider,
  CheckboxGroup,
  Checkbox,
  Button,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
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
          <Input
            placeholder="Nombre del servicio"
            variant={'flushed'}
            fontSize={'sm'}
          />
        </Stack>
        <Stack>
          <Heading as="h2" size="sm" className={styles.fieldTitle}>
            2. Descripción
          </Heading>
          <Textarea
            placeholder="Descripción del servicio"
            resize={'none'}
            variant={'flushed'}
            fontSize={'sm'}
          />
        </Stack>
        <Stack>
          <Heading as="h2" size="sm" className={styles.fieldTitle}>
            3. Confirmación de la reserva
          </Heading>
          <Tabs variant="solid-rounded" colorScheme="linkedin" size={'sm'}>
            <TabList>
              <Tooltip label="Las reservas hechas a este servició se confirmarán de manera instantánea y automática.">
                <Tab>Automática</Tab>
              </Tooltip>
              <Tooltip label="Las reservas hechas a este servicio deberán ser confirmadas por vos.">
                <Tab>Manual</Tab>
              </Tooltip>
            </TabList>
          </Tabs>
        </Stack>
        <Divider />
        <Stack>
          <Heading as="h2" size="sm" className={styles.fieldTitle}>
            4. Duración de los turnos
          </Heading>
          <Stack direction={'row'} alignItems={'center'}>
            <NumberInput defaultValue={0} min={0} maxW={'16'} size={'sm'}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize={'sm'} className={styles.text}>
              días
            </Text>
            <NumberInput
              defaultValue={0}
              min={0}
              max={23}
              maxW={'16'}
              size={'sm'}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize={'sm'} className={styles.text}>
              hs
            </Text>
            <NumberInput
              defaultValue={30}
              min={0}
              max={59}
              maxW={'16'}
              size={'sm'}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize={'sm'} className={styles.text}>
              minutos
            </Text>
          </Stack>
        </Stack>
        <Divider />
        <Stack>
          <Heading as="h2" size="sm" className={styles.fieldTitle}>
            5. Cantidad máxima de turnos
            <Tooltip
              label={
                'Cantidad máxima de turnos seguidos que se pueden solicitar en una misma reserva'
              }
            >
              <InfoIcon />
            </Tooltip>
          </Heading>
          <Stack direction={'row'} alignItems={'center'}>
            <NumberInput defaultValue={1} min={0} maxW={'16'} size={'sm'}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize={'sm'} className={styles.text}>
              Turnos
            </Text>
          </Stack>
        </Stack>
        <Divider />
        <Stack>
          <Heading as="h2" size="sm" className={styles.fieldTitle}>
            6. ¿Quienes pueden reservar este servicio?
          </Heading>
          <CheckboxGroup
            colorScheme={'linkedin'}
            defaultValue={['STUDENT', 'PROFESSOR', 'NODO']}
          >
            <Stack direction={'row'} spacing={'10'}>
              <Checkbox value="STUDENT">
                <Text fontSize={'sm'}>Estudiantes</Text>
              </Checkbox>
              <Checkbox value="PROFESSOR">
                <Text fontSize={'sm'}>Profesores</Text>
              </Checkbox>
              <Checkbox value="NODO">
                <Text fontSize={'sm'}>No Docentes</Text>
              </Checkbox>
            </Stack>
          </CheckboxGroup>
        </Stack>
        <Divider />
        <Stack align={'flex-start'}>
          <Button colorScheme={'linkedin'}>Crear Servicio</Button>
        </Stack>
      </div>
    </div>
  );
}
