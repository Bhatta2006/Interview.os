import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
const CRON_SECRET = process.env.CRON_SECRET;

// Middleware to secure Cron jobs
const verifyCron = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!CRON_SECRET) {
    console.warn('CRON_SECRET is not set! Skipping verification (Unsafe).');
    return next();
  }
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized Cron Request' });
  }
  next();
};

// DAILY STREAK UPDATER
router.get('/daily-streak', verifyCron, async (req, res) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    // Find users who haven't been active since yesterday (streak broken)
    // Note: This logic is simple. A robust system uses an Event Source or Job Queue.
    // For now, we reset streaks for anyone whose 'lastActive' is older than 48 hours?
    // Actually, streak logic is usually: if you didn't solve anything yesterday, your streak resets.

    // Simplification for MVP: We rely on the "Solve" action to update streak. 
    // This cron is just for cleanup or stats.

    // Let's make it useful: "Reset streaks"
    // Update User set currentStreak = 0 where lastActive < yesterday

    const result = await prisma.user.updateMany({
      where: {
        lastActive: {
          lt: yesterday
        },
        currentStreak: {
          gt: 0
        }
      },
      data: {
        currentStreak: 0
      }
    });

    console.log(`[CRON] Reset streaks for ${result.count} users.`);
    res.json({ success: true, resetCount: result.count });
  } catch (error) {
    console.error('[CRON] Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
