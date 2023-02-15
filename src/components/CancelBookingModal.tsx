import { useMutation } from '@apollo/client';
import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import styles from '@styles/CancelBookingModal.module.css';
import { BiTrashAlt } from 'react-icons/bi';
import constants from '../constants';
import { gql } from '../__generated__/gql';

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
  startDate: string;
  serviceName: string;
}

const getConfirmationMessage = (
  startDateString: string,
  serviceName: string
) => {
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

export default function CancelBookingModal({
  isOpen,
  onClose,
  startDate,
  serviceName,
  id,
}: Props): JSX.Element {
  const [cancelBooking, { loading }] = useMutation(cancelBookingMutation, {
    onCompleted: () => {
      onClose();
    },
    refetchQueries: ['MyBookingsQuery'],
  });

  const onDelete = () => {
    void cancelBooking({
      variables: {
        booking_id: id,
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay onClick={onClose} />
      <ModalContent className={styles.modalContent}>
        <ModalCloseButton color={'white'} />
        <div className={styles.topBanner}>
          <BiTrashAlt size={90} color={'white'} />
        </div>
        <div className={styles.confirmationMessageContainer}>
          {getConfirmationMessage(startDate, serviceName)}
        </div>
        <div className={styles.buttonsSectionContainer}>
          <Button variant={'outline'} colorScheme={'gray'} onClick={onClose}>
            Volver
          </Button>
          <Button
            colorScheme={'red'}
            onClick={onDelete}
            isLoading={loading}
            isDisabled={loading}
          >
            Confirmar Cancelacion
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}
