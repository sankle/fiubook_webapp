import { Heading, Text, Button, useDisclosure, Stack } from '@chakra-ui/react';
import {
  CalendarIcon,
  CheckIcon,
  CloseIcon,
  InfoOutlineIcon,
} from '@chakra-ui/icons';
import styles from '@styles/BookingCard.module.css';
import IconWithText from './IconWithText';
import ServiceImage from './ServiceImage';
import ServiceTags from './ServiceTags';
import CancelBookingModal from './CancelBookingModal';
import { gql } from '../__generated__/gql';
import { useMutation } from '@apollo/client';

const bookingConfirmOrRejectMutation = gql(/* GraphQL */ `
  mutation BookingCardConfirmOrRejectMutation(
    $booking_id: String!
    $confirmed: Boolean!
  ) {
    acceptBooking(booking_id: $booking_id, accept: $confirmed) {
      id
      booking_status
    }
  }
`);

interface Props {
  isPublisher: boolean;
  bookingStatus: string;
  startDate: string;
  endDate: string;
  id: string;
  service: {
    name: string;
    description: string;
  };
}

const BookingStatusStrip = ({ status }: { status: string }): JSX.Element => {
  let color;
  let caption;
  let icon;

  switch (status) {
    case 'PENDING_CONFIRMATION':
      color = '#01A0E4';
      caption = 'Pendiente de Confirmacion';
      icon = <InfoOutlineIcon />;
      break;
    case 'CONFIRMED':
      color = '#2AA100';
      caption = 'Confirmada';
      icon = <CheckIcon />;
      break;
    case 'CANCELLED':
      color = '#EC3E3E';
      caption = 'Cancelada';
      icon = <CloseIcon />;
      break;
  }

  return (
    <div className={styles.topStrip} style={{ backgroundColor: color }}>
      {icon}
      <p>{caption}</p>
    </div>
  );
};

const getFormattedDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  return `${day}/${month}/${year} a las ${hour.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })}:${minutes.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })}`;
};

const ButtonGroup = ({
  isPublisher,
  bookingStatus,
  onCancelClick,
  onAcceptClick,
  onRejectClick,
  isMutationInFlight,
}: {
  isPublisher: boolean;
  bookingStatus: string;
  onCancelClick: () => void;
  onAcceptClick: () => void;
  onRejectClick: () => void;
  isMutationInFlight: boolean;
}): JSX.Element | null => {
  if (isPublisher) {
    switch (bookingStatus) {
      case 'PENDING_CONFIRMATION':
        return (
          <>
            <Button
              colorScheme="green"
              onClick={onAcceptClick}
              className={styles.button}
              isLoading={isMutationInFlight}
              isDisabled={isMutationInFlight}
            >
              <IconWithText icon={<CheckIcon />} text={<p>Aceptar</p>} />
            </Button>
            <Button
              colorScheme="red"
              onClick={onRejectClick}
              className={styles.button}
              isLoading={isMutationInFlight}
              isDisabled={isMutationInFlight}
            >
              <IconWithText icon={<CloseIcon />} text={<p>Rechazar</p>} />
            </Button>
          </>
        );
      case 'CONFIRMED':
        return (
          <Button
            colorScheme="red"
            onClick={onCancelClick}
            className={styles.button}
            isLoading={isMutationInFlight}
            isDisabled={isMutationInFlight}
          >
            <IconWithText icon={<CloseIcon />} text={<p>Cancelar</p>} />
          </Button>
        );
    }
  } else {
    switch (bookingStatus) {
      case 'PENDING_CONFIRMATION':
      case 'CONFIRMED':
        return (
          <Button
            colorScheme="red"
            onClick={onCancelClick}
            className={styles.button}
            isLoading={isMutationInFlight}
            isDisabled={isMutationInFlight}
          >
            <IconWithText icon={<CloseIcon />} text={<p>Cancelar</p>} />
          </Button>
        );
    }
  }
  return null;
};

export default function BookingCard({
  isPublisher,
  startDate,
  endDate,
  bookingStatus,
  service,
  id,
}: Props): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);

  const [confirmBooking, { loading }] = useMutation(
    bookingConfirmOrRejectMutation,
    {
      refetchQueries: ['MyRequestsQuery', 'MyBookingsQuery'],
    }
  );

  const onAccept = () => {
    void confirmBooking({
      variables: {
        booking_id: id,
        confirmed: true,
      },
    });
  };

  const onReject = () => {
    void confirmBooking({
      variables: {
        booking_id: id,
        confirmed: false,
      },
    });
  };

  return (
    <>
      <BookingStatusStrip status={bookingStatus} />
      <div className={styles.cardInfoContainer}>
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
        <div className={styles.reservationTimeContainer}>
          <Stack direction={'column'}>
            <Heading as="h4" size="sm" noOfLines={1}>
              <CalendarIcon />
              {' Desde'}
            </Heading>
            <Text fontSize="md" noOfLines={3}>
              {getFormattedDate(parsedStartDate)}
            </Text>
          </Stack>
          <Stack direction={'column'}>
            <Heading as="h4" size="sm" noOfLines={1}>
              <CalendarIcon />
              {' Hasta'}
            </Heading>
            <Text fontSize="md" noOfLines={3}>
              {getFormattedDate(parsedEndDate)}
            </Text>
          </Stack>
        </div>
        <div className={styles.cancelBookingContainer}>
          <ButtonGroup
            isPublisher={isPublisher}
            bookingStatus={bookingStatus}
            onCancelClick={onOpen}
            onAcceptClick={onAccept}
            onRejectClick={onReject}
            isMutationInFlight={loading}
          />
        </div>
      </div>
      <CancelBookingModal
        isOpen={isOpen}
        onClose={onClose}
        id={id}
        startDate={startDate}
        serviceName={service.name}
      />
    </>
  );
}
