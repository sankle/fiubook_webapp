import { Heading, Text, Button, useDisclosure, Stack } from '@chakra-ui/react';
import {
  CalendarIcon,
  CheckIcon,
  CloseIcon,
  InfoIcon,
  InfoOutlineIcon,
  WarningIcon,
} from '@chakra-ui/icons';
import styles from '@styles/BookingCard.module.css';
import IconWithText from './IconWithText';
import ServiceImage from './ServiceImage';
import ServiceTags from './ServiceTags';
import CancelBookingModal from './Modals/CancelBookingModal';
import { gql } from '../__generated__/gql';
import { useMutation } from '@apollo/client';
import { MdAssignmentReturn } from 'react-icons/md';

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

const deliverBookingObjectMutation = gql(/* GraphQL */ `
  mutation BookingCardDeliverBookingObjectMutation($booking_id: String!) {
    deliverBookingObject(booking_id: $booking_id) {
      id
      booking_status
    }
  }
`);

const returnBookingObjectMutation = gql(/* GraphQL */ `
  mutation BookingCardReturnBookingObjectMutation($booking_id: String!) {
    returnBookingObject(booking_id: $booking_id) {
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
    tags: string[];
    image_url: string;
    returnable: boolean;
  };
  requestor: {
    dni: string;
  };
}

const BookingStatusStrip = ({
  isPastBooking,
  status,
}: {
  isPastBooking: boolean;
  status: string;
}): JSX.Element => {
  let color;
  let caption;
  let icon;

  switch (status) {
    case 'PENDING_CONFIRMATION':
      color = '#FFC93C';
      caption = 'Pendiente de Confirmación';
      icon = <InfoOutlineIcon />;
      break;
    case 'CANCELLED':
      color = '#EC3E3E';
      caption = 'Cancelada';
      icon = <CloseIcon />;
      break;
    case 'PENDING_RETURN':
      color = '#C05621';
      caption = 'Pendiente de Devolución';
      icon = <WarningIcon />;
      break;
    case 'RETURNED':
      color = '#38A169';
      caption = 'Finalizada';
      icon = <CheckIcon />;
      break;
    case 'CONFIRMED':
      color = isPastBooking ? '#38A169' : '#01A0E4';
      caption = isPastBooking ? 'Finalizada' : 'Confirmada';
      icon = <CheckIcon />;
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
  onDeliverClick,
  onReturnClick,
  isMutationInFlight,
  returnableService,
  isPastBooking,
}: {
  isPublisher: boolean;
  bookingStatus: string;
  onCancelClick: () => void;
  onAcceptClick: () => void;
  onRejectClick: () => void;
  onDeliverClick: () => void;
  onReturnClick: () => void;
  isMutationInFlight: boolean;
  returnableService: boolean;
  isPastBooking: boolean;
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
        if (isPastBooking) {
          return null;
        }

        return (
          <>
            {returnableService ? (
              <Button
                colorScheme="orange"
                onClick={onDeliverClick}
                className={styles.button}
                isLoading={isMutationInFlight}
                isDisabled={isMutationInFlight}
              >
                <IconWithText icon={<WarningIcon />} text={<p>Entregar</p>} />
              </Button>
            ) : null}
            <Button
              colorScheme="red"
              onClick={onCancelClick}
              className={styles.button}
              isLoading={isMutationInFlight}
              isDisabled={isMutationInFlight}
            >
              <IconWithText icon={<CloseIcon />} text={<p>Cancelar</p>} />
            </Button>
          </>
        );

      case 'PENDING_RETURN':
        return (
          <Button
            colorScheme="green"
            onClick={onReturnClick}
            className={styles.button}
            isLoading={isMutationInFlight}
            isDisabled={isMutationInFlight}
          >
            <IconWithText icon={<WarningIcon />} text={<p>Devolver</p>} />
          </Button>
        );
    }
  } else {
    if (isPastBooking) {
      return null;
    }

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
  requestor,
}: Props): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isPastBooking = !(new Date(endDate).getTime() > Date.now());

  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);

  const [confirmBooking, { loading: confirmOrRejectLoading }] = useMutation(
    bookingConfirmOrRejectMutation,
    {
      refetchQueries: ['MyRequestsQuery', 'MyBookingsQuery'],
    }
  );
  const [deliverBookingObject, { loading: deliverLoading }] = useMutation(
    deliverBookingObjectMutation,
    {
      refetchQueries: ['MyRequestsQuery', 'MyBookingsQuery'],
    }
  );
  const [returnBookingObject, { loading: returnLoading }] = useMutation(
    returnBookingObjectMutation,
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

  const onDeliver = () => {
    void deliverBookingObject({
      variables: {
        booking_id: id,
      },
    });
  };

  const onReturn = () => {
    void returnBookingObject({
      variables: {
        booking_id: id,
      },
    });
  };

  return (
    <>
      <BookingStatusStrip
        status={bookingStatus}
        isPastBooking={isPastBooking}
      />
      <div className={styles.cardInfoContainer}>
        <ServiceImage
          className={styles.imageContainer}
          url={service.image_url}
        />
        <div className={styles.serviceNameAndDescriptionContainer}>
          <Heading as="h3" size="md" noOfLines={1}>
            {service.name}
          </Heading>
          <Text fontSize="md" noOfLines={3} overflow="auto">
            {service.description}
          </Text>
          <div className={styles.returnableLabel}>
            {service.returnable && (
              <IconWithText
                icon={<MdAssignmentReturn />}
                text={<p>Requiere devolución</p>}
              />
            )}
          </div>
          <ServiceTags tags={service.tags} />
        </div>
        <div className={styles.reservationTimeContainer}>
          {isPublisher && (
            <Stack direction={'row'}>
              <Text size="sm" noOfLines={1}>
                <InfoIcon />
                &nbsp;DNI:&nbsp;{requestor.dni}
              </Text>
            </Stack>
          )}
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
            onDeliverClick={onDeliver}
            onReturnClick={onReturn}
            isMutationInFlight={
              confirmOrRejectLoading || deliverLoading || returnLoading
            }
            returnableService={service.returnable}
            isPastBooking={isPastBooking}
          />
        </div>
      </div>
      <CancelBookingModal
        isOpen={isOpen}
        onClose={onClose}
        id={id}
        startDateString={startDate}
        serviceName={service.name}
      />
    </>
  );
}
