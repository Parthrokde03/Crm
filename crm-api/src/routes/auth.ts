import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';
import { logAudit } from '../lib/audit.js';

export const authRouter = Router();

// Login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { role: true },
    });

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ message: 'Account is inactive', code: 'INACTIVE' });
      return;
    }

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    logAudit({ userId: user.id, action: 'login', module: 'auth', entityId: user.id });

    const { password: _, ...safeUser } = user;
    res.json({
      user: safeUser,
      tokens: {
        accessToken: signAccessToken(user.id),
        refreshToken: signRefreshToken(user.id),
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error', code: 'SERVER_ERROR' });
  }
});

// Refresh token
authRouter.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(401).json({ message: 'No refresh token', code: 'NO_TOKEN' });
      return;
    }

    const { userId } = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isActive) {
      res.status(401).json({ message: 'Invalid token', code: 'INVALID_TOKEN' });
      return;
    }

    res.json({
      accessToken: signAccessToken(userId),
      refreshToken: signRefreshToken(userId),
    });
  } catch {
    res.status(401).json({ message: 'Invalid refresh token', code: 'INVALID_TOKEN' });
  }
});

// Get current user
authRouter.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { role: true },
    });
    if (!user) {
      res.status(404).json({ message: 'User not found', code: 'NOT_FOUND' });
      return;
    }
    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ message: 'Internal server error', code: 'SERVER_ERROR' });
  }
});

// Change password
authRouter.post('/change-password', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      res.status(404).json({ message: 'User not found', code: 'NOT_FOUND' });
      return;
    }

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      res.status(400).json({ message: 'Current password is incorrect', code: 'WRONG_PASSWORD' });
      return;
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Internal server error', code: 'SERVER_ERROR' });
  }
});

// Forgot password (stub — in production, send email)
authRouter.post('/forgot-password', async (_req, res) => {
  res.json({ message: 'If the email exists, a reset link has been sent.' });
});
