import User from "../models/User.js";
import Complaint from "../models/Complaint.js";
import bcrypt from "bcryptjs";
import Hostel from "../models/Hostel.js";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenGenerator.js";

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    console.log("hii from change pass");
    const { email, oldPassword, newPassword } = req.body;
    console.log("hii after change pass");

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isPasswordMatched = await bcrypt.compare(
      oldPassword,
      existingUser.password,
    );

    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Wrong old password",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    existingUser.password = hashedPassword;
    await existingUser.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while changing password",
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return res.json({
      accessToken,
      user,
    });
  } catch {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const createSupervisor = async (req, res) => {
  try {
    const { name, email, phone, password, hostelName } = req.body;

    if (!name || !email || !phone || !password || !hostelName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hostel = await Hostel.findOne({ name: hostelName });
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const supervisor = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "Supervisor",
      supervisorOfHostel: hostel._id,
    });

    // Update hostel to link supervisor
    hostel.supervisor = supervisor._id;
    await hostel.save();

    res.status(201).json({
      message: "Supervisor created successfully",
      supervisor: {
        id: supervisor._id,
        name: supervisor.name,
        email: supervisor.email,
        hostel: hostel.name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createHostel = async (req, res) => {
  try {
    const { name, capacity } = req.body;

    if (!name || !capacity) {
      return res
        .status(400)
        .json({ message: "Name and capacity are required" });
    }

    const existingHostel = await Hostel.findOne({ name });
    if (existingHostel) {
      return res.status(400).json({ message: "Hostel already exists" });
    }

    const hostel = await Hostel.create({
      name,
      capacity,
    });

    res.status(201).json({
      message: "Hostel created successfully",
      hostel: {
        id: hostel._id,
        name: hostel.name,
        capacity: hostel.capacity,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.sendStatus(204);

    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Logout failed" });
  }
};
