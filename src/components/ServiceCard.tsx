import {
  Image,
  Heading,
  Text,
  Tag,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import {
  CalendarIcon,
  InfoIcon,
  TimeIcon,
  WarningIcon,
} from '@chakra-ui/icons';
import styles from '@styles/ServiceCard.css';
import { Service } from '../global/types';
import BookServiceModal from './BookServiceModal';

// TODO: change this
const placeholderImage =
  'https://www.grouphealth.ca/wp-content/uploads/2018/05/placeholder-image.png';

export function IconWithText({
  icon,
  text,
}: {
  icon: String;
  text: String;
}): JSX.Element {
  return (
    <div className={styles.iconWithText}>
      {icon === 'timeIcon' && <TimeIcon />}
      {icon === 'warningIcon' && <WarningIcon />}
      {icon === 'calendarIcon' && <CalendarIcon />}
      {text}
    </div>
  );
}

export default function ServiceCard({
  service,
}: {
  service: Service;
}): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
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
          <IconWithText
            icon="timeIcon"
            text={`Reserva mínima ${service.minBooking}`}
          />
        )}
        {service.maxBooking && (
          <IconWithText
            icon="timeIcon"
            text={`Reserva máxima ${service.maxBooking}`}
          />
        )}
        {service.requiresConfirmation && (
          <IconWithText icon="warningIcon" text="Requiere confirmación" />
        )}
        <Button
          colorScheme="linkedin"
          disabled={!service.bookable}
          className={styles.bookingButton}
          onClick={onOpen}
        >
          <IconWithText icon="calendarIcon" text="Reservar" />
        </Button>
        <BookServiceModal isOpen={isOpen} onClose={onClose} service={service} />
      </div>
    </>
  );
}
