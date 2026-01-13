import fs from 'fs-extra';
import path from 'path';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();
const REPO_URL = 'https://github.com/liquidslr/leetcode-company-wise-problems.git';
const TEMP_DIR = path.join(__dirname, '../temp_data');

async function main() {
  console.log('Starting ingestion pipeline...');

  // 1. Clone Repo
  if (fs.existsSync(TEMP_DIR)) {
    console.log('Cleaning up old temp data...');
    try {
      fs.removeSync(TEMP_DIR);
    } catch (e) {
      console.warn('Failed to remove temp dir, might be locked. Continuing if possible...');
    }
  }

  console.log(`Cloning repository from ${REPO_URL} into ${TEMP_DIR}...`);
  try {
    execSync(`git clone ${REPO_URL} "${TEMP_DIR}"`, { stdio: 'inherit' });
  } catch (e) {
    console.error('Failed to clone repository. Check internet connection or git installation.');
    process.exit(1);
  }

  // 2. Walk directories
  const items = fs.readdirSync(TEMP_DIR);

  console.log(`Scanning ${items.length} items in root...`);

  for (const item of items) {
    const itemPath = path.join(TEMP_DIR, item);
    // basic check to fail gracefully if stats fails
    let stats;
    try {
      stats = fs.statSync(itemPath);
    } catch (e) { continue; }

    if (stats.isDirectory() && !item.startsWith('.')) {
      const csvPath = path.join(itemPath, '5. All.csv');
      // Case sensitive check? Windows is case insensitive, but file might be named slightly differently? User said All.csv
      // Let's check for case-insensitive match if All.csv not found strictly? 
      // Nah, let's stick to spec.

      console.log(`Checking: ${csvPath}`);
      if (fs.existsSync(csvPath)) {
        console.log(`Found CSV for ${item}`);
        await processCompany(item, csvPath);
      } else {
        const altPath = path.join(itemPath, 'All.csv');
        if (fs.existsSync(altPath)) {
          console.log(`Found All.csv for ${item}`);
          await processCompany(item, altPath);
        } else {
          // Try reading dir to see what's in there
          try {
            const files = fs.readdirSync(itemPath);
            console.log(`No CSV found in ${item}. Files: ${files.slice(0, 3).join(', ')}...`);
          } catch (e) { }
        }
      }
    }
  }

  console.log('Ingestion complete!');

  // Cleanup
  console.log('Cleaning up...');
  try {
    fs.removeSync(TEMP_DIR);
  } catch (e) { }
}

async function processCompany(companyName: string, csvPath: string) {
  // Create Company
  const company = await prisma.company.upsert({
    where: { name: companyName },
    update: {},
    create: {
      name: companyName,
      slug: companyName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    },
  });

  const questions: any[] = [];

  // Parse CSV
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row: any) => {
        const cleanRow = Object.keys(row).reduce((acc: any, key) => {
          acc[key.trim()] = row[key];
          return acc;
        }, {});

        // User Mapping: Question, Frequency, Link, Topic
        // Headers in CSV might be different, e.g. "Problem Name", "Leetcode Link". 
        // But user strictly specified: "Column Meaning: Question, Frequency, Link, Topic".
        // I will look for these keys.

        // Headers: Difficulty,Title,Frequency,Acceptance Rate,Link,Topics
        const title = cleanRow['Title'] || cleanRow['Question'] || cleanRow['Problem Name'];
        const link = cleanRow['Link'] || cleanRow['Leetcode Link'] || cleanRow['URL'];

        if (title && link) {
          console.log(`  - Found Question: ${title}`);
          questions.push({
            title: title,
            frequency: cleanRow['Frequency'] || 'Unknown',
            leetcodeUrl: link,
            topic: cleanRow['Topics'] || cleanRow['Topic'] || 'Uncategorized',
            companyId: company.id
          });
        } else {
          // console.log('Skipping row', cleanRow);
        }
      })
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
  });

  if (questions.length === 0) return;

  console.log(`Processing ${companyName}: ${questions.length} questions.`);

  let added = 0;
  // Batch upsert? Prisma doesn't support batch upsert easily.
  // Sequential upsert is fine for this scale (hundreds of companies * hundreds of questions = ~10k-50k rows).
  // Might be slow but safe.

  for (const q of questions) {
    await prisma.question.upsert({
      where: {
        companyId_title: {
          companyId: q.companyId,
          title: q.title
        }
      },
      update: {
        frequency: q.frequency,
        topic: q.topic,
        leetcodeUrl: q.leetcodeUrl
      },
      create: q
    });
    added++;
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
