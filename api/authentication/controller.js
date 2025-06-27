const _ = require("lodash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../../lib/schema/users.schema");
const { sendResponse, errReturned } = require("../../lib/utils/dto");
const { EResponseCode } = require("../../lib/utils/enum");
const {
  userRegisterSchemaValidator,
  userLoginSchemaValidator,
} = require("../../lib/utils/sanitization");

dotenv.config();

exports.login = async (req, res) => {
  try {
    const { error, value } = userLoginSchemaValidator.validate(req.body);
    if (error) return errReturned(res, error.message);

    const { email, password,  } = value;

    const user = await User.findOne({ email });
    if (!user || user.status === "INACTIVE" || user.isDeleted)
      return errReturned(res, "Invalid login attempt.");

    // if (isMobile !== "true" && isMobile !== "false")
    //   return errReturned(res, "Invalid login attempt.");

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return errReturned(res, "Invalid login attempt.");

    const response = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      cnic: user.cnic,
      phone: user.contact,
      role: user.role,
      needsPasswordReset: user.isFirstLogin !== false,
      territory: user.territory,
      type: user.siteType,
    };

    const token = jwt.sign(response, process.env.TOKEN_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    setTimeout(() => {
      res.header("auth-token", token).json({ token, user: response });
    }, 1000);
  } catch (error) {
    return errReturned(res, "Invalid login attempt.");
  }
};

exports.logout = async (req, res) => {
  try {
    res.setHeader("auth-token", "");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return errReturned(res, error);
  }
};

exports.register = async (req, res) => {
  try {
    
    // Validate input against Joi schema
    const { error, value } = userRegisterSchemaValidator.validate(req.body);

    if (error) return errReturned(res, error.message);

    const { email, password } = value;

    // Check if the user already exists
    const emailExist = await User.findOne({ email });
    if (emailExist) return errReturned(res, "Email already exists");

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    value.password = await bcrypt.hash(password, salt);

    // Save the user
    const newUser = new User(value);
    await newUser.save();

    return sendResponse(
      res,
      EResponseCode.SUCCESS,
      "Registration successful. Please check your email for verification!",
      newUser
    );
  } catch (error) {
    return errReturned(res, error);
  }
};



exports.resetPassword = async (req, res) => {
  try {
    const token = req.header("auth-token");
    const newPassword = req.body.password;

    if (!token || !newPassword)
      return res.json({ success: false, error: "Token and password must be provided." });

    const verify = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(verify.id);

    if (!user) return res.json({ success: false, error: "User not found!" });

    user.password = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
    user.user_token = "";
    await user.save();

    return res.json({ success: true, message: "Password reset successfully." });
  } catch (err) {
    return res.json({ success: false, error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) return res.json({ success: false, message: "Email is required." });

    const user = await User.findOne({ email });
    if (!user) return sendResponse(res, EResponseCode.NOTFOUND, "Email not found.");

    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, { expiresIn: 150 * 60 });
    return sendResponse(res, EResponseCode.SUCCESS, "Please check your email");
  } catch (error) {
    return errReturned(res, error.message);
  }
};

exports.verify = async (req, res) => {
  try {
    return sendResponse(res, EResponseCode.SUCCESS);
  } catch (error) {
    return res.status(400).json({ message: "Invalid token." });
  }
};

exports.verfiyEmail = async (req, res) => {
  try {
    const token = req.header("auth-token");
    if (!token) return res.json({ success: false, error: "Token is required" });

    const verify = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(verify.id);

    if (!user) return res.json({ success: false, error: "User not found!" });

    user.emailVerified = true;
    await user.save();

    return res.json({ success: true, message: "Email successfully verified." });
  } catch (err) {
    return res.json({ success: false, error: err.message });
  }
};
