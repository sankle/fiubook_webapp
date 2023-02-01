import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
} from '@chakra-ui/react';
import { ReactElement } from 'react';

const WrongLoginAlert = ({
  isVisible,
  errorMsg,
}: {
  isVisible: boolean;
  errorMsg: string;
}): ReactElement => {
  return (
    <Alert
      status="error"
      variant="solid"
      borderRadius={5}
      width="300px"
      visibility={isVisible ? 'visible' : 'hidden'}
    >
      <AlertIcon />
      <Box>
        <AlertTitle>Error al Iniciar Sesion</AlertTitle>
        <AlertDescription>{errorMsg}</AlertDescription>
      </Box>
    </Alert>
  );
};

export default WrongLoginAlert;
