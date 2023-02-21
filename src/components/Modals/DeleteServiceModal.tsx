import { useMutation } from '@apollo/client';
import { Text, useToast } from '@chakra-ui/react';
import { Service } from '../../__generated__/graphql';
import { gql } from '../../__generated__/gql';
import WarningBaseModal from './WarningBaseModal';
import {
  serviceDeletedSuccessfullyToast,
  serviceDeletionFailedToast,
} from '../notificationToasts';
import { getErrorMessage } from '../../utils/errorUtils';

const deleteServiceMutation = gql(/* GraphQL */ `
  mutation DeleteServiceMutation($service_id: String!) {
    deleteService(service_id: $service_id) {
      id
      name
    }
  }
`);

interface Props {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
}

export default function DeleteServiceModal({
  isOpen,
  onClose,
  service,
}: Props): JSX.Element {
  const toast = useToast();

  const [cancelBooking, { loading }] = useMutation(deleteServiceMutation, {
    onCompleted: () => {
      onClose();
      toast(serviceDeletedSuccessfullyToast(service.name));
    },
    onError: error => {
      console.error(JSON.stringify(error));
      toast(serviceDeletionFailedToast(getErrorMessage(error)));
    },
    refetchQueries: [
      'GetServices',
      'GetMyServices',
      'MyBookingsQuery',
      'GetServicesAdmin',
    ],
  });

  const onDelete = () => {
    void cancelBooking({
      variables: {
        service_id: service.id,
      },
    });
  };

  const getConfirmationMessage = () => {
    return (
      <Text noOfLines={5} maxWidth={350}>
        ¿Seguro que desea eliminar el servicio <b>{service.name}</b>? Todas las
        reservas futuras y pendientes serán automáticamente canceladas.
      </Text>
    );
  };

  return (
    <WarningBaseModal
      isOpen={isOpen}
      onClose={onClose}
      getConfirmationMessage={getConfirmationMessage}
      actionLabel={'Eliminar'}
      loading={loading}
      onConfirm={onDelete}
    />
  );
}
