import { Router } from 'express';
import { PrismaClient, Status } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get User ID from Token (via Middleware)
const getUserId = (req: any) => {
  return req.user?.userId || req.headers['x-user-id']; // Fallback for backward compat if needed, or strict
};

// Update Question Status (Protected)
router.post('/progress', authenticateToken, async (req: any, res) => {
  const userId = getUserId(req);
  const { questionId, status } = req.body;

  if (!userId || !questionId || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Ensure User Exists (Mock Auth lazy creation)
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: 'demo@solveit.com',
        name: 'Demo User'
      }
    });

    // Upsert Progress
    const progress = await prisma.progress.upsert({
      where: {
        userId_questionId: {
          userId,
          questionId
        }
      },
      update: {
        status: status as Status,
        solvedAt: status === 'DONE' ? new Date() : undefined
      },
      create: {
        userId,
        questionId,
        status: status as Status,
        solvedAt: status === 'DONE' ? new Date() : undefined
      }
    });

    // Update Streak if DONE
    if (status === 'DONE') {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if already logged today
        const log = await prisma.streakLog.findUnique({
          where: {
            userId_date: {
              userId,
              date: today
            }
          }
        });

        if (!log) {
          // New day activity
          let newStreak = 1;

          if (user.lastActive) {
            const lastActiveDate = new Date(user.lastActive);
            lastActiveDate.setHours(0, 0, 0, 0);

            const diffTime = Math.abs(today.getTime() - lastActiveDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
              // Consecutive day
              newStreak = user.currentStreak + 1;
            } else if (diffDays === 0) {
              // Same day (should be caught by log check, but safe fallback)
              newStreak = user.currentStreak;
            } else {
              // Missed a day or more
              newStreak = 1;
            }
          }

          await prisma.user.update({
            where: { id: userId },
            data: {
              currentStreak: newStreak,
              longestStreak: Math.max(newStreak, user.longestStreak),
              lastActive: new Date()
            }
          });

          await prisma.streakLog.create({
            data: {
              userId,
              date: today
            }
          });
        }
      }
    }

    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Get User Dashboard Stats
router.get('/stats', authenticateToken, async (req: any, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        progress: {
          where: {
            OR: [
              { status: 'DONE' },
              { status: 'REVISING' }
            ]
          },
          include: { question: true }
        }
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Lazy Streak Recalculation
    let currentStreak = user.currentStreak;
    if (user.lastActive) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastActiveDate = new Date(user.lastActive);
      lastActiveDate.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - lastActiveDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 1) {
        currentStreak = 0;
      }
    }

    const doneQuestions = user.progress.filter(p => p.status === 'DONE');
    const revisingQuestions = user.progress.filter(p => p.status === 'REVISING');

    const totalSolved = doneQuestions.length;

    // Topic Mastery
    const topicCounts: Record<string, number> = {};
    doneQuestions.forEach(p => {
      const topic = p.question.topic || 'Uncategorized';
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });

    const topicMastery = Object.entries(topicCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 topics

    res.json({
      currentStreak,
      longestStreak: user.longestStreak,
      totalSolved,
      topicMastery,
      revisingQuestions: revisingQuestions.map(p => p.question)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
