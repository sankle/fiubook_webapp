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
  // useToast,
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
// import {
//   serviceBookedSuccessfullyToast,
//   serviceBookFailedToast,
// } from './notificationToasts';

// TODO: add some validations and disable booking button accordingly

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const localizer = dayjsLocalizer(dayjs);

export default function BookServiceModal({
  isOpen,
  onClose,
}: Props): JSX.Element {
  // TODO: replace with preloaded query

  const bookingServiceData = {
    name: 'Dummy Service',
    description: 'Dummy description',
    granularity: 1800,
    max_time: 3,
    booking_type: 'AUTOMATIC',
  };

  const existentBookingsData = {
    conflictingBookings: [],
  };
  // const toast = useToast();

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
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            colorScheme="linkedin"
            onClick={() => {
              console.log('Clicked');
            }}
          >
            Reservar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
