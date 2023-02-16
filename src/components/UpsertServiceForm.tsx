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
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import * as yup from 'yup';
import { useFormik } from 'formik';
import TagsInput from './TagsInput';
import ImageUploader from './ImageUploader';
import { ImageListType } from 'react-images-uploading';

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
  tags: yup.array().of(yup.string()),
});

interface Props {
  actionLabel: string;
  initialValues: any;
  loading: boolean;
  onSubmit: any;
  upsertedSuccessfully: boolean;
  showImageField: boolean;
  images?: ImageListType;
  setImages?: (images: ImageListType) => void;
}

export default function UpsertServiceForm({
  actionLabel,
  initialValues,
  loading,
  onSubmit,
  upsertedSuccessfully,
  images,
  setImages,
  showImageField,
}: Props): JSX.Element {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className={styles.mainContainer}>
      <div className={styles.titleContainer}>
        <Heading as="h1" size="lg" className={styles.title}>
          {actionLabel} servicio
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
              isDisabled={loading}
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
              isDisabled={loading}
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
            3. Etiquetas
          </Heading>
          <TagsInput
            onChange={tags => {
              void formik.setFieldValue('tags', tags);
            }}
            tags={formik.values.tags}
          />
        </Stack>
        {showImageField && (
          <Stack>
            <Heading as="h2" size="sm" className={styles.fieldTitle}>
              4. Imagen
            </Heading>
            <ImageUploader
              images={images as ImageListType}
              setImages={setImages as (images: ImageListType) => void}
            />
          </Stack>
        )}
        <Stack>
          <Heading as="h2" size="sm" className={styles.fieldTitle}>
            {'5. Confirmación de la reserva '}
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
              isDisabled={loading}
              defaultChecked={formik.values.automatic_confirmation}
            />
          </Stack>
        </Stack>
        <Divider />
        <Stack>
          <Heading as="h2" size="sm" className={styles.fieldTitle}>
            6. Duración de los turnos
          </Heading>
          <Stack direction={'row'} alignItems={'center'}>
            <NumberInput
              defaultValue={formik.values.granularity_days}
              min={0}
              maxW={'16'}
              size={'sm'}
              isDisabled={loading}
              onChange={(numberAsString, number) => {
                void formik.setFieldValue('granularity_days', number);
              }}
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
              isDisabled={loading}
              onChange={(numberAsString, number) => {
                void formik.setFieldValue('granularity_hours', number);
              }}
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
              isDisabled={loading}
              onChange={(numberAsString, number) => {
                void formik.setFieldValue('granularity_minutes', number);
              }}
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
            {'7. Cantidad máxima de turnos '}
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
              isDisabled={loading}
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
            8. ¿Quienes pueden reservar este servicio?
          </Heading>
          <CheckboxGroup
            colorScheme={'linkedin'}
            defaultValue={formik.values.allowed_roles}
            onChange={values => {
              void formik.setFieldValue('allowed_roles', values);
            }}
            value={formik.values.allowed_roles}
            isDisabled={loading}
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
            isDisabled={loading}
            isLoading={loading}
          >
            {actionLabel} Servicio
          </Button>
        </Stack>
      </form>
    </div>
  );
}
