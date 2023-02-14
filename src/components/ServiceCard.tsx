import { Heading, Text, Button, useDisclosure } from '@chakra-ui/react';
import { CalendarIcon, TimeIcon, WarningIcon } from '@chakra-ui/icons';
import styles from '@styles/ServiceCard.module.css';
import BookServiceModal from './BookServiceModal';
import IconWithText from './IconWithText';
import ServiceImage from './ServiceImage';
import ServiceTags from './ServiceTags';

export default function ServiceCard(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const data = {
    name: 'Testeo',
    description: 'Testeo de servicio',
    max_time: '1',
    booking_type: 'REQUIRES_CONFIRMATION',
  };

  return (
    <>
      <ServiceImage className={styles.imageContainer} />
      <div className={styles.serviceNameAndDescriptionContainer}>
        <Heading as="h3" size="md" noOfLines={1}>
          {data.name}
        </Heading>
        <Text fontSize="md" noOfLines={3}>
          {data.description}
        </Text>
        <ServiceTags className={styles.tagsContainer} />
      </div>
      <div className={styles.bookingContainer}>
        {data.max_time && (
          <IconWithText
            icon={<TimeIcon />}
            text={<p>Reserva máxima {data.max_time}</p>}
          />
        )}
        {data.booking_type === 'REQUIRES_CONFIRMATION' && (
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
