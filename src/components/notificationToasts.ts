import { UseToastOptions } from '@chakra-ui/react';

const dateDisplayOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

const convertDateToString = (date: string) =>
  new Date(date).toLocaleString('es-ES', dateDisplayOptions);

const getTimeRangeString = (startDate: string, endDate: string) =>
  `Desde: ${convertDateToString(startDate)} hasta: ${convertDateToString(
    endDate
  )}`;

export const serviceBookedSuccessfullyToast = (
  name: string,
  startDate: string,
  endDate: string
): UseToastOptions => ({
  title: `Has reservado ${name} correctamente`,
  description: getTimeRangeString(startDate, endDate),
  status: 'success',
  duration: 9000,
  isClosable: true,
});

export const serviceBookFailedToast = (
  name: string,
  errorDescription: string
): UseToastOptions => ({
  title: `No se pudo reservar ${name}`,
  description: `Error: ${errorDescription}`,
  status: 'error',
  duration: 9000,
  isClosable: true,
});

export const serviceCreatedSuccessfullyToast = (
  name: string
): UseToastOptions => ({
  title: 'Servicio creado',
  description: `Su servicio "${name}" ha sido creado exitosamente.`,
  status: 'success',
  duration: 9000,
  isClosable: true,
});

export const serviceCreationFailedToast = (
  errorDescription: string
): UseToastOptions => ({
  title: 'Error al crear el servicio',
  description: errorDescription,
  status: 'error',
  duration: 9000,
  isClosable: true,
});
