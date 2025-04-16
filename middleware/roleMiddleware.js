const permit = (...allowedRoles) => {
  return (req, res, next) => {
    // 1. Check if user exists (should be set by protect middleware)
    if (!req.user) {
      return res.status(403).json({ 
        success: false,
        error: 'User not authenticated' 
      });
    }

    // 2. Check if user has required role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        error: `Access denied. Required roles: ${allowedRoles.join(', ')}` 
      });
    }

    next();
  };
};

module.exports = permit;