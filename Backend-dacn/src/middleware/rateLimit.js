const requests = new Map();

export const rateLimit = ({ windowMs = 60_000, max = 30, key = (req) => req.ip }) => (req, res, next) => {
  const now = Date.now();
  const requestKey = key(req);
  const current = requests.get(requestKey);

  if (!current || current.expiresAt <= now) {
    requests.set(requestKey, { count: 1, expiresAt: now + windowMs });
    return next();
  }

  if (current.count >= max) {
    return res.status(429).json({ message: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.' });
  }

  current.count += 1;
  return next();
};
