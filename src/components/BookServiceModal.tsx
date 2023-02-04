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
import { Service } from '../global/types';
import IconWithText from './IconWithText';
import ServiceImage from './ServiceImage';
import ServiceTags from './ServiceTags';
import { useEffect, useState } from 'react';
import { Calendar, Event, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';

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

const currentDate = convertToLocaleString(
  floorToStepMinutes(new Date(), stepMinutes)
);

export default function BookServiceModal({
  isOpen,
  onClose,
  service,
}: {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
}): JSX.Element {
  const [events, setEvents] = useState<Event[]>([]);

  const [fromDate, setFromDate] = useState(currentDate);
  const [toDate, setToDate] = useState(currentDate);

  // TODO: useMemoization for calendar props. Follow examples in the library docs website.
  const [calendarDate, setCalendarDate] = useState(new Date(currentDate));

  const handleFromDateChange = (newValue: any) => {
    setFromDate(newValue.target.value);
  };

  const handleToDateChange = (newValue: any) => {
    setToDate(newValue.target.value);
  };

  useEffect(() => {
    setCalendarDate(new Date(fromDate ?? toDate ?? currentDate));

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
              <p className={styles.serviceName}>{service.name}</p>
              <Text fontSize="md" noOfLines={3}>
                {service.description}
              </Text>
              <div className={styles.serviceBookingLimitsContainer}>
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
              </div>
              {service.requiresConfirmation && (
                <IconWithText
                  icon={<WarningIcon />}
                  text={<p>Requiere confirmación</p>}
                />
              )}
            </div>
            <div className={styles.imageAndTagsContainer}>
              <ServiceImage
                className={styles.imageContainer}
                imageUrl={service.imageUrl ?? null}
              />
              <ServiceTags
                className={styles.tagsContainer}
                tags={service.tags}
              />
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
                    min={currentDate}
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
                    min={fromDate ?? currentDate}
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
                onNavigate={newDate =>
                  setFromDate(convertToLocaleString(newDate))
                }
                onSelectSlot={slotInfo => {
                  console.log('onSelectSlot: ', slotInfo);
                  setFromDate(convertToLocaleString(slotInfo.start));
                  setToDate(convertToLocaleString(slotInfo.end));
                }}
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
