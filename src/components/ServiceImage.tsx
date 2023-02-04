import { Image } from '@chakra-ui/react';
import styles from '@styles/ServiceImage.module.css';

// TODO: change this
const placeholderImage =
  'https://www.grouphealth.ca/wp-content/uploads/2018/05/placeholder-image.png';

export default function ServiceImage({
  className,
  imageUrl,
}: {
  className: string;
  imageUrl: string | null;
}): JSX.Element {
  return (
    <div className={className}>
      <Image
        src={imageUrl ?? placeholderImage}
        className={styles.serviceImage}
      />
    </div>
  );
}
