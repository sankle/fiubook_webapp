import { Heading, Text, Button, useDisclosure } from '@chakra-ui/react';
import { CalendarIcon, TimeIcon, WarningIcon } from '@chakra-ui/icons';
import styles from '@styles/ServiceCard.module.css';
import { Service } from '../global/types';
import BookServiceModal from './BookServiceModal';
import IconWithText from './IconWithText';
import ServiceImage from './ServiceImage';
import ServiceTags from './ServiceTags';
// import { graphql } from 'relay-runtime';

// const ServiceCardFragment = graphql`
//   fragment ServiceCardFragment on Service {
//     id
//     name
//     description
//     ts
//     granularity
//     booking_type
//   }
// `;

export default function ServiceCard({
  service,
}: {
  service: Service;
}): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <ServiceImage
        className={styles.imageContainer}
        imageUrl={service.imageUrl ?? null}
      />
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
        {service.minBooking && (
          <IconWithText
            icon={<TimeIcon />}
            text={<p>Reserva mínima {service.minBooking}</p>}
          />
        )}
        {service.maxBooking && (
          <IconWithText
            icon={<TimeIcon />}
            text={<p>Reserva máxima {service.maxBooking}</p>}
          />
        )}
        {service.requiresConfirmation && (
          <IconWithText
            icon={<WarningIcon />}
            text={<p>Requiere confirmación</p>}
          />
        )}
        <Button
          colorScheme="linkedin"
          disabled={!service.bookable}
          className={styles.bookingButton}
          onClick={onOpen}
        >
          <IconWithText icon={<CalendarIcon />} text={<p>Reservar</p>} />
        </Button>
        <BookServiceModal isOpen={isOpen} onClose={onClose} service={service} />
      </div>
    </>
  );
}
