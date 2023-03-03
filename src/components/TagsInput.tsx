import { InfoIcon } from '@chakra-ui/icons';
import {
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Tag,
  TagCloseButton,
  Tooltip,
} from '@chakra-ui/react';

interface Props {
  onBlur: () => void;
  onChange: (tags: string[]) => void;
  tags: string[];
  touched?: boolean;
  error?: string;
}

export default function TagsInput({
  onBlur,
  onChange,
  tags,
  touched,
  error,
}: Props): JSX.Element {
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
      <InputGroup>
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
          onBlur={onBlur}
        />
        {touched && !!error && (
          <InputRightElement>
            <Tooltip label={error}>
              <InfoIcon color="red" />
            </Tooltip>
          </InputRightElement>
        )}
      </InputGroup>
    </>
  );
}
