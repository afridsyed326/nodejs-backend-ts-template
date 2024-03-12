import ErrorHandlingMiddleware from '../interface/ErrorHandlingMiddleware';

export const logError: ErrorHandlingMiddleware = (err, req, res, next) => {
  // Log the error or send it to a 3rd party error monitoring software
  console.log('Calling logError middleware');
  next(err);
};

export const sendEmail: ErrorHandlingMiddleware = (err, req, res, next) => {
  // Send an email to yourself or a message somewhere
  console.log('Calling sendEmail middleware');
  next(err);
};

export const handleFinalError: ErrorHandlingMiddleware = (
  err,
  req,
  res,
  next
) => {
  // Lastly, handle the error
  console.log('Calling handleFinalError middleware');
  next(err);
};

export default {
  logError,
  sendEmail,
  handleFinalError,
};
