const { db } = require('./db');

const universities = [
  { name: 'National University of Sciences & Technology', abbreviation: 'NUST', website_url: 'https://nust.edu.pk', admissions_url: 'https://ugadmissions.nust.edu.pk', logo_url: '', scrape_url: '' },
  { name: 'Lahore University of Management Sciences', abbreviation: 'LUMS', website_url: 'https://lums.edu.pk', admissions_url: 'https://admissions.lums.edu.pk', logo_url: '', scrape_url: '' },
  { name: 'FAST-NUCES', abbreviation: 'FAST', website_url: 'https://nu.edu.pk', admissions_url: 'https://admissions.nu.edu.pk', logo_url: '', scrape_url: '' },
  { name: 'Aga Khan University', abbreviation: 'AKU', website_url: 'https://aku.edu', admissions_url: 'https://aku.edu/admissions', logo_url: '', scrape_url: '' },
  { name: 'Quaid-i-Azam University', abbreviation: 'QAU', website_url: 'https://qau.edu.pk', admissions_url: 'https://qau.edu.pk', logo_url: '', scrape_url: '' },
  { name: 'University of Engineering & Technology Lahore', abbreviation: 'UET', website_url: 'https://uet.edu.pk', admissions_url: 'https://uet.edu.pk', logo_url: '', scrape_url: '' },
  { name: 'COMSATS University', abbreviation: 'COMSATS', website_url: 'https://comsats.edu.pk', admissions_url: 'https://comsats.edu.pk', logo_url: '', scrape_url: '' },
  { name: 'University of Punjab', abbreviation: 'PU', website_url: 'https://pu.edu.pk', admissions_url: 'https://pu.edu.pk', logo_url: '', scrape_url: '' },
  { name: 'Ghulam Ishaq Khan Institute', abbreviation: 'GIKI', website_url: 'https://giki.edu.pk', admissions_url: 'https://giki.edu.pk', logo_url: '', scrape_url: '' },
  { name: 'NED University', abbreviation: 'NED', website_url: 'https://neduet.edu.pk', admissions_url: 'https://neduet.edu.pk', logo_url: '', scrape_url: '' },
  { name: 'University of Karachi', abbreviation: 'KU', website_url: 'https://uok.edu.pk', admissions_url: 'https://uok.edu.pk', logo_url: '', scrape_url: '' },
  { name: 'Bahria University', abbreviation: 'BU', website_url: 'https://bahria.edu.pk', admissions_url: 'https://bahria.edu.pk', logo_url: '', scrape_url: '' },
  { name: 'Air University', abbreviation: 'AU', website_url: 'https://au.edu.pk', admissions_url: 'https://au.edu.pk', logo_url: '', scrape_url: '' },
  { name: 'Institute of Business Administration', abbreviation: 'IBA', website_url: 'https://iba.edu.pk', admissions_url: 'https://iba.edu.pk', logo_url: '', scrape_url: '' },
  { name: 'University of Peshawar', abbreviation: 'UoP', website_url: 'https://uop.edu.pk', admissions_url: 'https://uop.edu.pk', logo_url: '', scrape_url: '' },
  { name: 'University of Health Sciences', abbreviation: 'UHS', website_url: 'https://uhs.edu.pk', admissions_url: 'https://uhs.edu.pk', logo_url: '', scrape_url: '' },
  { name: 'Dow University of Health Sciences', abbreviation: 'DUHS', website_url: 'https://duhs.edu.pk', admissions_url: 'https://duhs.edu.pk', logo_url: '', scrape_url: '' },
  { name: 'King Edward Medical University', abbreviation: 'KEMU', website_url: 'https://kemu.edu.pk', admissions_url: 'https://kemu.edu.pk', logo_url: '', scrape_url: '' },
  { name: 'Allama Iqbal Open University', abbreviation: 'AIOU', website_url: 'https://aiou.edu.pk', admissions_url: 'https://aiou.edu.pk', logo_url: '', scrape_url: '' },
  { name: 'PIEAS', abbreviation: 'PIEAS', website_url: 'https://pieas.edu.pk', admissions_url: 'https://pieas.edu.pk', logo_url: '', scrape_url: '' },
  { name: 'IST Islamabad', abbreviation: 'IST', website_url: 'https://ist.edu.pk', admissions_url: 'https://ist.edu.pk', logo_url: '', scrape_url: '' },
  { name: 'Habib University', abbreviation: 'HU', website_url: 'https://habib.edu.pk', admissions_url: 'https://habib.edu.pk', logo_url: '', scrape_url: '' },
  { name: 'SZABIST', abbreviation: 'SZABIST', website_url: 'https://szabist.edu.pk', admissions_url: 'https://szabist.edu.pk', logo_url: '', scrape_url: '' },
  { name: 'University of Lahore', abbreviation: 'UoL', website_url: 'https://uol.edu.pk', admissions_url: 'https://uol.edu.pk', logo_url: '', scrape_url: '' },
  { name: 'Mehran University', abbreviation: 'MUET', website_url: 'https://muet.edu.pk', admissions_url: 'https://muet.edu.pk', logo_url: '', scrape_url: '' },
];

function seedUniversities() {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO universities (name, abbreviation, website_url, admissions_url, logo_url, scrape_url)
    VALUES (@name, @abbreviation, @website_url, @admissions_url, @logo_url, @scrape_url)
  `);

  const insertMany = db.transaction((rows) => {
    for (const row of rows) {
      insert.run(row);
    }
  });

  insertMany(universities);
  console.log(`Seeded ${universities.length} universities.`);
}

module.exports = { seedUniversities };
