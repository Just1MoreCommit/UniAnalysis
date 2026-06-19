const { db } = require('../../../lib/db');
const { initSchema } = require('../../../lib/schema');
const { seedUniversities } = require('../../../lib/seed');

// Ensure schema and seed data are present
initSchema();
seedUniversities();

export async function GET() {
  try {
    const stmt = db.prepare('SELECT * FROM universities ORDER BY name');
    const universities = stmt.all();

    return new Response(JSON.stringify({ universities }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const stmt = db.prepare(`
      INSERT INTO universities (name, abbreviation, website_url, logo_url, scrape_url)
      VALUES (@name, @abbreviation, @website_url, @logo_url, @scrape_url)
    `);

    const result = stmt.run({
      name: body.name,
      abbreviation: body.abbreviation,
      website_url: body.website_url || '',
      logo_url: body.logo_url || '',
      scrape_url: body.scrape_url || '',
    });

    const university = db.prepare('SELECT * FROM universities WHERE id = ?').get(result.lastInsertRowid);

    return new Response(JSON.stringify({ university, id: result.lastInsertRowid }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
