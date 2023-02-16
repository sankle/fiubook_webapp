import { useToast } from '@chakra-ui/react';
import {
  serviceCreatedSuccessfullyToast,
  serviceCreationFailedToast,
} from './notificationToasts';
import { useState } from 'react';
import { gql } from '../__generated__/gql';
import { useMutation } from '@apollo/client';
import { BookingType, UniversityRole } from '../__generated__/graphql';
import UpsertServiceForm from './UpsertServiceForm';
import { useRouter } from 'found';
import { ImageListType } from 'react-images-uploading';
import { uploadImage } from '../utils/imageUtils';

const initialValues = {
  name: '',
  description: '',
  automatic_confirmation: true,
  granularity_days: 0,
  granularity_hours: 1,
  granularity_minutes: 0,
  max_slots: 1,
  allowed_roles: ['PROFESSOR', 'STUDENT', 'NODO'],
  tags: [],
};

const createServiceMutation = gql(/* GraphQL */ `
  mutation NewServiceFormCreateServiceMutation(
    $creation_args: CreateServiceArgs!
  ) {
    createService(creationArgs: $creation_args) {
      id
      name
      description
    }
  }
`);

export default function NewServiceForm(): JSX.Element {
  const { router } = useRouter();
  const toast = useToast();

  const [upsertedSuccessfully, setUpsertedSuccessfully] = useState(false);

  const [images, setImages] = useState<ImageListType>([]);
  const [imageUploading, setImageUploading] = useState(false);

  const [createService, { loading }] = useMutation(createServiceMutation, {
    onCompleted: response => {
      setUpsertedSuccessfully(true);
      router.replace('/my-services');
      toast(serviceCreatedSuccessfullyToast(response.createService.name));
    },
    onError: error => {
      toast(serviceCreationFailedToast(error.message));
    },
    refetchQueries: ['GetServices', 'GetMyServices'],
  });

  const onSubmit = async (values: any) => {
    let imageUrl;
    if (images.length > 0) {
      setImageUploading(true);
      try {
        imageUrl = await uploadImage(images[0].file as File);
      } catch (err) {
        console.log('Error uploading image.');
        console.log(JSON.stringify(err));
      }
    }

    console.log(
      `A punto de enviar el servicio con la image url ${imageUrl as string}`
    );

    await createService({
      variables: {
        creation_args: {
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
          image_url: imageUrl,
        },
      },
    });
    setUpsertedSuccessfully(true);
  };

  return (
    <UpsertServiceForm
      onSubmit={onSubmit}
      initialValues={initialValues}
      loading={loading || imageUploading}
      upsertedSuccessfully={upsertedSuccessfully}
      actionLabel="Crear"
      images={images}
      setImages={setImages}
    />
  );
}
