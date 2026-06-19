export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'all';
  const universityId = searchParams.get('university_id') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const sort = searchParams.get('sort') || 'newest';

  const MOCK_NEWS = [
    { id: 1, university_id: 1, title: 'NUST NET 2025 Registration Opens', description: 'Registration for the NUST Entrance Test (NET) 2025 is now open for all undergraduate programs. Last date to apply is June 15, 2025.', source_url: 'https://nust.edu.pk', category: 'test_updates', published_at: '2026-05-10T10:00:00Z', university_name: 'National University of Sciences & Technology', university_abbreviation: 'NUST' },
    { id: 2, university_id: 2, title: 'LUMS LCAT Test Pattern Changed', description: 'LUMS has announced changes to the LCAT test pattern for the 2025 admissions cycle. The quantitative section will now include data interpretation questions.', source_url: 'https://lums.edu.pk', category: 'test_updates', published_at: '2026-05-09T14:30:00Z', university_name: 'Lahore University of Management Sciences', university_abbreviation: 'LUMS' },
    { id: 3, university_id: 3, title: 'FAST-NUCES Admissions Open for Fall 2025', description: 'Online admissions for undergraduate and graduate programs at all FAST campuses are now open. Apply before the deadline to secure your seat.', source_url: 'https://nu.edu.pk', category: 'admissions', published_at: '2026-05-08T09:15:00Z', university_name: 'FAST-NUCES', university_abbreviation: 'FAST' },
    { id: 4, university_id: 4, title: 'AKU MBBS Admission Criteria Updated', description: 'Aga Khan University has updated its MBBS admission criteria for 2025. Minimum 70% in FSc pre-medical is now required along with AKU test clearance.', source_url: 'https://aku.edu', category: 'admissions', published_at: '2026-05-07T11:00:00Z', university_name: 'Aga Khan University', university_abbreviation: 'AKU' },
    { id: 5, university_id: 5, title: 'QAU Merit List 2025 Announced', description: 'Quaid-i-Azam University has published the first merit list for BS programs for the academic year 2025. Check your status online using your CNIC.', source_url: 'https://qau.edu.pk', category: 'results', published_at: '2026-05-06T08:45:00Z', university_name: 'Quaid-i-Azam University', university_abbreviation: 'QAU' },
    { id: 6, university_id: 6, title: 'UET ECAT Registration Deadline Extended', description: 'Due to technical issues, UET has extended the ECAT registration deadline by one week. New last date is May 25, 2025.', source_url: 'https://uet.edu.pk', category: 'test_updates', published_at: '2026-05-05T16:20:00Z', university_name: 'University of Engineering & Technology Lahore', university_abbreviation: 'UET' },
    { id: 7, university_id: 7, title: 'COMSATS New Scholarship Program for Engineering', description: 'COMSATS University has launched a merit-based scholarship program covering 100% tuition for top 10 ECAT scorers in each campus.', source_url: 'https://comsats.edu.pk', category: 'scholarships', published_at: '2026-05-04T10:30:00Z', university_name: 'COMSATS University', university_abbreviation: 'COMSATS' },
    { id: 8, university_id: 8, title: 'PU MDCAT Preparation Workshop', description: 'University of Punjab is organizing a free MDCAT preparation workshop for FSc students at its main campus on May 20, 2025.', source_url: 'https://pu.edu.pk', category: 'general', published_at: '2026-05-03T13:00:00Z', university_name: 'University of Punjab', university_abbreviation: 'PU' },
    { id: 9, university_id: 9, title: 'GIKI Undergraduate Fee Structure Revised', description: 'Ghulam Ishaq Khan Institute has revised its fee structure for the 2025-26 academic year. Hostel charges have increased by 8%.', source_url: 'https://giki.edu.pk', category: 'fee_changes', published_at: '2026-05-02T09:00:00Z', university_name: 'Ghulam Ishaq Khan Institute', university_abbreviation: 'GIKI' },
    { id: 10, university_id: 10, title: 'NED Admission Open for B.E. Programs', description: 'NED University has opened admissions for Bachelor of Engineering programs. Apply online through the admission portal before June 1.', source_url: 'https://neduet.edu.pk', category: 'admissions', published_at: '2026-05-01T11:30:00Z', university_name: 'NED University', university_abbreviation: 'NED' },
    { id: 11, university_id: 11, title: 'KU Test Result 2025 Declared', description: 'University of Karachi has declared the results for its entrance test 2025. Candidates can download their scorecards from the official website.', source_url: 'https://uok.edu.pk', category: 'results', published_at: '2026-04-30T14:00:00Z', university_name: 'University of Karachi', university_abbreviation: 'KU' },
    { id: 12, university_id: 12, title: 'Bahria University Financial Aid Applications Open', description: 'Bahria University invites applications for need-based financial aid for the Fall 2025 semester. Submit documents by May 30.', source_url: 'https://bahria.edu.pk', category: 'scholarships', published_at: '2026-04-29T10:00:00Z', university_name: 'Bahria University', university_abbreviation: 'BU' },
    { id: 13, university_id: 13, title: 'Air University Aerospace Engineering Test Delayed', description: 'The entrance test for Aerospace Engineering at Air University has been delayed by two weeks due to administrative reasons.', source_url: 'https://au.edu.pk', category: 'test_updates', published_at: '2026-04-28T15:45:00Z', university_name: 'Air University', university_abbreviation: 'AU' },
    { id: 14, university_id: 14, title: 'IBA BBA Admissions Last Date Reminder', description: 'This is a final reminder that the last date to apply for IBA BBA program is May 10, 2025. No applications will be accepted after midnight.', source_url: 'https://iba.edu.pk', category: 'admissions', published_at: '2026-04-27T08:00:00Z', university_name: 'Institute of Business Administration', university_abbreviation: 'IBA' },
    { id: 15, university_id: 15, title: 'University of Peshawar New Campus Announcement', description: 'UoP has announced plans to open a new campus in Mardan focusing on science and technology programs starting Fall 2026.', source_url: 'https://uop.edu.pk', category: 'general', published_at: '2026-04-26T12:00:00Z', university_name: 'University of Peshawar', university_abbreviation: 'UoP' },
    { id: 16, university_id: 16, title: 'UHS MDCAT Syllabus Updated', description: 'University of Health Sciences has released the updated MDCAT syllabus for 2025. New topics in biochemistry have been added.', source_url: 'https://uhs.edu.pk', category: 'test_updates', published_at: '2026-04-25T09:30:00Z', university_name: 'University of Health Sciences', university_abbreviation: 'UHS' },
    { id: 17, university_id: 17, title: 'DUHS Nursing Admission Open', description: 'Dow University of Health Sciences has opened admissions for its BSN program for the academic year 2025-26.', source_url: 'https://duhs.edu.pk', category: 'admissions', published_at: '2026-04-24T11:00:00Z', university_name: 'Dow University of Health Sciences', university_abbreviation: 'DUHS' },
    { id: 18, university_id: 18, title: 'KEMU Merit List for DPT Program', description: 'King Edward Medical University has published the merit list for Doctor of Physical Therapy program. First seatings close on May 5.', source_url: 'https://kemu.edu.pk', category: 'results', published_at: '2026-04-23T10:15:00Z', university_name: 'King Edward Medical University', university_abbreviation: 'KEMU' },
    { id: 19, university_id: 19, title: 'AIOU Fee Waiver for Remote Students', description: 'Allama Iqbal Open University is offering a 50% fee waiver for students enrolling from remote districts of Balochistan and Gilgit.', source_url: 'https://aiou.edu.pk', category: 'scholarships', published_at: '2026-04-22T14:00:00Z', university_name: 'Allama Iqbal Open University', university_abbreviation: 'AIOU' },
    { id: 20, university_id: 20, title: 'PIEAS MS Admissions Interview Schedule', description: 'Pakistan Institute of Engineering and Applied Sciences has released the interview schedule for MS admissions 2025.', source_url: 'https://pieas.edu.pk', category: 'test_updates', published_at: '2026-04-21T08:30:00Z', university_name: 'PIEAS', university_abbreviation: 'PIEAS' },
    { id: 21, university_id: 21, title: 'IST Islamabad Tuition Fee Restructuring', description: 'Institute of Space Technology has restructured tuition fees for avionics and astronautics programs effective Fall 2025.', source_url: 'https://ist.edu.pk', category: 'fee_changes', published_at: '2026-04-20T10:00:00Z', university_name: 'IST Islamabad', university_abbreviation: 'IST' },
    { id: 22, university_id: 22, title: 'Habib University Open House 2025', description: 'Habib University invites prospective students and parents to its annual Open House on June 5, 2025.', source_url: 'https://habib.edu.pk', category: 'general', published_at: '2026-04-19T09:00:00Z', university_name: 'Habib University', university_abbreviation: 'HU' },
    { id: 23, university_id: 23, title: 'SZABIST Spring Admissions Extended', description: 'SZABIST has extended spring admissions for BBA and MBA programs by one week due to high demand.', source_url: 'https://szabist.edu.pk', category: 'admissions', published_at: '2026-04-18T11:00:00Z', university_name: 'SZABIST', university_abbreviation: 'SZABIST' },
    { id: 24, university_id: 24, title: 'University of Lahore Test Centre List Released', description: 'UoL has released the list of test centres for its entrance exam 2025. Check your assigned centre using your roll number.', source_url: 'https://uol.edu.pk', category: 'test_updates', published_at: '2026-04-17T13:30:00Z', university_name: 'University of Lahore', university_abbreviation: 'UoL' },
    { id: 25, university_id: 25, title: 'Mehran University Selected Candidates List', description: 'MUET has announced the list of selected candidates for BS Civil Engineering. Reporting date is May 2, 2025.', source_url: 'https://muet.edu.pk', category: 'results', published_at: '2026-04-16T10:00:00Z', university_name: 'Mehran University', university_abbreviation: 'MUET' },
  ];

  let news = [...MOCK_NEWS];

  if (search) {
    const q = search.toLowerCase();
    news = news.filter((n) =>
      n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'all') {
    news = news.filter((n) => n.category === category);
  }

  if (universityId) {
    const uid = parseInt(universityId, 10);
    news = news.filter((n) => n.university_id === uid);
  }

  if (sort === 'newest') {
    news.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
  } else if (sort === 'oldest') {
    news.sort((a, b) => new Date(a.published_at) - new Date(b.published_at));
  } else if (sort === 'alpha') {
    news.sort((a, b) => a.title.localeCompare(b.title));
  }

  const total = news.length;
  const start = (page - 1) * limit;
  const paginated = news.slice(start, start + limit);

  return Response.json({ news: paginated, total, page });
}
