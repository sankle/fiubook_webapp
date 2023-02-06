import { InfoIcon } from '@chakra-ui/icons';
import { Tag } from '@chakra-ui/react';
import styles from '@styles/ServiceTags.module.css';

// TODO: Missing server-side implementation. Hardcoding for now.

interface Props {
  className: string;
}

const hardcodedTags = [
  ['Computación', 'Libro'],
  ['Computación', 'Equipo'],
  ['Bedelía', 'Aula'],
  ['Alumnos', 'Equipo'],
];

export default function ServiceTags({ className }: Props): JSX.Element {
  const tags = hardcodedTags[Math.floor(Math.random() * hardcodedTags.length)];

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
