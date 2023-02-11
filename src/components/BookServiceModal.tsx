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
  graphql,
  useFragment,
  useLazyLoadQuery,
  useMutation,
} from 'react-relay';
import { BookServiceModalServiceFragment$key } from './__generated__/BookServiceModalServiceFragment.graphql';
import { BookServiceModalExistentBookingsQuery as ExistentBookingsQueryType } from './__generated__/BookServiceModalExistentBookingsQuery.graphql';
import { BookServiceModalMutation } from './__generated__/BookServiceModalMutation.graphql';
import {
  changeBookingSlot,
  convertToLocaleString,
  normalizeBookingSlot,
} from '../utils/dateRangeUtils';
import constants from '../constants';
import {
  serviceBookedSuccessfullyToast,
  serviceBookFailedToast,
} from './notificationToasts';

// TODO: add some validations and disable booking button accordingly

interface Props {
  isOpen: boolean;
  onClose: () => void;
  service: BookServiceModalServiceFragment$key;
}

const BookServiceModalServiceFragment = graphql`
  fragment BookServiceModalServiceFragment on Service {
    id
    name
    description
    ts
    granularity
    booking_type
    max_time
  }
`;

const BookServiceModalExistentBookingsQuery = graphql`
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
`;

const BookServiceMutation = graphql`
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
`;

const localizer = dayjsLocalizer(dayjs);

export default function BookServiceModal({
  isOpen,
  onClose,
  service,
}: Props): JSX.Element {
  const bookingServiceData = useFragment(
    BookServiceModalServiceFragment,
    service
  );

  // TODO: replace with preloaded query
  const existentBookingsData = useLazyLoadQuery<ExistentBookingsQueryType>(
    BookServiceModalExistentBookingsQuery,
    {
      serviceId: bookingServiceData.id,
      startDate: constants.existentBookingsQueryStartDate,
      endDate: constants.existentBookingsQueryEndDate,
    }
  );

  const [commitMutation, isMutationInFlight] =
    useMutation<BookServiceModalMutation>(BookServiceMutation);

  const toast = useToast();

  const granularity = bookingServiceData.granularity; // in seconds
  const maxSlots = bookingServiceData.max_time;

  const existentEvents = existentBookingsData.conflictingBookings.map(
    ({ start_date: start, end_date: end }) => ({
      title: constants.existentBookingEventTitle,
      start: new Date(start),
      end: new Date(end),
    })
  );

  const [events, setEvents] = useState<Event[]>(existentEvents);

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
          maxSlots,
          false
        );

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
        maxSlots,
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
        maxSlots,
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
        maxSlots,
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
        maxSlots,
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
      maxSlots,
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
              <p className={styles.serviceName}>{bookingServiceData.name}</p>
              <Text fontSize="md" noOfLines={3}>
                {bookingServiceData.description}
              </Text>
              <div className={styles.serviceBookingLimitsContainer}>
                {bookingServiceData.max_time && (
                  <IconWithText
                    icon={<TimeIcon />}
                    text={<p>Reserva máxima {bookingServiceData.max_time}</p>}
                  />
                )}
              </div>
              {bookingServiceData.booking_type === 'REQUIRES_CONFIRMATION' && (
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
            disabled={isMutationInFlight}
            colorScheme="gray"
            mr={3}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            disabled={isMutationInFlight}
            isLoading={isMutationInFlight}
            colorScheme="linkedin"
            onClick={() => {
              commitMutation({
                variables: {
                  service_id: bookingServiceData.id,
                  start_date: new Date(fromDate),
                  end_date: new Date(toDate),
                },
                // TODO: update MyBookingsList
                // (I could not find a way to do it without passing a reference to the connection fragment)
                // updater: (store, data) => {
                //   )
                // },
                onCompleted: data => {
                  toast(
                    serviceBookedSuccessfullyToast(
                      bookingServiceData.name,
                      data.createBooking.bookingEdge.node.start_date,
                      data.createBooking.bookingEdge.node.end_date
                    )
                  );
                  onClose();
                },
                onError: (error: Error) => {
                  // TODO: parse error message somehow
                  toast(
                    serviceBookFailedToast(
                      bookingServiceData.name,
                      error.message
                    )
                  );
                  onClose();
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
