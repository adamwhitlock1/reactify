const handleError = (functionName, error) => {
  const message = `ERROR CALLING ${functionName}`;
  console.error(message, error);
  throw new Error(message);
};

module.exports = { handleError };
