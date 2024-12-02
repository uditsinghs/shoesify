import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: No token provided.",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized: Invalid token.",
      success: false,
    });
  }
};

export const isAuthorized = (requiredRole) => {
  return (req, res, next) => {
    try {
  
      if (req.user.role !== requiredRole) {
        return res.status(403).json({
          message: "You are not authorized to access this resource.",
          success: false,
        });
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server error.",
        success: false,
        error: error.message,
      });
    }
  };
};

