import { Tag } from '@chakra-ui/react';
import styles from '@styles/ServiceTags.module.css';
import { FaTags } from 'react-icons/fa';
interface Props {
  className: string;
  tags: string[];
}

export default function ServiceTags({ className, tags }: Props): JSX.Element {
  return (
    <div className={className}>
      {tags?.length ? <FaTags className={styles.tagsIcon} /> : null}
      {tags.map(tagName => (
        <Tag key={tagName} size="sm" variant="solid" colorScheme="teal">
          {tagName}
        </Tag>
      ))}
    </div>
  );
}
