import { NextFunction, Request, Response } from 'express';
import moment from 'moment';
const middlewareRoot = (req: Request, res: Response, next: NextFunction) => {
  console.log('\n--------------------------\n');
  console.log(
    moment().format('MMMM Do YYYY, hh:mm A'),
    '\nMethod -> ',
    req.method,
    ' => ',
    'https://' + req.headers.host + req.url
  );
  console.log('\nbody -> ', req.body);
  console.log('\nquery -> ', req.query);
  console.log('\nparams -> ', req.params);
  console.log('\n--------------------------\n');
  next();
};

export default middlewareRoot;
