import { User, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { prisma } from '../../../shared/prisma';

const getAllFromDB = async (): Promise<Partial<User>[]> => {
  const result = await prisma.user.findMany();

  const users = result.map(user => {
    // eslint-disable-next-line no-unused-vars
    const { password, ...userInfo } = user;
    return userInfo;
  });

  return users;
};

const getDataById = async (userId: string): Promise<Partial<User>> => {
  const result = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  // eslint-disable-next-line no-unused-vars
  const { password, ...userInfo } = result;

  return userInfo;
};

const updateData = async (
  userId: string,
  user: JwtPayload,
  payload: Partial<User>
): Promise<Partial<User>> => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist');
  }

  const updateData = {
    name: payload.name || isUserExist.name,
    phone: payload.phone || isUserExist.phone,
    address: payload.address || isUserExist.address,
  };

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: updateData,
  });

  return updateData;
};

const deleteData = async (userId: string): Promise<Partial<User>> => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const result = await prisma.user.delete({
    where: {
      id: userId,
    },
  });
  // eslint-disable-next-line no-unused-vars
  const { password, ...deletedUserInfo } = result;
  return deletedUserInfo;
};

const updateUserRole = async (userId: string, role: UserRole) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role: role,
    },
  });
};

const addNewAdmin = async (payload: User): Promise<Partial<User>> => {
  const isUserExist = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
  });

  if (isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
  }

  payload.role = UserRole.admin;
  payload.password = bcrypt.hashSync(payload.password, 12);
  const result = await prisma.user.create({
    data: payload,
  });
  // eslint-disable-next-line no-unused-vars
  const { password, ...userInfo } = result;
  return userInfo;
};

export const AdminService = {
  getAllFromDB,
  getDataById,
  updateData,
  deleteData,
  updateUserRole,
  addNewAdmin,
};
