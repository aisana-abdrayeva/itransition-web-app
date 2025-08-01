const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authGuard = require('../middleware/authGuard'); 

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", authGuard, async (_:any, res:any) => {
    try {
    const users = await prisma.user.findMany({
        select: {
        id: true,
        name: true,
        email: true,
        lastLogin: true,
        status: true,
        },
        orderBy: { lastLogin: 'desc' },
    });

    res.json(users);
    } catch (error) {
    res.status(500).json({ error: "Could not fetch users" });
    }
});

module.exports = router;