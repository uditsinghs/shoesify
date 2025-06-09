export const generateToken = (res, user, message, statusCode) => {
  const token = user.generateJWTToken();
  res
    .status(statusCode)
     .cookie("token", token, {
      httpOnly: true,             
      secure: process.env.NODE_ENV === "production", 
      sameSite: "Strict",        
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      message,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
};
