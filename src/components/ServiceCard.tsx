import { Heading, Text, Button, useDisclosure } from '@chakra-ui/react';
import { CalendarIcon, TimeIcon, WarningIcon } from '@chakra-ui/icons';
import styles from '@styles/ServiceCard.module.css';
import BookServiceModal from './BookServiceModal';
import IconWithText from './IconWithText';
import ServiceImage from './ServiceImage';
import ServiceTags from './ServiceTags';
import { BookingType } from '../__generated__/graphql';

interface Props {
  name: string;
  description: string;
  maxTime?: number | null;
  bookingType: BookingType;
}

export default function ServiceCard({
  name,
  description,
  maxTime,
  bookingType,
}: Props): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <ServiceImage className={styles.imageContainer} />
      <div className={styles.serviceNameAndDescriptionContainer}>
        <Heading as="h3" size="md" noOfLines={1}>
          {name}
        </Heading>
        <Text fontSize="md" noOfLines={3}>
          {description}
        </Text>
        <ServiceTags className={styles.tagsContainer} />
      </div>
      <div className={styles.bookingContainer}>
        {maxTime && (
          <IconWithText
            icon={<TimeIcon />}
            text={<p>Reserva máxima {maxTime}</p>}
          />
        )}
        {bookingType === BookingType.RequiresConfirmation && (
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
          <IconWithText icon={<CalendarIcon />} text={<p>Reservar</p>} />
        </Button>
        <BookServiceModal isOpen={isOpen} onClose={onClose} />
      </div>
    </>
  );
}
