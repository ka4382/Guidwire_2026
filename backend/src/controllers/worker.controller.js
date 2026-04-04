import { asyncHandler } from "../utils/asyncHandler.js";
import { getWorker, getWorkerActivity, updateWorker } from "../services/worker.service.js";

export const getWorkerById = asyncHandler(async (req, res) => {
  const data = await getWorker(req.params.id);
  res.json({ success: true, data });
});

export const updateWorkerById = asyncHandler(async (req, res) => {
  const data = await updateWorker(req.params.id, req.body);
  res.json({ success: true, data });
});

export const getWorkerActivityById = asyncHandler(async (req, res) => {
  const data = await getWorkerActivity(req.params.id);
  res.json({ success: true, data });
});

