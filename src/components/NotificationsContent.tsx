import { Avatar, Card, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import type { NotificationsEdgeType } from 'src/__generated__/graphql';
interface Props {
  notifications?: NotificationsEdgeType[];
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

const NotificationCard = ({
  notification,
}: {
  notification: NotificationsEdgeType;
}) => {
  return (
    <Card
      marginBottom={'5px'}
      width={'100%'}
      padding={'3px'}
      maxHeight={'200px'}
      overflow={'hidden'}
      minHeight={'80px'}
    >
      <HStack justifyContent={'space-between'}>
        <VStack alignItems={'flex-start'}>
          <Heading size={'sm'}>
            {
              NotificationTitleByType[
                notification.node.type as NotificationType
              ]
            }
          </Heading>
          <Text fontSize={'sm'}>
            {getNotificationDescription(notification)}
          </Text>
        </VStack>
        <Avatar name={notification.node.booking?.service?.name} />
      </HStack>
    </Card>
  );
};

export default function NotificationsContent({
  notifications,
}: Props): JSX.Element {
  return (
    <VStack overflow={'auto'} maxHeight={'300px'}>
      {notifications?.map((notification, i) => (
        <NotificationCard notification={notification} key={i} />
      ))}
    </VStack>
  );
}
