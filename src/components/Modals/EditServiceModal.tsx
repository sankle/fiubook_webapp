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
import {
  BookingType,
  Service,
  UniversityRole,
} from '../../__generated__/graphql';
import { gql } from '../../__generated__/gql';
import { useMutation } from '@apollo/client';
import {
  serviceEditedSuccessfullyToast,
  serviceEditFailedToast,
} from '../notificationToasts';
import { useState } from 'react';
import UpsertServiceForm from '../UpsertServiceForm';

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

const getGranularityInitialValues = (granularity: number) => ({
  granularity_days: Math.floor(granularity / (3600 * 24)),
  granularity_hours: Math.floor((granularity % (3600 * 24)) / 3600),
  granularity_minutes: Math.floor((granularity % 3600) / 60),
});

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
    max_slots: service.max_time,
    allowed_roles: service.allowed_roles,
    tags: service.tags,
    ...getGranularityInitialValues(service.granularity),
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
    refetchQueries: ['GetServices', 'GetMyServices', 'GetServicesAdmin'],
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
          tags: values.tags,
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
            showImageField={false}
          />
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
