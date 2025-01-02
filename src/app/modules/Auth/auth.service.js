import httpStatus from "http-status";
import AppError from "../../errors/AppError.js";
import { User } from "../User/user.model.js";
import config from "../../config/index.js";
import bcrypt from "bcrypt";
import { createToken, verifyToken } from "./auth.utils.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail.js";

const loginUser = async (payload) => {
  const user = await User.isUserExist(payload?.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
  }

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is not found!");
  }

  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password not matched");
  }

  const jwtPayload = { userId: user?.id, role: user?.role };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in
  );

  return { accessToken, refreshToken };
};

const changePassword = async (userData, payload) => {
  const user = await User.isUserExist(userData?.userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is now found!");
  }

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is now found!");
  }

  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }

  if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password not matched");
  }

  const newHashPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashPassword,
      passwordChangedAt: new Date(),
    }
  );

  return null;
};

const refreshToken = async (token) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  const decoded = verifyToken(token, config.jwt_refresh_secret)

  const { role, userId, iat } = decoded;

  const user = await User.isUserExist(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is now found!");
  }

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is now found!");
  }

  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  const jwtPayload = { userId: user?.id, role: user?.role };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (userId) => {
  const user = await User.isUserExist(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is now found!");
  }

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is now found!");
  }

  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }

  const jwtPayload = { userId: user?.id, role: user?.role };

  const resetToken = createToken(jwtPayload, config.jwt_access_secret, "10m");

  const resetUILink = `${config.reset_pass_ui_link}?id=${user?.id}&token=${resetToken}`;

  sendEmail(user?.email, resetUILink);
};

const resetPassword = async (payload, token) => {
  const { id, newPassword } = payload;
  const user = await User.isUserExist(payload?.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is now found!");
  }

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is now found!");
  }

  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }

  const decoded = jwt.verify(token, config.jwt_access_secret);

  if (payload?.id !== decoded?.userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not forbidden!");
  }

  const newHashPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await User.findOneAndUpdate(
    {
      id: decoded?.userId,
      role: decoded?.role,
    },
    {
      password: newHashPassword,
      passwordChangedAt: new Date(),
    }
  );
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};