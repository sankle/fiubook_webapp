import { Image, Heading, Text, Tag, Button } from '@chakra-ui/react';
import {
  CalendarIcon,
  InfoIcon,
  TimeIcon,
  WarningIcon,
} from '@chakra-ui/icons';
import styles from '@styles/ServiceCard.css';
import { Service } from '../global/types';

// TODO: change this
const placeholderImage =
  'https://www.grouphealth.ca/wp-content/uploads/2018/05/placeholder-image.png';

export function BookingTimeInfo({ text }: { text: String }): JSX.Element {
  return (
    <div className={styles.bookingInfoContainer}>
      <TimeIcon />
      {text}
    </div>
  );
}

export default function ServiceCard({
  service,
}: {
  service: Service;
}): JSX.Element {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.imageContainer}>
        <Image
          src={service.imageUrl ?? placeholderImage}
          className={styles.serviceImage}
        />
      </div>
      <div className={styles.serviceNameAndDescriptionContainer}>
        <Heading as="h3" size="md" noOfLines={1}>
          {service.name}
        </Heading>
        <Text fontSize="md" noOfLines={3}>
          {service.description}
        </Text>
        <div className={styles.tagsContainer}>
          {service.tags?.length && <InfoIcon className={styles.tagsIcon} />}
          {service.tags.map(tagName => (
            <Tag key={tagName} size="sm" variant="solid" colorScheme="teal">
              {tagName}
            </Tag>
          ))}
        </div>
      </div>
      <div className={styles.bookingContainer}>
        {service.minBooking && (
          <BookingTimeInfo text={`Reserva mínima ${service.minBooking}`} />
        )}
        {service.maxBooking && (
          <BookingTimeInfo text={`Reserva máxima ${service.maxBooking}`} />
        )}
        {service.requiresConfirmation && (
          <div className={styles.bookingInfoContainer}>
            <WarningIcon />
            Requiere confirmación
          </div>
        )}
        <Button
          colorScheme="linkedin"
          disabled={!service.bookable}
          className={styles.bookingButton}
        >
          <CalendarIcon />
          &nbsp;&nbsp;Reservar
        </Button>
      </div>
    </div>
  );
}
