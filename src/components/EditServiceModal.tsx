import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import styles from '@styles/EditServiceModal.module.css';
import { BookingType, Service, UniversityRole } from '../__generated__/graphql';
import { gql } from '../__generated__/gql';
import { useMutation } from '@apollo/client';
import {
  serviceEditedSuccessfullyToast,
  serviceEditFailedToast,
} from './notificationToasts';
import { useState } from 'react';
import UpsertServiceForm from './UpsertServiceForm';

// TODO: add some validations and disable booking button accordingly

interface Props {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
}

const editServiceMutation = gql(/* GraphQL */ `
  mutation EditServiceModalEditServiceMutation(
    $service_id: String!
    $update_args: UpdateServiceArgs!
  ) {
    updateService(service_id: $service_id, update_args: $update_args) {
      id
      name
      description
    }
  }
`);

export default function EditServiceModal({
  isOpen,
  onClose,
  service,
}: Props): JSX.Element {
  if (!service) {
    return <></>;
  }

  const initialValues = {
    name: service.name,
    description: service.description,
    automatic_confirmation: service.booking_type === BookingType.Automatic,
    granularity_days: 0,
    granularity_hours: 1,
    granularity_minutes: 0,
    max_slots: 1,
    allowed_roles: ['PROFESSOR', 'STUDENT', 'NODO'],
  };

  const toast = useToast();

  const [upsertedSuccessfully, setUpsertedSuccessfully] = useState(false);

  const [editService, { loading }] = useMutation(editServiceMutation, {
    onCompleted: response => {
      setUpsertedSuccessfully(true);
      onClose();
      toast(serviceEditedSuccessfullyToast(response.updateService.name));
    },
    onError: error => {
      toast(serviceEditFailedToast(error.message));
    },
    refetchQueries: ['GetServices', 'GetMyServices'],
  });

  const onSubmit = (values: any) => {
    void editService({
      variables: {
        service_id: service.id,
        update_args: {
          name: values.name,
          description: values.description,
          granularity:
            86400 * values.granularity_days +
            3600 * values.granularity_hours +
            60 * values.granularity_minutes,
          max_time: values.max_slots,
          booking_type: values.automatic_confirmation
            ? BookingType.Automatic
            : BookingType.RequiresConfirmation,
          allowed_roles: values.allowed_roles as UniversityRole[],
        },
      },
    });
    setUpsertedSuccessfully(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className={styles.modalContent}>
        <ModalCloseButton />
        <ModalBody>
          <UpsertServiceForm
            onSubmit={onSubmit}
            initialValues={initialValues}
            loading={loading}
            upsertedSuccessfully={upsertedSuccessfully}
            actionLabel="Editar"
          />
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
