export const handleError = (error: any): never => {
  const errorMessage =
    error.response?.data?.message ||
    'An unexpected error occurred with expense services.';
  console.error(error.response.status + ' ' + error.response.data.message);
  throw new Error(errorMessage);
};
