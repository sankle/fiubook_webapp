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

interface Props {
  service: Service;
  buttonLabel: string;
  ButtonIcon: JSX.Element;
  ModalOnClickButton: any;
}

export default function ServiceCard({
  service,
  buttonLabel,
  ButtonIcon,
  ModalOnClickButton,
}: Props): JSX.Element {
  if (!service) {
    return <Spinner />;
  }

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <ServiceImage className={styles.imageContainer} />
      <div className={styles.serviceNameAndDescriptionContainer}>
        <Heading as="h3" size="md" noOfLines={1}>
          {service.name}
        </Heading>
        <Text fontSize="md" noOfLines={3}>
          {service.description}
        </Text>
        <ServiceTags className={styles.tagsContainer} />
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
        <Button
          colorScheme="linkedin"
          disabled={false} // TODO: change this value
          className={styles.bookingButton}
          onClick={onOpen}
        >
          <IconWithText icon={ButtonIcon} text={<p>{buttonLabel}</p>} />
        </Button>
        {
          <ModalOnClickButton
            isOpen={isOpen}
            onClose={onClose}
            service={service}
          />
        }
      </div>
    </>
  );
}
