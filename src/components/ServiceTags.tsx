import { HStack, Tag } from '@chakra-ui/react';
import { FaTags } from 'react-icons/fa';

interface Props {
  tags: string[];
}

export default function ServiceTags({ tags }: Props): JSX.Element {
  return tags.length > 0 ? (
    <HStack spacing={2} shouldWrapChildren overflow="scroll">
      <FaTags />
      {tags.map(tagName => (
        <Tag key={tagName} size="sm" variant="solid" colorScheme="teal">
          {tagName}
        </Tag>
      ))}
    </HStack>
  ) : (
    <></>
  );
}
