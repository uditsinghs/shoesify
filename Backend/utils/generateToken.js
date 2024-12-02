export const generateToken = (res, user, message, statusCode) => {
  const token = user.generateJWTToken();

  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      message,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
};
