import {
  Heading,
  Text,
  Button,
  useDisclosure,
  Spinner,
} from '@chakra-ui/react';
import { TimeIcon, WarningIcon } from '@chakra-ui/icons';
import styles from '@styles/ServiceCard.module.css';
import IconWithText from './IconWithText';
import ServiceImage from './ServiceImage';
import ServiceTags from './ServiceTags';
import { BookingType, Service } from '../__generated__/graphql';

interface ButtonProps {
  buttonLabel: string;
  ButtonIcon: JSX.Element;
  colorScheme: string;
  Modal: any;
}

interface Props {
  service: Service;
  primaryButton: ButtonProps;
  secondaryButton: ButtonProps | null;
}

const renderButtonAndModal = (
  { ButtonIcon, buttonLabel, colorScheme, Modal }: ButtonProps,
  service: Service,
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
    <Modal isOpen={isOpen} onClose={onClose} service={service} />
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
        <Text fontSize="md" noOfLines={3}>
          {service.description}
        </Text>
        <ServiceTags className={styles.tagsContainer} tags={service.tags} />
      </div>
      <div className={styles.bookingContainer}>
        <IconWithText
          icon={<TimeIcon />}
          text={<p>Reserva máxima {service.max_time}</p>}
        />
        {service &&
          service.booking_type === BookingType.RequiresConfirmation && (
            <IconWithText
              icon={<WarningIcon />}
              text={<p>Requiere confirmación</p>}
            />
        )}
        <div className={styles.buttonsContainer}>
          {renderButtonAndModal(
            primaryButton,
            service,
            isOpenPrimaryModal,
            onOpenPrimaryModal,
            onClosePrimaryModal
          )}
          {secondaryButton &&
            renderButtonAndModal(
              secondaryButton,
              service,
              isOpenSecondaryModal,
              onOpenSecondaryModal,
              onCloseSecondaryModal
            )}
        </div>
      </div>
    </>
  );
}
