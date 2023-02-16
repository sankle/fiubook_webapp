import { DeleteIcon } from '@chakra-ui/icons';
import { Button, Icon, Image, Stack } from '@chakra-ui/react';
import React from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { AiFillFileImage } from 'react-icons/ai';

interface Props {
  images: ImageListType;
  setImages: (images: ImageListType) => void;
}

export default function ImageUploader({ images, setImages }: Props) {
  const maxNumber = 1;

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    setImages(imageList as never[]);
  };

  return (
    <ImageUploading
      multiple
      value={images}
      onChange={onChange}
      maxNumber={maxNumber}
      dataURLKey="data_url"
    >
      {({ imageList, onImageUpload, onImageRemove, isDragging, dragProps }) => (
        // write your building UI

        <Stack align={'flex-start'}>
          {images.length === 0 && (
            <Button
              style={isDragging ? { color: 'red' } : undefined}
              onClick={onImageUpload}
              variant={'outline'}
              colorScheme={'linkedin'}
              leftIcon={<Icon as={AiFillFileImage} />}
              size={'sm'}
              {...dragProps}
            >
              Agregar
            </Button>
          )}
          {imageList.map((image, index) => (
            <Stack spacing={'2'} key={index} align={'center'}>
              <Image src={image.data_url} boxSize={200} />
              <Button
                leftIcon={<DeleteIcon />}
                onClick={() => onImageRemove(index)}
                variant={'outline'}
                colorScheme={'red'}
                size={'sm'}
              >
                Quitar
              </Button>
            </Stack>
          ))}
        </Stack>
      )}
    </ImageUploading>
  );
}
