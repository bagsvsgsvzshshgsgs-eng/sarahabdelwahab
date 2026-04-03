// Seed data — loaded into localStorage on first run
export const SEED_USERS = [
  { id: 'admin-1', role: 'admin',   username: 'admin', password: 'admin123', name: 'Teacher Admin' },
  { id: 's-1',     role: 'student', username: 'alice', password: 'pass123',  name: 'Alice Johnson',  email: 'alice@school.edu'  },
  { id: 's-2',     role: 'student', username: 'bob',   password: 'quiz456',  name: 'Bob Martinez',   email: 'bob@school.edu'    },
  { id: 's-3',     role: 'student', username: 'carol', password: 'learn789', name: 'Carol Nguyen',   email: 'carol@school.edu'  },
  { id: 's-4',     role: 'student', username: 'david', password: 'study321', name: 'David Park',     email: 'david@school.edu'  },
  { id: 's-5',     role: 'student', username: 'emma',  password: 'ace2024',  name: 'Emma Wilson',    email: 'emma@school.edu'   },
]

export const SEED_HOMEWORK = [
  {
    id: 'hw-1',
    title: 'Science Quiz — Solar System',
    description: 'Test your knowledge of our solar system and space exploration.',
    published: true,
    createdAt: '2024-03-01T09:00:00Z',
    questions: [
      { id: 'q-1-1', text: 'What is the largest planet in our solar system?',           choices: ['Mars','Saturn','Jupiter','Neptune'],             correct: 'C', score: 10 },
      { id: 'q-1-2', text: 'How many planets are in the solar system?',                 choices: ['7','8','9','10'],                               correct: 'B', score: 10 },
      { id: 'q-1-3', text: 'Which planet is known as the Red Planet?',                  choices: ['Venus','Jupiter','Saturn','Mars'],              correct: 'D', score: 10 },
      { id: 'q-1-4', text: 'What is the closest star to Earth?',                        choices: ['Sirius','Alpha Centauri','The Sun','Vega'],     correct: 'C', score: 10 },
      { id: 'q-1-5', text: 'Which planet has the most moons?',                          choices: ['Jupiter','Saturn','Uranus','Neptune'],          correct: 'B', score: 10 },
    ],
  },
  {
    id: 'hw-2',
    title: 'World History — Ancient Civilizations',
    description: 'Questions about early human history and ancient civilizations.',
    published: true,
    createdAt: '2024-03-05T09:00:00Z',
    questions: [
      { id: 'q-2-1', text: 'In which country are the Pyramids of Giza located?',        choices: ['Sudan','Libya','Egypt','Morocco'],              correct: 'C', score: 20 },
      { id: 'q-2-2', text: 'What ancient wonder was located in Alexandria?',             choices: ['The Colossus','The Lighthouse','The Mausoleum','The Temple'], correct: 'B', score: 20 },
      { id: 'q-2-3', text: 'Which civilization built Machu Picchu?',                    choices: ['Aztec','Maya','Olmec','Inca'],                  correct: 'D', score: 20 },
      { id: 'q-2-4', text: 'The Roman Colosseum is located in which city?',             choices: ['Athens','Rome','Carthage','Pompeii'],           correct: 'B', score: 20 },
      { id: 'q-2-5', text: 'Who was the first emperor of China?',                       choices: ['Wu Zetian','Kublai Khan','Qin Shi Huang','Liu Bang'], correct: 'C', score: 20 },
    ],
  },
]

export const SEED_RESULTS = []
