export const getErrorMessage = (error: any) => {
  const errorStatus = error?.networkError?.statusCode || '';
  const errorMessage =
    error?.networkError?.result?.errors[0]?.message ||
    'No se pudo realizar la operación.';
  return `${errorStatus} Error: ${errorMessage}`;
};
