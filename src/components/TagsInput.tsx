import { Input, Stack, Tag, TagCloseButton } from '@chakra-ui/react';

interface Props {
  onChange: (tags: string[]) => void;
  tags: string[];
}

export default function TagsInput({ onChange, tags }: Props): JSX.Element {
  return (
    <>
      <Stack direction={'row'} wrap={'wrap'}>
        {tags.map((tag, i) => (
          <Tag key={i}>
            {tag}
            <TagCloseButton
              onClick={() => {
                onChange(tags.filter(existingTag => existingTag !== tag));
              }}
            />
          </Tag>
        ))}
      </Stack>
      <Input
        id="name"
        name="name"
        type="text"
        variant={'flushed'}
        fontSize={'sm'}
        onKeyDown={event => {
          if (event.key === ' ') {
            event.preventDefault();
            if (event.currentTarget.value === '') return;
            onChange([...tags, event.currentTarget.value]);
            event.currentTarget.value = '';
          }
        }}
      />
    </>
  );
}
