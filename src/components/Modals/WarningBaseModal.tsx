import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import styles from '@styles/WarningBaseModal.module.css';
import { BiTrashAlt } from 'react-icons/bi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  getConfirmationMessage: any;
  actionLabel: string;
  loading: boolean;
  onConfirm: () => void;
}

export default function WarningBaseModal({
  isOpen,
  onClose,
  getConfirmationMessage,
  actionLabel,
  loading,
  onConfirm,
}: Props): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay onClick={onClose} />
      <ModalContent className={styles.modalContent}>
        <ModalCloseButton color={'white'} />
        <div className={styles.topBanner}>
          <BiTrashAlt size={90} color={'white'} />
        </div>
        <div className={styles.confirmationMessageContainer}>
          {getConfirmationMessage()}
        </div>
        <div className={styles.buttonsSectionContainer}>
          <Button variant={'outline'} colorScheme={'gray'} onClick={onClose}>
            Volver
          </Button>
          <Button
            colorScheme={'red'}
            onClick={onConfirm}
            isLoading={loading}
            isDisabled={loading}
          >
            {actionLabel}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}
