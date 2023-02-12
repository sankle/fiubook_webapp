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
  Textarea,
  Tooltip,
  Text,
  Divider,
  CheckboxGroup,
  Checkbox,
  Button,
  InputGroup,
  InputRightElement,
  Switch,
  useToast,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { graphql, useMutation } from 'react-relay';
import { useState } from 'react';
import {
  serviceCreatedSuccessfullyToast,
  serviceCreationFailedToast,
} from './notificationToasts';
import {
  NewServiceFormCreateServiceMutation,
  UniversityRole,
} from './__generated__/NewServiceFormCreateServiceMutation.graphql';

const validationSchema = yup.object({
  name: yup
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .required('El nombre no puede estar vacío'),
  description: yup
    .string()
    .min(8, 'La descripción debe tener al menos 8 caracteres')
    .required('La descripción no puede estar vacía'),
  automatic_confirmation: yup.boolean().required(),
  granularity_days: yup.number().min(0).required(),
  granularity_hours: yup.number().min(0).max(23).required(),
  granularity_minutes: yup.number().min(0).max(59).required(),
  max_slots: yup.number().min(1).required(),
  allowed_roles: yup
    .array()
    .of(yup.string().oneOf(['PROFESSOR', 'STUDENT', 'NODO'])),
});

export default function NewServiceForm(): JSX.Element {
  const toast = useToast();

  const [commitMutation, isMutationInFlight] =
    useMutation<NewServiceFormCreateServiceMutation>(
      graphql`
        mutation NewServiceFormCreateServiceMutation(
          $creation_args: CreateServiceArgs!
        ) {
          createService(creationArgs: $creation_args) {
            id
            name
            description
          }
        }
      `
    );

  const [createdSuccesfully, setCreatedSuccessfully] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      automatic_confirmation: true,
      granularity_days: 0,
      granularity_hours: 0,
      granularity_minutes: 30,
      max_slots: 1,
      allowed_roles: ['PROFESSOR', 'STUDENT', 'NODO'],
    },
    validationSchema,
    onSubmit: values => {
      commitMutation({
        variables: {
          creation_args: {
            name: values.name,
            description: values.description,
            granularity:
              86400 * values.granularity_days +
              3600 * values.granularity_hours +
              60 * values.granularity_minutes,
            max_time: values.max_slots,
            booking_type: values.automatic_confirmation
              ? 'AUTOMATIC'
              : 'REQUIRES_CONFIRMATION',
            allowed_roles: values.allowed_roles as UniversityRole[],
          },
        },
        onCompleted: response => {
          setCreatedSuccessfully(true);
          toast(serviceCreatedSuccessfullyToast(response.createService.name));
        },
        onError: error => {
          toast(serviceCreationFailedToast(error.message));
        },
      });
    },
  });

  return (
    <div className={styles.mainContainer}>
      <div className={styles.titleContainer}>
        <Heading as="h1" size="lg" className={styles.title}>
          Crear nuevo servicio
        </Heading>
      </div>
      <form onSubmit={formik.handleSubmit} className={styles.formContainer}>
        <Stack>
          <Heading as="h2" size="sm" className={styles.fieldTitle}>
            1. Nombre
          </Heading>
          <InputGroup>
            <Input
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              isInvalid={formik.touched.name && !!formik.errors.name}
              placeholder={'Nombre del servicio'}
              variant={'flushed'}
              fontSize={'sm'}
              isDisabled={isMutationInFlight || createdSuccesfully}
            />
            {formik.touched.name && !!formik.errors.name && (
              <InputRightElement>
                <Tooltip label={formik.errors.name}>
                  <InfoIcon color="red" />
                </Tooltip>
              </InputRightElement>
            )}
          </InputGroup>
        </Stack>
        <Stack>
          <Heading as="h2" size="sm" className={styles.fieldTitle}>
            2. Descripción
          </Heading>
          <InputGroup>
            <Textarea
              id="description"
              name="description"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              isInvalid={
                formik.touched.description && !!formik.errors.description
              }
              placeholder="Descripción del servicio"
              resize={'none'}
              variant={'flushed'}
              fontSize={'sm'}
              isDisabled={isMutationInFlight || createdSuccesfully}
            />
            {formik.touched.description && !!formik.errors.description && (
              <InputRightElement>
                <Tooltip label={formik.errors.description}>
                  <InfoIcon color="red" />
                </Tooltip>
              </InputRightElement>
            )}
          </InputGroup>
        </Stack>
        <Stack>
          <Heading as="h2" size="sm" className={styles.fieldTitle}>
            {'3. Confirmación de la reserva '}
            <Tooltip
              label={
                'Las reservas automáticas se confirman de manera instantánea. Si esta opción está desactivada, tendrás que confirmar manualmente las reservas a este'
              }
            >
              <InfoIcon />
            </Tooltip>
          </Heading>
          <Stack direction="row">
            <Text fontSize={'sm'} className={styles.text}>
              Confirmación Automática
            </Text>
            <Switch
              name="automatic_confirmation"
              id="automatic_confirmation"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              checked={formik.values.automatic_confirmation}
              isDisabled={isMutationInFlight || createdSuccesfully}
              defaultChecked={formik.values.automatic_confirmation}
            />
          </Stack>
        </Stack>
        <Divider />
        <Stack>
          <Heading as="h2" size="sm" className={styles.fieldTitle}>
            4. Duración de los turnos
          </Heading>
          <Stack direction={'row'} alignItems={'center'}>
            <NumberInput
              defaultValue={formik.values.granularity_days}
              min={0}
              maxW={'16'}
              size={'sm'}
              isDisabled={isMutationInFlight || createdSuccesfully}
            >
              <NumberInputField
                id="granularity_days"
                name="granularity_days"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.granularity_days}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize={'sm'} className={styles.text}>
              días
            </Text>
            <NumberInput
              defaultValue={formik.values.granularity_hours}
              min={0}
              max={23}
              maxW={'16'}
              size={'sm'}
              isDisabled={isMutationInFlight || createdSuccesfully}
            >
              <NumberInputField
                name="granularity_hours"
                id="granularity_hours"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.granularity_hours}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize={'sm'} className={styles.text}>
              hs
            </Text>
            <NumberInput
              defaultValue={formik.values.granularity_minutes}
              min={0}
              max={59}
              maxW={'16'}
              size={'sm'}
              isDisabled={isMutationInFlight || createdSuccesfully}
            >
              <NumberInputField
                id="granularity_minutes"
                name="granularity_minutes"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.granularity_minutes}
              />
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
            {'5. Cantidad máxima de turnos '}
            <Tooltip
              label={
                'Cantidad máxima de turnos seguidos que se pueden solicitar en una misma reserva'
              }
            >
              <InfoIcon />
            </Tooltip>
          </Heading>
          <Stack direction={'row'} alignItems={'center'}>
            <NumberInput
              min={1}
              maxW={'16'}
              size={'sm'}
              defaultValue={formik.values.max_slots}
              isDisabled={isMutationInFlight || createdSuccesfully}
              onChange={(numberAsString, number) => {
                void formik.setFieldValue('max_slots', number);
              }}
            >
              <NumberInputField
                id="max_slots"
                name="max_slots"
                onBlur={formik.handleBlur}
                value={formik.values.max_slots}
              />
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
            defaultValue={formik.values.allowed_roles}
            onChange={values => {
              void formik.setFieldValue('allowed_roles', values);
            }}
            value={formik.values.allowed_roles}
            isDisabled={isMutationInFlight || createdSuccesfully}
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
          <Button
            colorScheme={'linkedin'}
            type="submit"
            isLoading={isMutationInFlight}
            isDisabled={isMutationInFlight || createdSuccesfully}
          >
            Crear Servicio
          </Button>
        </Stack>
      </form>
    </div>
  );
}
