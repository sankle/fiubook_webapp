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

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

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
}: Props): JSX.Element {
  const onDelete = () => {
    console.log('Deleted');
  };

  const data = {
    start_date: '2021-08-01T18:00:00.000Z',
    service: {
      name: 'Corte de pelo',
    },
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
          <Button colorScheme={'red'} onClick={onDelete}>
            Confirmar Cancelacion
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}
