// Task 5
import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: 'No token' });
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains id, name, role
    next();
  } catch (err) {
    res.status(401).json({ message: 'Not authorized' });
  }
};
