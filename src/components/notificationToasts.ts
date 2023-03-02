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
  )}.`;

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

export const serviceBookingRequestedSuccessfullyToast = (
  name: string,
  startDate: string,
  endDate: string
): UseToastOptions => ({
  title: `Se ha solicitado reservar ${name}`,
  description: `${getTimeRangeString(
    startDate,
    endDate
  )} Deberá esperar la confirmación de su reserva.`,
  status: 'success',
  duration: 9000,
  isClosable: true,
});

export const serviceBookFailedToast = (
  name: string,
  errorDescription: string
): UseToastOptions => ({
  title: `No se pudo reservar ${name}`,
  description: errorDescription,
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

export const serviceEditedSuccessfullyToast = (
  name: string
): UseToastOptions => ({
  title: 'Servicio modificado',
  description: `Su servicio "${name}" ha sido modificado exitosamente.`,
  status: 'success',
  duration: 9000,
  isClosable: true,
});

export const serviceEditFailedToast = (
  errorDescription: string
): UseToastOptions => ({
  title: 'Error al modificar el servicio',
  description: errorDescription,
  status: 'error',
  duration: 9000,
  isClosable: true,
});

export const serviceDeletedSuccessfullyToast = (
  name: string
): UseToastOptions => ({
  title: 'Servicio eliminado',
  description: `Su servicio "${name}" ha sido eliminado exitosamente. Todas las reservas futuras han sido canceladas.`,
  status: 'success',
  duration: 9000,
  isClosable: true,
});

export const serviceDeletionFailedToast = (
  errorDescription: string
): UseToastOptions => ({
  title: 'Error al eliminar el servicio',
  description: errorDescription,
  status: 'error',
  duration: 9000,
  isClosable: true,
});

export const userPermissionsModifiedSuccessfullyToast = (
  id: string
): UseToastOptions => ({
  title: 'Permisos de usuario modificados',
  description: `Los permisos del usuario "${id}" han sido modificados exitosamente.`,
  status: 'success',
  duration: 9000,
  isClosable: true,
});

export const userPermissionsModificationFailedToast = (
  errorDescription: string
): UseToastOptions => ({
  title: 'Error al modificar permisos de usuario',
  description: errorDescription,
  status: 'error',
  duration: 9000,
  isClosable: true,
});
