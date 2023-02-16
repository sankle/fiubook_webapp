import { useMutation } from '@apollo/client';
import { Text } from '@chakra-ui/react';
import constants from '../../constants';
import { gql } from '../../__generated__/gql';
import WarningBaseModal from './WarningBaseModal';

const cancelBookingMutation = gql(/* GraphQL */ `
  mutation CancelBookingMutation($booking_id: String!) {
    cancelBooking(booking_id: $booking_id) {
      id
      booking_status
    }
  }
`);

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  startDateString: string;
  serviceName: string;
}

export default function CancelBookingModal({
  isOpen,
  onClose,
  startDateString,
  serviceName,
  id,
}: Props): JSX.Element {
  const [cancelBooking, { loading }] = useMutation(cancelBookingMutation, {
    onCompleted: () => {
      onClose();
    },
    refetchQueries: ['MyBookingsQuery', 'GetBookingsAdmin'],
  });

  const onDelete = () => {
    void cancelBooking({
      variables: {
        booking_id: id,
      },
    });
  };

  const getConfirmationMessage = () => {
    const startDate = new Date(startDateString);
    return (
      <Text noOfLines={5} maxWidth={350}>
        ¿Seguro que desea cancelar su reserva de <b>{serviceName}</b> del{' '}
        <b>
          {startDate.getDate()} de {constants.months[startDate.getMonth()]} de{' '}
          {startDate.getFullYear()} a las {startDate.getHours()}:
          {startDate.getMinutes()}
        </b>
        ?
      </Text>
    );
  };

  return (
    <WarningBaseModal
      isOpen={isOpen}
      onClose={onClose}
      getConfirmationMessage={getConfirmationMessage}
      actionLabel={'Cancelar'}
      loading={loading}
      onConfirm={onDelete}
    />
  );
}
