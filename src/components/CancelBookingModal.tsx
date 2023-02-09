import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { graphql, useFragment, useMutation } from 'react-relay';
import { CancelBookingModalFragment$key } from './__generated__/CancelBookingModalFragment.graphql';
import styles from '@styles/CancelBookingModal.module.css';
import { BiTrashAlt } from 'react-icons/bi';
import constants from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  booking: CancelBookingModalFragment$key;
}

const CancelBookingModalFragment = graphql`
  fragment CancelBookingModalFragment on Booking {
    id
    start_date
    service {
      name
    }
  }
`;

const getConfirmationMessage = (data: any) => {
  const startDate = new Date(data.start_date);
  return (
    <Text noOfLines={5} maxWidth={350}>
      ¿Seguro que desea cancelar su reserva de <b>{data.service?.name}</b> del{' '}
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
  booking,
}: Props): JSX.Element {
  const data = useFragment(CancelBookingModalFragment, booking);

  const [commitMutation, isMutationInFlight] = useMutation(
    graphql`
      mutation CancelBookingModalDeleteButtonMutation($booking_id: String!) {
        cancelBooking(booking_id: $booking_id) {
          id
          booking_status
        }
      }
    `
  );

  const onDelete = () => {
    commitMutation({
      variables: {
        booking_id: data.id,
      },
      onCompleted: onClose,
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
          {getConfirmationMessage(data)}
        </div>
        <div className={styles.buttonsSectionContainer}>
          <Button variant={'outline'} colorScheme={'gray'} onClick={onClose}>
            Volver
          </Button>
          <Button
            colorScheme={'red'}
            onClick={onDelete}
            isLoading={isMutationInFlight}
            disabled={isMutationInFlight}
          >
            Confirmar Cancelacion
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}
