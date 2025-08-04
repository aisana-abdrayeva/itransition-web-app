const express = require('express');
const { PrismaClient, UserStatus } = require('@prisma/client');
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

router.post("/:userId/block", authGuard, async (req:any, res:any) => {
    try {
        const { userId } = req.params;
        const user = await prisma.user.findUnique({ 
            where: { id: parseInt(userId) } 
        });
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { status: UserStatus.BLOCKED }
        });
        
        res.json({ message: "User blocked successfully" });
    } catch (error) {
        console.error("Error blocking user:", error);
        res.status(500).json({ error: "Could not block user" });
    }
});

router.post("/:userId/unblock", authGuard, async (req:any, res:any) => {
    try {
        const { userId } = req.params;
        
        const user = await prisma.user.findUnique({ 
            where: { id: parseInt(userId) } 
        });
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { status: UserStatus.ACTIVE }
        });
        
        res.json({ message: "User unblocked successfully" });
    } catch (error) {
        console.error("Error unblocking user:", error);
        res.status(500).json({ error: "Could not unblock user" });
    }
});

router.delete("/:userId", authGuard, async (req:any, res:any) => {
    try {
        const { userId } = req.params;
        
        const user = await prisma.user.findUnique({ 
            where: { id: parseInt(userId) } 
        });
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        await prisma.user.delete({
            where: { id: parseInt(userId) }
        });
        
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Could not delete user" });
    }
});

module.exports = router;