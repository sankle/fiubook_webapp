import { useQuery } from '@apollo/client';
import { RepeatIcon } from '@chakra-ui/icons';
import {
  Card,
  Heading,
  IconButton,
  Spinner,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { gql } from '../../../__generated__/gql';

const StatCard = ({
  label,
  value,
  helpText,
  color,
}: {
  label: string;
  value?: number;
  helpText: string;
  color?: string;
}) => {
  return (
    <Card padding={'0.5em'} width={'10em'}>
      <Stat>
        <StatLabel>
          <Heading size={'sm'} color={'linkedin.500'}>
            {label}
          </Heading>
        </StatLabel>
        <StatNumber>{value}</StatNumber>
        <StatHelpText>{helpText}</StatHelpText>
      </Stat>
    </Card>
  );
};

const metricsQuery = gql(/* GraphQL */ `
  query GetMetricsQuery {
    metrics {
      users {
        user_count
        student_count
        nodo_count
        professor_count
        banned_count
      }
      services {
        service_count
        automatic_confirmation_services_count
        manual_confirmation_services_count
      }
      bookings {
        booking_count
        confirmed_bookings_count
        cancelled_bookings_count
        pending_bookings_count
      }
    }
  }
`);

export default function AdminMetrics(): JSX.Element {
  const { data, loading, refetch } = useQuery(metricsQuery);
  if (loading || !data) {
    return <Spinner />;
  }

  return (
    <Stack
      direction={'column'}
      width={'60em'}
      backgroundColor={'white'}
      borderRadius={'md'}
      padding={'0.5em'}
      align={'flex-start'}
    >
      <Heading as={'h1'} size={'lg'}>
        Métricas &nbsp;
        <IconButton
          colorScheme={'linkedin'}
          aria-label={'Refrescar'}
          variant={'outline'}
          icon={<RepeatIcon />}
          onClick={() => {
            void refetch();
          }}
        />
      </Heading>
      <Stack width={'100%'} padding={'0.5em'}>
        <Heading as={'h2'} size={'md'} color={'linkedin.500'}>
          Usuarios
        </Heading>
        <Stack direction={'row'} marginTop={'0.5em'}>
          <StatCard
            label={'Total'}
            value={data.metrics.users?.user_count}
            helpText={'Usuarios registrados totales'}
          />
          <StatCard
            label={'Profesores'}
            value={data.metrics.users?.professor_count}
            helpText={'Usuarios registrados como profesores'}
          />
          <StatCard
            label={'Alumnos'}
            value={data.metrics.users?.student_count}
            helpText={'Usuarios registrados como alumnos'}
          />
          <StatCard
            label={'No Docentes'}
            value={data.metrics.users?.nodo_count}
            helpText={'Usuarios registrados como no docentes'}
          />
          <StatCard
            label={'Bloqueados'}
            value={data.metrics.users?.banned_count}
            helpText={'Usuarios bloqueados'}
          />
        </Stack>
      </Stack>
      <Stack width={'100%'} padding={'0.5em'}>
        <Heading as={'h2'} size={'md'} color={'linkedin.500'}>
          Servicios
        </Heading>
        <Stack direction={'row'} marginTop={'0.5em'}>
          <StatCard
            label={'Total'}
            value={data.metrics.services?.service_count}
            helpText={'Cantidad total de servicios'}
          />
          <StatCard
            label={'Automáticos'}
            value={data.metrics.services?.automatic_confirmation_services_count}
            helpText={'Cantidad de servicios con reserva automática'}
          />
          <StatCard
            label={'Manual'}
            value={data.metrics.services?.manual_confirmation_services_count}
            helpText={'Cantidad de servicios con confirmación manual'}
          />
        </Stack>
      </Stack>
      <Stack width={'100%'} padding={'0.5em'}>
        <Heading as={'h2'} size={'md'} color={'linkedin.500'}>
          Reservas
        </Heading>
        <Stack direction={'row'} marginTop={'0.5em'}>
          <StatCard
            label={'Total'}
            value={data.metrics.bookings?.booking_count}
            helpText={'Cantidad total de reservas realizadas'}
          />
          <StatCard
            label={'Confirmadas'}
            value={data.metrics.bookings?.confirmed_bookings_count}
            helpText={'Cantidad de reservas confirmadas'}
          />
          <StatCard
            label={'Pendientes'}
            value={data.metrics.bookings?.pending_bookings_count}
            helpText={'Cantidad de reservas pendientes de confirmación'}
          />
          <StatCard
            label={'Canceladas'}
            value={data.metrics.bookings?.cancelled_bookings_count}
            helpText={'Cantidad de reservas canceladas'}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
