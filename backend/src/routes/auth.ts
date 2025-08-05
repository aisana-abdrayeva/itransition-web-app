const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient, UserStatus } = require('@prisma/client');
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req: any, res: any) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        status: UserStatus.ACTIVE,
      },
    });

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 60 * 60 * 1000
    });

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        status: newUser.status
      }
    });

  } catch (error: any) {
    if (
      error.code === "P2002" &&
      error.meta?.target?.includes("email")
    ) {
      return res.status(409).json({ error: "User with this email already exists" });
    }

    console.error("Unexpected error during registration:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/login", async (req:any, res:any) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.status === UserStatus.BLOCKED) {
    return res.status(403).json({ error: "User not found or blocked" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid password" });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: true, 
    sameSite: "None", 
    maxAge: 60 * 60 * 1000 
  });

  res.status(200).json({ 
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status
    }
  });
});

module.exports = router;