import { Heading, Text, Button, useDisclosure } from '@chakra-ui/react';
import { CalendarIcon, WarningIcon } from '@chakra-ui/icons';
import styles from '@styles/ServiceCard.module.css';
import IconWithText from './IconWithText';
import ServiceImage from './ServiceImage';
import ServiceTags from './ServiceTags';
import { graphql } from 'relay-runtime';
import { BookingCardFragment$key } from './__generated__/BookingCardFragment.graphql';
import { useFragment } from 'react-relay';

interface Props {
  booking: BookingCardFragment$key;
}

const BookingCardFragment = graphql`
  fragment BookingCardFragment on Booking {
    id
    start_date
    end_date
    booking_status
    service {
      id
      name
      description
    }
  }
`;

export default function BookingCard({ booking }: Props): JSX.Element {
  const { onOpen } = useDisclosure();
  const data = useFragment(BookingCardFragment, booking);

  return (
    <>
      <ServiceImage className={styles.imageContainer} />
      <div className={styles.serviceNameAndDescriptionContainer}>
        <Heading as="h3" size="md" noOfLines={1}>
          {data.service?.name}
        </Heading>
        <Text fontSize="md" noOfLines={3}>
          {data.service?.description}
        </Text>
        <ServiceTags className={styles.tagsContainer} />
      </div>
      <div className={styles.bookingContainer}>
        <IconWithText
          icon={<WarningIcon />}
          text={<p>{`Status: ${data.booking_status}`}</p>}
        />
        <Button
          colorScheme="linkedin"
          disabled={false} // TODO: change this value
          className={styles.bookingButton}
          onClick={onOpen}
        >
          <IconWithText icon={<CalendarIcon />} text={<p>Reservar</p>} />
        </Button>
      </div>
    </>
  );
}
