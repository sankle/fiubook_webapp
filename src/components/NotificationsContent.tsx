import {
  Avatar,
  Button,
  Card,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'found';
import type { NotificationsEdgeType } from 'src/__generated__/graphql';
interface Props {
  notifications?: NotificationsEdgeType[];
  hasMore: boolean;
  onLoadMore: () => void;
}

enum NotificationType {
  NEW_BOOKING_REQUEST = 'NEW_BOOKING_REQUEST',
  BOOKING_REQUEST_ACCEPTED = 'BOOKING_REQUEST_ACCEPTED',
  BOOKING_REQUEST_REJECTED = 'BOOKING_REQUEST_REJECTED',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  BOOKING_REQUEST_CANCELLED = 'BOOKING_REQUEST_CANCELLED',
  OBJECT_DELIVERED = 'OBJECT_DELIVERED',
  OBJECT_RETURNED = 'OBJECT_RETURNED',
}

const NotificationTitleByType = {
  NEW_BOOKING_REQUEST: 'Nueva reserva',
  BOOKING_REQUEST_ACCEPTED: 'Reserva aceptada',
  BOOKING_REQUEST_REJECTED: 'Reserva rechazada',
  BOOKING_CANCELLED: 'Reserva cancelada',
  BOOKING_REQUEST_CANCELLED: 'Reserva cancelada',
  OBJECT_DELIVERED: 'Objeto entregado',
  OBJECT_RETURNED: 'Objeto devuelto',
};

const NotificationTargetByType = {
  NEW_BOOKING_REQUEST: '/requests',
  BOOKING_REQUEST_ACCEPTED: '/bookings',
  BOOKING_REQUEST_REJECTED: '/bookings',
  BOOKING_CANCELLED: '/bookings',
  BOOKING_REQUEST_CANCELLED: '/requests',
  OBJECT_DELIVERED: '/bookings',
  OBJECT_RETURNED: '/bookings',
};

const getNotificationDescription = (notification: NotificationsEdgeType) => {
  switch (notification.node.type) {
    case NotificationType.NEW_BOOKING_REQUEST:
      return `Nueva reserva de ${
        notification.node.booking?.service?.name as string
      }`;
    case NotificationType.BOOKING_REQUEST_ACCEPTED:
      return `Reserva de ${
        notification.node.booking?.service?.name as string
      } aceptada`;
    case NotificationType.BOOKING_REQUEST_REJECTED:
      return `Reserva de ${
        notification.node.booking?.service?.name as string
      } rechazada`;
    case NotificationType.BOOKING_REQUEST_CANCELLED:
      return `La reserva de ${
        notification.node.booking?.service?.name as string
      } fue cancelada`;
    case NotificationType.OBJECT_DELIVERED:
      return `Recibiste ${
        notification.node.booking?.service?.name as string
      }. Recorda devolverlo en tiempo y forma`;
    case NotificationType.OBJECT_RETURNED:
      return `Devolviste ${
        notification.node.booking?.service?.name as string
      } exitosamente`;
    default:
      return '';
  }
};

const getNotificationTime = (notificationTime: Date) => {
  const now = new Date();
  const diff = now.getTime() - notificationTime.getTime();
  const diffDays = Math.floor(diff / (1000 * 3600 * 24));
  const diffHours = Math.floor(diff / (1000 * 3600));
  const diffMinutes = Math.floor(diff / (1000 * 60));
  if (diffDays > 0) {
    return `Hace ${diffDays} días`;
  }
  if (diffHours > 0) {
    return `Hace ${diffHours} horas`;
  }
  if (diffMinutes > 0) {
    return `Hace ${diffMinutes} minutos`;
  }
  return 'Ahora';
};

const NotificationCard = ({
  notification,
}: {
  notification: NotificationsEdgeType;
}) => {
  const { router } = useRouter();

  return (
    <Card
      marginBottom={'5px'}
      width={'100%'}
      padding={'3px'}
      maxHeight={'120px'}
      overflow={'hidden'}
      minHeight={'100px'}
      as={'button'}
      onClick={() =>
        router.push(
          NotificationTargetByType[notification.node.type as NotificationType]
        )
      }
      backgroundColor={notification.node.read ? 'white' : 'blue.100'}
    >
      <HStack justifyContent={'space-between'} width={'100%'}>
        <VStack alignItems={'flex-start'} textAlign={'left'}>
          <Heading size={'sm'}>
            {
              NotificationTitleByType[
                notification.node.type as NotificationType
              ]
            }
          </Heading>
          <Text fontSize={'sm'} maxHeight={'100px'}>
            {getNotificationDescription(notification)}
          </Text>
          <Text fontSize={'x-small'} color={'gray.500'}>
            {getNotificationTime(new Date(notification.node.ts))}
          </Text>
        </VStack>
        <Avatar
          name={notification.node.booking?.service?.name}
          src={notification.node.booking?.service?.image_url}
        />
      </HStack>
    </Card>
  );
};

export default function NotificationsContent({
  notifications,
  hasMore,
  onLoadMore,
}: Props): JSX.Element {
  return (
    <VStack overflow={'auto'}>
      {notifications?.map((notification, i) => (
        <NotificationCard notification={notification} key={i} />
      ))}

      {hasMore && (
        <Button
          variant={'outline'}
          colorScheme={'linkedin'}
          onClick={onLoadMore}
        >
          Más
        </Button>
      )}
    </VStack>
  );
}
