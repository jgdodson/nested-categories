import { Request, Response, NextFunction } from 'express';

import checkAPI, { ValidationChain } from 'express-validator/check';

function isObjectIdHex(vc: ValidationChain): ValidationChain {
  return vc.isHexadecimal().isLength({ min: 24, max: 24 });
}

const product = {
  name: function (vc: ValidationChain): ValidationChain {
    return vc.isLength({ min: 1 });
  },

  price: function (vc: ValidationChain): ValidationChain {
    return vc.isFloat().toFloat();
  },

  description: function (vc: ValidationChain): ValidationChain {
    return vc.isLength({ min: 1 });
  },

  categories: function (vc: ValidationChain): ValidationChain {
    return vc.isArray();
  },
};

function handleErrors(req: Request, res: Response, next: NextFunction): void {
  const errors = checkAPI.validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json(errors.mapped());
  } else {
    next();
  }
}

export default {
  isObjectIdHex,
  product,
  handleErrors,
};
