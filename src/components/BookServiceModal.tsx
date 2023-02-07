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
import timezone from 'dayjs/plugin/timezone';
import { graphql, useFragment } from 'react-relay';
import { BookServiceModalFragment$key } from './__generated__/BookServiceModalFragment.graphql';

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

dayjs.extend(timezone);
// TODO: fix timezone drift when clicking calendar.
dayjs.tz.setDefault('America/Argentina/Buenos_Aires');
const localizer = dayjsLocalizer(dayjs);

const stepMinutes = 30;
const currentBookingEventTitle = 'Su reserva';

const floorToStepMinutes = (date: Date, stepMinutes: number) => {
  const minutes = date.getMinutes();
  const newMinutes = Math.floor(minutes / stepMinutes) * stepMinutes;
  date.setMinutes(newMinutes);
  return date;
};

const convertToLocaleString = (date: Date) => date.toISOString().slice(0, -8);

export default function BookServiceModal({
  isOpen,
  onClose,
  service,
}: Props): JSX.Element {
  const data = useFragment(BookServiceModalFragment, service);

  const [events, setEvents] = useState<Event[]>([]);

  const { currentDate, currentDateString } = useMemo(() => {
    const currentDate = new Date();

    return {
      currentDate,
      currentDateString: convertToLocaleString(
        floorToStepMinutes(currentDate, stepMinutes)
      ),
    };
  }, []);

  const [fromDate, setFromDate] = useState(currentDateString);
  const [toDate, setToDate] = useState(currentDateString);

  // TODO: useMemoization for calendar props. Follow examples in the library docs website.
  const [calendarDate, setCalendarDate] = useState(currentDate);

  const onSelectSlot = useCallback(
    (slotInfo: SlotInfo) => {
      setFromDate(convertToLocaleString(slotInfo.start));
      setToDate(convertToLocaleString(slotInfo.end));
    },
    [setFromDate, setToDate]
  );

  const onNavigate = useCallback(
    (newDate: Date) => setFromDate(convertToLocaleString(newDate)),
    [setFromDate]
  );

  const handleFromDateChange = (newValue: any) => {
    setFromDate(newValue.target.value);
  };

  const handleToDateChange = (newValue: any) => {
    setToDate(newValue.target.value);
  };

  useEffect(() => {
    setCalendarDate(new Date(fromDate || toDate || currentDate));

    // add event of current booking
    if (fromDate && toDate) {
      setEvents(prevEvents => [
        ...prevEvents.filter(event => event.title !== currentBookingEventTitle),
        {
          title: currentBookingEventTitle,
          start: new Date(fromDate),
          end: new Date(toDate),
        },
      ]);
    } else {
      setEvents(prevEvents =>
        prevEvents.filter(event => event.title !== currentBookingEventTitle)
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
                    min={currentDateString}
                    step={stepMinutes * 60}
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
                    min={fromDate || currentDateString}
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
