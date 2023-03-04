import { Image } from '@chakra-ui/react';
import styles from '@styles/ServiceImage.module.css';

interface Props {
  className: string;
  url: string;
}

export default function ServiceImage({ className, url }: Props): JSX.Element {
  return (
    <div className={className}>
      <Image src={url} className={styles.serviceImage} />
    </div>
  );
}
