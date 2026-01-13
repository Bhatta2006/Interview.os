import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all companies with user progress and advanced filtering
router.get('/', async (req, res) => {
  const userId = req.headers['x-user-id'] as string; // Optional user ID from frontend (or verify token)
  const { type = 'company', query = '' } = req.query; // 'company' | 'topic' | 'question'
  const filter = query as string;

  // NOTE: For better security, we should ideally use the token. 
  // But for now, we rely on the header or we can parse the token manually if header isn't reliable enough.
  // The frontend interceptor sends x-user-id.

  try {
    const where: any = {};

    if (filter) {
      if (type === 'company') {
        where.name = { contains: filter, mode: 'insensitive' };
      } else if (type === 'topic') {
        where.questions = { some: { topic: { contains: filter, mode: 'insensitive' } } };
      } else if (type === 'question') {
        where.questions = { some: { title: { contains: filter, mode: 'insensitive' } } };
      }
    }

    const companies = await prisma.company.findMany({
      where,
      include: {
        _count: {
          select: { questions: true }
        },
        questions: userId ? {
          where: {
            progress: {
              some: {
                userId: userId,
                status: 'DONE'
              }
            }
          },
          select: { id: true }
        } : false // Don't fetch questions if no user
      },
      orderBy: { name: 'asc' }
    });

    // Transform to add solvedCount
    const response = companies.map(c => ({
      ...c,
      solvedCount: c.questions ? c.questions.length : 0,
      questions: undefined // Remove the heavy questions array from list view
    }));

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Get company details with questions
router.get('/:id', async (req, res) => {
  const { id } = req.params; // Expects ID or Slug?
  const userId = req.headers['x-user-id'] as string;
  // Let's support both or just ID. User might use slug in frontend URL.
  // I defined slug in schema. Let's try to find by ID, if fail then slug?
  // Or just separate endpoints.
  // For simplicity, I'll use ID. Frontend will pass ID.

  try {
    const company = await prisma.company.findFirst({
      where: {
        OR: [
          { id: id },
          { slug: id }
        ]
      },
      include: {
        questions: {
          // Optional: Include user status?
          // This requires user ID.
          // If I implement auth middleware, I can include it.
          orderBy: { title: 'asc' },
          include: {
            progress: {
              where: { userId: userId || 'invalid-id' }
            }
          }
        }
      }
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

export default router;
