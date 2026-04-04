import { User } from "../models/User.js";
import { WorkerProfile } from "../models/WorkerProfile.js";
import { ApiError } from "../utils/apiError.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";

function sanitizeUser(user) {
  const object = user.toObject();
  delete object.passwordHash;
  return object;
}

export async function registerUser(payload) {
  const existingUser = await User.findOne({
    $or: [{ email: payload.email }, { phone: payload.phone }]
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists with this email or phone");
  }

  const user = await User.create({
    ...payload,
    passwordHash: await hashPassword(payload.password),
    payoutMethod: payload.payoutMethod || {}
  });

  if (user.role === "worker") {
    await WorkerProfile.create({
      workerId: user._id
    });
  }

  const token = signToken({
    sub: user._id.toString(),
    role: user.role,
    name: user.name
  });

  return {
    user: sanitizeUser(user),
    token
  };
}

export async function loginUser(payload) {
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const passwordValid = await comparePassword(payload.password, user.passwordHash);

  if (!passwordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken({
    sub: user._id.toString(),
    role: user.role,
    name: user.name
  });

  return {
    user: sanitizeUser(user),
    token
  };
}

export async function getCurrentUser(userId) {
  const user = await User.findById(userId).lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  delete user.passwordHash;
  return user;
}

