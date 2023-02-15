import { TimeIcon, WarningIcon } from '@chakra-ui/icons';
import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from '@chakra-ui/react';
import styles from '@styles/BookServiceModal.module.css';
import IconWithText from './IconWithText';
import ServiceImage from './ServiceImage';
import ServiceTags from './ServiceTags';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, Event, dayjsLocalizer, SlotInfo } from 'react-big-calendar';
import dayjs from 'dayjs';
import {
  changeBookingSlot,
  convertToLocaleString,
  normalizeBookingSlot,
} from '../utils/dateRangeUtils';
import constants from '../constants';
import { BookingType } from '../__generated__/graphql';
import { gql } from '../__generated__/gql';
import { useMutation, useQuery } from '@apollo/client';
import {
  serviceBookedSuccessfullyToast,
  serviceBookFailedToast,
} from './notificationToasts';

// TODO: add some validations and disable booking button accordingly

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  name: string;
  description: string;
  granularity: number;
  maxTime: number;
  bookingType: BookingType;
}

const BookServiceModalExistentBookingsQuery = gql(/* GraphQL */ `
  query BookServiceModalExistentBookingsQuery(
    $startDate: DateTime!
    $endDate: DateTime!
    $serviceId: String!
  ) {
    conflictingBookings(
      end_date: $endDate
      start_date: $startDate
      service_id: $serviceId
    ) {
      start_date
      end_date
    }
  }
`);

const BookServiceMutation = gql(/* GraphQL */ `
  mutation BookServiceModalMutation(
    $service_id: ID!
    $start_date: DateTime!
    $end_date: DateTime!
  ) {
    createBooking(
      creationArgs: {
        service_id: $service_id
        start_date: $start_date
        end_date: $end_date
      }
    ) {
      bookingEdge {
        node {
          id
          start_date
          end_date
        }
      }
    }
  }
`);

const localizer = dayjsLocalizer(dayjs);

export default function BookServiceModal({
  isOpen,
  onClose,
  name,
  description,
  granularity,
  maxTime,
  bookingType,
  id,
}: Props): JSX.Element {
  const [events, setEvents] = useState<Event[]>([]);

  useQuery(BookServiceModalExistentBookingsQuery, {
    variables: {
      serviceId: id,
      startDate: constants.existentBookingsQueryStartDate,
      endDate: constants.existentBookingsQueryEndDate,
    },
    onCompleted: data => {
      const existentEvents = data.conflictingBookings.map(
        ({ start_date: start, end_date: end }) => ({
          title: constants.existentBookingEventTitle,
          start: new Date(start),
          end: new Date(end),
        })
      );
      setEvents(existentEvents);
    },
  });
  const toast = useToast();

  const [bookService, { loading }] = useMutation(BookServiceMutation, {
    onError: error => {
      console.log(JSON.stringify(error));
      toast(serviceBookFailedToast(name, error.message));
    },
    onCompleted: data => {
      toast(
        serviceBookedSuccessfullyToast(
          name,
          data.createBooking.bookingEdge.node.start_date,
          data.createBooking.bookingEdge.node.end_date
        )
      );
      onClose();
    },
  });

  const { currentDate, initialFromDateString, initialToDateString } =
    useMemo((): {
      currentDate: Date;
      initialFromDateString: string;
      initialToDateString: string;
    } => {
      const currentDate = new Date();
      const currentDateString = convertToLocaleString(currentDate);

      const { start: initialFromDate, end: initialToDate } =
        normalizeBookingSlot(
          currentDateString,
          currentDateString,
          granularity,
          1,
          maxTime,
          false
        );

      console.log(initialToDate || currentDate);

      return {
        currentDate,
        initialFromDateString: convertToLocaleString(
          initialFromDate || currentDate
        ),
        initialToDateString: convertToLocaleString(
          initialToDate || currentDate
        ),
      };
    }, []);

  const [fromDate, setFromDate] = useState(initialFromDateString);
  const [toDate, setToDate] = useState(initialToDateString);
  const [calendarDate, setCalendarDate] = useState(currentDate);

  const onSelectSlot = useCallback(
    (slotInfo: SlotInfo) =>
      changeBookingSlot({
        newFromDate: convertToLocaleString(slotInfo.start),
        newToDate: convertToLocaleString(slotInfo.end),
        prevFromDate: fromDate,
        prevToDate: toDate,
        granularity,
        minSlots: 1,
        maxSlots: maxTime,
        setFromDate,
        setToDate,
      }),
    [setFromDate, setToDate]
  );

  const onNavigate = useCallback(
    (newDate: Date) =>
      changeBookingSlot({
        newFromDate: convertToLocaleString(newDate),
        newToDate: null,
        prevFromDate: fromDate,
        prevToDate: toDate,
        granularity,
        minSlots: 1,
        maxSlots: maxTime,
        setFromDate,
        setToDate,
      }),
    [setFromDate, setToDate]
  );

  const handleFromDateChange = useCallback(
    (newValue: any) =>
      changeBookingSlot({
        newFromDate: newValue.target.value,
        newToDate: null,
        prevFromDate: fromDate,
        prevToDate: toDate,
        granularity,
        minSlots: 1,
        maxSlots: maxTime,
        setFromDate,
        setToDate,
      }),
    [setFromDate, setToDate]
  );

  const handleToDateChange = useCallback(
    (newValue: any) =>
      changeBookingSlot({
        newFromDate: null,
        newToDate: newValue.target.value,
        prevFromDate: fromDate,
        prevToDate: toDate,
        granularity,
        minSlots: 1,
        maxSlots: maxTime,
        setFromDate,
        setToDate,
      }),
    [setFromDate, setToDate]
  );

  const eventPropGetter = useCallback(
    (event: Event, start: Date, end: Date, isSelected: Boolean) => ({
      ...(event.title === constants.currentBookingEventTitle && {
        style: {
          backgroundColor: '#537D08',
        },
      }),
      ...(event.title === constants.existentBookingEventTitle && {
        style: {
          backgroundColor: '#8B0000',
        },
      }),
    }),
    []
  );

  useEffect(() => {
    const { start, end } = normalizeBookingSlot(
      fromDate,
      toDate,
      granularity,
      1,
      maxTime,
      false
    );

    setCalendarDate(start || end || currentDate);

    if (start && end) {
      // add event of current booking
      setEvents(prevEvents => [
        ...prevEvents.filter(
          event => event.title !== constants.currentBookingEventTitle
        ),
        {
          title: constants.currentBookingEventTitle,
          start,
          end,
        },
      ]);
    } else {
      // remove booking event from calendar since it is no delimited
      setEvents(prevEvents =>
        prevEvents.filter(
          event => event.title !== constants.currentBookingEventTitle
        )
      );
    }
  }, [fromDate, toDate]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className={styles.modalContent}>
        <ModalHeader>Reservar servicio</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className={styles.serviceContainer}>
            <div className={styles.nameAndDescriptionContainer}>
              <p className={styles.serviceName}>{name}</p>
              <Text fontSize="md" noOfLines={3}>
                {description}
              </Text>
              <div className={styles.serviceBookingLimitsContainer}>
                {maxTime && (
                  <IconWithText
                    icon={<TimeIcon />}
                    text={<p>Reserva máxima {maxTime}</p>}
                  />
                )}
              </div>
              {bookingType === BookingType.RequiresConfirmation && (
                <IconWithText
                  icon={<WarningIcon />}
                  text={<p>Requiere confirmación</p>}
                />
              )}
            </div>
            <div className={styles.imageAndTagsContainer}>
              <ServiceImage className={styles.imageContainer} />
              <ServiceTags className={styles.tagsContainer} />
            </div>
          </div>
          <Divider />
          <div className={styles.bookingDateContainer}>
            <form>
              <div className={styles.dateSelectionContainer}>
                <FormControl>
                  <FormLabel>Desde</FormLabel>
                  <Input
                    size="lg"
                    type="datetime-local"
                    value={fromDate}
                    onChange={handleFromDateChange}
                    min={initialFromDateString}
                    step={granularity}
                  />
                  <FormHelperText>
                    Seleccione la fecha de inicio del servicio
                  </FormHelperText>
                </FormControl>
                <FormControl>
                  <FormLabel>Hasta</FormLabel>
                  <Input
                    size="lg"
                    type="datetime-local"
                    value={toDate}
                    onChange={handleToDateChange}
                    min={fromDate || initialFromDateString}
                  />
                  <FormHelperText>
                    Seleccione la fecha de finalización del servicio
                  </FormHelperText>
                </FormControl>
              </div>
            </form>
            <div className={styles.calendarContainer}>
              <Calendar
                localizer={localizer}
                defaultView="week"
                eventPropGetter={eventPropGetter}
                events={events}
                startAccessor="start"
                endAccessor="end"
                toolbar={true}
                date={calendarDate}
                onNavigate={onNavigate}
                onSelectSlot={onSelectSlot}
                selectable
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={loading}
            colorScheme="gray"
            mr={3}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            disabled={loading}
            isLoading={loading}
            colorScheme="linkedin"
            onClick={() => {
              void bookService({
                variables: {
                  service_id: id,
                  start_date: new Date(fromDate),
                  end_date: new Date(toDate),
                },
              });
            }}
          >
            Reservar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
