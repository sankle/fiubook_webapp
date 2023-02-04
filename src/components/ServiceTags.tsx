import { InfoIcon } from '@chakra-ui/icons';
import { Tag } from '@chakra-ui/react';
import styles from '@styles/ServiceTags.module.css';

export default function ServiceTags({
  className,
  tags,
}: {
  className: string;
  tags: string[];
}): JSX.Element {
  return (
    <div className={className}>
      {tags?.length && <InfoIcon className={styles.tagsIcon} />}
      {tags.map(tagName => (
        <Tag key={tagName} size="sm" variant="solid" colorScheme="teal">
          {tagName}
        </Tag>
      ))}
    </div>
  );
}
