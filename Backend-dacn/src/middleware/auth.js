import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authorization = req.get('authorization') || '';
  const [scheme, token] = authorization.trim().split(/\s+/);

  if (!token || scheme.toLowerCase() !== 'bearer') {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const secret = process.env.JWT_SECRET?.trim();
    if (!secret) {
      console.error('JWT_SECRET is not configured');
      return res.status(500).json({ message: 'Authentication is not configured' });
    }

    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError'
      ? 'Token expired'
      : 'Invalid token';
    return res.status(401).json({ message });
  }
};

export const verifyRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};
