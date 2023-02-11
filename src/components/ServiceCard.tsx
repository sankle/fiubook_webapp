import { Heading, Text, Button, useDisclosure } from '@chakra-ui/react';
import { CalendarIcon, TimeIcon, WarningIcon } from '@chakra-ui/icons';
import styles from '@styles/ServiceCard.module.css';
import BookServiceModal from './BookServiceModal';
import IconWithText from './IconWithText';
import ServiceImage from './ServiceImage';
import ServiceTags from './ServiceTags';
import { graphql } from 'relay-runtime';
import { ServiceCardFragment$key } from './__generated__/ServiceCardFragment.graphql';
import { useFragment } from 'react-relay';

interface Props {
  service: ServiceCardFragment$key;
}

const ServiceCardFragment = graphql`
  fragment ServiceCardFragment on Service {
    id
    name
    description
    ts
    granularity
    booking_type
    min_time
    max_time
    ...BookServiceModalServiceFragment
  }
`;

export default function ServiceCard({ service }: Props): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const data = useFragment(ServiceCardFragment, service);

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
        {data.min_time && (
          <IconWithText
            icon={<TimeIcon />}
            text={<p>Reserva mínima {data.min_time}</p>}
          />
        )}
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
        <BookServiceModal isOpen={isOpen} onClose={onClose} service={data} />
      </div>
    </>
  );
}
