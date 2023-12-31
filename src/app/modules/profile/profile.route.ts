import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { UserProfileController } from './profile.controller';

const router = express.Router();

router.get(
  '/my-profile',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CLIENT),
  UserProfileController.getUsersProfile
);
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserProfileController.getSingleUserProfile
);
router.patch(
  '/update-profile',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CLIENT),
  UserProfileController.updateOneInDB
);

export const UserProfileRoutes = router;
