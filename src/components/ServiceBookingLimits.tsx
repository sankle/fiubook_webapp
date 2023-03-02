import { TimeIcon, WarningIcon } from '@chakra-ui/icons';
import styles from '@styles/ServiceBookingLimits.module.css';
import { getGranularityString } from '../utils/dateUtils';
import { BookingType, Service } from '../__generated__/graphql';
import IconWithText from './IconWithText';
import { MdAssignmentReturn } from 'react-icons/md';
interface Props {
  service: Service;
}

export default function ServiceBookingLimits({ service }: Props) {
  return (
    <div className={styles.serviceBookingLimitsContainer}>
      <IconWithText
        icon={<TimeIcon />}
        text={<p>Slots de {getGranularityString(service.granularity)}</p>}
      />
      <IconWithText
        icon={<TimeIcon />}
        text={
          <p>
            Reserva máxima {service.max_time} slot
            {service.max_time > 1 ? 's' : ''}
          </p>
        }
      />
      {service.booking_type === BookingType.RequiresConfirmation && (
        <IconWithText
          icon={<WarningIcon />}
          text={<p>Requiere confirmación</p>}
        />
      )}
      {service.returnable && (
        <IconWithText
          icon={<MdAssignmentReturn />}
          text={<p>Requiere devolución</p>}
        />
      )}
    </div>
  );
}
