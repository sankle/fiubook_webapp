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
} from '@chakra-ui/react';
import styles from '@styles/BookServiceModal.module.css';
import IconWithText from './IconWithText';
import ServiceImage from './ServiceImage';
import ServiceTags from './ServiceTags';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, Event, dayjsLocalizer, SlotInfo } from 'react-big-calendar';
import dayjs from 'dayjs';
import { graphql, useFragment } from 'react-relay';
import { BookServiceModalFragment$key } from './__generated__/BookServiceModalFragment.graphql';
import {
  changeBookingSlot,
  convertToLocaleString,
  normalizeBookingSlot,
} from '../utils/dateRangeUtils';
import constants from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  service: BookServiceModalFragment$key;
}

const BookServiceModalFragment = graphql`
  fragment BookServiceModalFragment on Service {
    id
    name
    description
    ts
    granularity
    booking_type
    min_time
    max_time
  }
`;

const localizer = dayjsLocalizer(dayjs);

export default function BookServiceModal({
  isOpen,
  onClose,
  service,
}: Props): JSX.Element {
  const data = useFragment(BookServiceModalFragment, service);

  const granularity = data.granularity; // in seconds
  const minSlots = data.min_time;
  const maxSlots = data.max_time;

  const [events, setEvents] = useState<Event[]>([]);

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
          minSlots,
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
        minSlots,
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
        minSlots,
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
        minSlots,
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
        minSlots,
        maxSlots,
        setFromDate,
        setToDate,
      }),
    [setFromDate, setToDate]
  );

  useEffect(() => {
    const { start, end } = normalizeBookingSlot(
      fromDate,
      toDate,
      granularity,
      minSlots,
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
              <p className={styles.serviceName}>{data.name}</p>
              <Text fontSize="md" noOfLines={3}>
                {data.description}
              </Text>
              <div className={styles.serviceBookingLimitsContainer}>
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
              </div>
              {data.booking_type === 'REQUIRES_CONFIRMATION' && (
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
          <Button colorScheme="linkedin">Siguiente</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
