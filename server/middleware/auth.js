import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'resumebuilder_secret_jwt_key_2026_xyz';

export const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please log in.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, name }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token expired or invalid. Please log in again.'
    });
  }
};
