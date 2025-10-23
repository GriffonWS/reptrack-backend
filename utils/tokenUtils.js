import User from "../models/user.model.js";

export const extractUserIdFromToken = async (token) => {
  const user = await User.findOne({ where: { token } });
  if (!user) throw new Error("User not authorized");
  return user.id;
};
