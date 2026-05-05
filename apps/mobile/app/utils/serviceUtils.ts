export const handleError = (error: any): never => {
  console.log('Raw error response:', JSON.stringify(error.response?.data));
  const errorMessage =
    error.response?.data?.message ||
    'An unexpected error occurred with expense services.';
  throw new Error(errorMessage);
};
