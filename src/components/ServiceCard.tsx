import {
  Heading,
  Text,
  Button,
  useDisclosure,
  Spinner,
} from '@chakra-ui/react';
import styles from '@styles/ServiceCard.module.css';
import IconWithText from './IconWithText';
import ServiceImage from './ServiceImage';
import ServiceTags from './ServiceTags';
import { Service } from '../__generated__/graphql';
import ServiceBookingLimits from './ServiceBookingLimits';

export interface ButtonProps {
  buttonLabel: string;
  ButtonIcon: JSX.Element;
  colorScheme: string;
  Modal: any;
  modalProps: any;
}

interface Props {
  service: Service;
  primaryButton: ButtonProps;
  secondaryButton: ButtonProps | null;
}

export const renderButtonAndModal = (
  { ButtonIcon, buttonLabel, colorScheme, Modal, modalProps }: ButtonProps,
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void
) => (
  <div className={styles.modalButton}>
    <Button
      colorScheme={colorScheme}
      disabled={false} // TODO: change this value
      className={styles.bookingButton}
      onClick={onOpen}
    >
      <IconWithText icon={ButtonIcon} text={<p>{buttonLabel}</p>} />
    </Button>
    <Modal isOpen={isOpen} onClose={onClose} {...modalProps} />
  </div>
);

export default function ServiceCard({
  service,
  primaryButton,
  secondaryButton,
}: Props): JSX.Element {
  if (!service) {
    return <Spinner />;
  }

  const {
    isOpen: isOpenPrimaryModal,
    onOpen: onOpenPrimaryModal,
    onClose: onClosePrimaryModal,
  } = useDisclosure();

  const {
    isOpen: isOpenSecondaryModal,
    onOpen: onOpenSecondaryModal,
    onClose: onCloseSecondaryModal,
  } = useDisclosure();

  return (
    <>
      <ServiceImage className={styles.imageContainer} url={service.image_url} />
      <div className={styles.serviceNameAndDescriptionContainer}>
        <Heading as="h3" size="md" noOfLines={1}>
          {service.name}
        </Heading>
        <Text fontSize="md" noOfLines={3} overflow="scroll">
          {service.description}
        </Text>
        <div className={styles.tagsContainer}>
          <ServiceTags tags={service.tags} />
        </div>
      </div>
      <div className={styles.bookingContainer}>
        <ServiceBookingLimits service={service} />
        <div className={styles.buttonsContainer}>
          {renderButtonAndModal(
            primaryButton,
            isOpenPrimaryModal,
            onOpenPrimaryModal,
            onClosePrimaryModal
          )}
          {secondaryButton &&
            renderButtonAndModal(
              secondaryButton,
              isOpenSecondaryModal,
              onOpenSecondaryModal,
              onCloseSecondaryModal
            )}
        </div>
      </div>
    </>
  );
}
