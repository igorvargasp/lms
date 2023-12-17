import { Response } from "express";

// get user by id

import userModel from "../models/user.model";

export const getUserById = async (id: string, res: Response) => {
  const user = await userModel.findById(id);
  return res.status(200).json({
    success: true,
    user,
  });
};
