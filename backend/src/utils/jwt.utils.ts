import JWT from "jsonwebtoken";

interface JwtPayload {
  id: string;
}

export const generateToken = (userId: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  return JWT.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const verifyToken = (token: string): JwtPayload => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  const decoded = JWT.verify(token, process.env.JWT_SECRET) as JwtPayload;
  return decoded;
};
