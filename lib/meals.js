import sql from 'better-sqlite3';
import fs from 'node:fs';
import slugify from 'slugify';
import xss from 'xss';

const db = sql('meals.db');

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay to simulate async
  return db.prepare('SELECT * FROM meals').all();
}


export async function getMeal(slug) {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay to simulate async
  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split('.').pop();
  const fileName = `${meal.slug}.${extension}`;
  const filePath = `public/images/${fileName}`;

  // Create images directory if it doesn't exist
  if (!fs.existsSync('public/images')) {
    fs.mkdirSync('public/images', { recursive: true });
  }

  const bufferedImage = await meal.image.arrayBuffer();
  await fs.promises.writeFile(filePath, Buffer.from(bufferedImage));

  meal.image = `/images/${fileName}`;

  db.prepare(`
    INSERT INTO meals 
    (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (
      @title,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @image,
      @slug
    )
  `).run(meal);
}

