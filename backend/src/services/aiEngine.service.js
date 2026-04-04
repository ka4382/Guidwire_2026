import axios from "axios";

import { env } from "../config/env.js";

const client = axios.create({
  baseURL: env.aiEngineUrl,
  timeout: 10000
});

export async function callAi(path, payload, fallback) {
  try {
    const response = await client.post(path, payload);
    return response.data;
  } catch (error) {
    if (fallback) {
      return fallback();
    }

    throw error;
  }
}

export async function getDisruption(path, params, fallback) {
  try {
    const response = await client.get(path, { params });
    return response.data;
  } catch (error) {
    if (fallback) {
      return fallback();
    }

    throw error;
  }
}

