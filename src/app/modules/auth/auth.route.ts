import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/signUp',
  validateRequest(AuthValidation.createUserZodSchema),
  AuthController.createUser
);
router.post('/refresh-token', AuthController.refreshToken);
router.post(
  '/signIn',
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginUser
);

router.patch(
  '/change-password',
  validateRequest(AuthValidation.changePasswordZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.CLIENT, ENUM_USER_ROLE.ADMIN),
  AuthController.changePassword
);
export const AuthRoutes = router;
