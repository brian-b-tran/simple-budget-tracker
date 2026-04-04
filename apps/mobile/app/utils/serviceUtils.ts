export const handleError = (error: any): never => {
  const errorMessage =
    error.response?.data?.message ||
    'An unexpected error occurred with expense services.';
  throw new Error(errorMessage);
};
