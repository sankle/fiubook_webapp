import { Image } from '@chakra-ui/react';
import styles from '@styles/ServiceImage.module.css';
// import { graphql } from 'relay-runtime';

// TODO: change this
const placeholderImage =
  'https://www.grouphealth.ca/wp-content/uploads/2018/05/placeholder-image.png';

// const ServiceImageFragment = graphql`
//   fragment ServiceImageFragment on Service {

//   }
// `;

// TODO: Missing server-side implementation
export default function ServiceImage({
  className,
}: {
  className: string;
}): JSX.Element {
  return (
    <div className={className}>
      <Image src={placeholderImage} className={styles.serviceImage} />
    </div>
  );
}
