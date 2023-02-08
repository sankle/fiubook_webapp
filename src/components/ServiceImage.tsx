import { Image } from '@chakra-ui/react';
import styles from '@styles/ServiceImage.module.css';
import constants from '../constants';
// import { graphql } from 'relay-runtime';

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
      <Image src={constants.placeholderImage} className={styles.serviceImage} />
    </div>
  );
}
