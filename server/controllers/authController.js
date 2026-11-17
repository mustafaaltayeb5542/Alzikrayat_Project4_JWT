import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function createToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "2h", issuer: "alzikrayat-api" }
  );
}
function publicUser(user) {
  return { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email };
}

export async function register(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (![firstName, lastName, email, password].every(v => typeof v === "string" && v.trim())) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters." });
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({ message: "This email is already registered." });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      firstName: firstName.trim(), lastName: lastName.trim(),
      email: normalizedEmail, password: hashedPassword
    });
    return res.status(201).json({ message: "Account created.", token: createToken(user), user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ message: "Could not create account." });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required." });
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }
    return res.json({ message: "Login successful.", token: createToken(user), user: publicUser(user) });
  } catch {
    return res.status(500).json({ message: "Login failed." });
  }
}

export async function me(req, res) {
  res.json({ user: publicUser(req.user) });
}
