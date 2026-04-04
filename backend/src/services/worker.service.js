import { User } from "../models/User.js";
import { WorkerProfile } from "../models/WorkerProfile.js";
import { ApiError } from "../utils/apiError.js";
import { getWorkerActivityForUser } from "./mockProvider.service.js";

export async function getWorker(workerId) {
  const [user, profile] = await Promise.all([
    User.findById(workerId).lean(),
    WorkerProfile.findOne({ workerId }).lean()
  ]);

  if (!user) {
    throw new ApiError(404, "Worker not found");
  }

  delete user.passwordHash;

  return {
    ...user,
    profile
  };
}

export async function updateWorker(workerId, payload) {
  const user = await User.findById(workerId);

  if (!user) {
    throw new ApiError(404, "Worker not found");
  }

  const profile = await WorkerProfile.findOneAndUpdate(
    { workerId },
    {
      $set: {
        vehicleType: payload.vehicleType,
        avgWeeklyEarnings: payload.avgWeeklyEarnings,
        avgDailyHours: payload.avgDailyHours,
        preferredShift: payload.preferredShift,
        activityScore: payload.activityScore
      }
    },
    {
      new: true,
      upsert: true
    }
  );

  ["name", "phone", "city", "assignedZone", "darkStoreId", "payoutMethod"].forEach((field) => {
    if (payload[field] !== undefined) {
      user[field] = payload[field];
    }
  });

  await user.save();

  const userObject = user.toObject();
  delete userObject.passwordHash;

  return {
    ...userObject,
    profile
  };
}

export async function getWorkerActivity(workerId) {
  const user = await User.findById(workerId).lean();

  if (!user) {
    throw new ApiError(404, "Worker not found");
  }

  return {
    workerId,
    zone: user.assignedZone,
    darkStoreId: user.darkStoreId,
    liveActivity: getWorkerActivityForUser(user)
  };
}

