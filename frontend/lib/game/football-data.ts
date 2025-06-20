export type FootballCategory = "clubs" | "countries" | "trophies"

export interface FootballItem {
  id: string
  name: string
  category: FootballCategory
  difficulty: "easy" | "medium" | "hard"
}

// Football clubs data
export const footballClubs: FootballItem[] = [
  { id: "club-1", name: "Manchester United", category: "clubs", difficulty: "easy" },
  { id: "club-2", name: "Barcelona", category: "clubs", difficulty: "easy" },
  { id: "club-3", name: "Real Madrid", category: "clubs", difficulty: "easy" },
  { id: "club-4", name: "Bayern Munich", category: "clubs", difficulty: "easy" },
  { id: "club-5", name: "Liverpool", category: "clubs", difficulty: "easy" },
  { id: "club-6", name: "Juventus", category: "clubs", difficulty: "easy" },
  { id: "club-7", name: "AC Milan", category: "clubs", difficulty: "medium" },
  { id: "club-8", name: "Inter Milan", category: "clubs", difficulty: "medium" },
  { id: "club-9", name: "Chelsea", category: "clubs", difficulty: "easy" },
  { id: "club-10", name: "Manchester City", category: "clubs", difficulty: "easy" },
  { id: "club-11", name: "Arsenal", category: "clubs", difficulty: "easy" },
  { id: "club-12", name: "PSG", category: "clubs", difficulty: "easy" },
  { id: "club-13", name: "Borussia Dortmund", category: "clubs", difficulty: "medium" },
  { id: "club-14", name: "Atletico Madrid", category: "clubs", difficulty: "medium" },
  { id: "club-15", name: "Ajax", category: "clubs", difficulty: "medium" },
  { id: "club-16", name: "Porto", category: "clubs", difficulty: "medium" },
  { id: "club-17", name: "Benfica", category: "clubs", difficulty: "medium" },
  { id: "club-18", name: "Napoli", category: "clubs", difficulty: "medium" },
  { id: "club-19", name: "Roma", category: "clubs", difficulty: "medium" },
  { id: "club-20", name: "Boca Juniors", category: "clubs", difficulty: "hard" },
  { id: "club-21", name: "River Plate", category: "clubs", difficulty: "hard" },
  { id: "club-22", name: "Flamengo", category: "clubs", difficulty: "hard" },
  { id: "club-23", name: "Santos", category: "clubs", difficulty: "hard" },
  { id: "club-24", name: "Celtic", category: "clubs", difficulty: "medium" },
  { id: "club-25", name: "Rangers", category: "clubs", difficulty: "medium" },
]

// National teams data
export const nationalTeams: FootballItem[] = [
  { id: "country-1", name: "Brazil", category: "countries", difficulty: "easy" },
  { id: "country-2", name: "Germany", category: "countries", difficulty: "easy" },
  { id: "country-3", name: "France", category: "countries", difficulty: "easy" },
  { id: "country-4", name: "Italy", category: "countries", difficulty: "easy" },
  { id: "country-5", name: "Spain", category: "countries", difficulty: "easy" },
  { id: "country-6", name: "Argentina", category: "countries", difficulty: "easy" },
  { id: "country-7", name: "England", category: "countries", difficulty: "easy" },
  { id: "country-8", name: "Netherlands", category: "countries", difficulty: "easy" },
  { id: "country-9", name: "Portugal", category: "countries", difficulty: "easy" },
  { id: "country-10", name: "Belgium", category: "countries", difficulty: "easy" },
  { id: "country-11", name: "Uruguay", category: "countries", difficulty: "medium" },
  { id: "country-12", name: "Croatia", category: "countries", difficulty: "medium" },
  { id: "country-13", name: "Colombia", category: "countries", difficulty: "medium" },
  { id: "country-14", name: "Mexico", category: "countries", difficulty: "medium" },
  { id: "country-15", name: "Sweden", category: "countries", difficulty: "medium" },
  { id: "country-16", name: "Denmark", category: "countries", difficulty: "medium" },
  { id: "country-17", name: "Japan", category: "countries", difficulty: "medium" },
  { id: "country-18", name: "South Korea", category: "countries", difficulty: "medium" },
  { id: "country-19", name: "Nigeria", category: "countries", difficulty: "hard" },
  { id: "country-20", name: "Senegal", category: "countries", difficulty: "hard" },
  { id: "country-21", name: "Ghana", category: "countries", difficulty: "hard" },
  { id: "country-22", name: "Cameroon", category: "countries", difficulty: "hard" },
  { id: "country-23", name: "Australia", category: "countries", difficulty: "hard" },
  { id: "country-24", name: "United States", category: "countries", difficulty: "medium" },
  { id: "country-25", name: "Canada", category: "countries", difficulty: "hard" },
]

// Football trophies data
export const footballTrophies: FootballItem[] = [
  { id: "trophy-1", name: "FIFA World Cup", category: "trophies", difficulty: "easy" },
  { id: "trophy-2", name: "UEFA Champions League", category: "trophies", difficulty: "easy" },
  { id: "trophy-3", name: "UEFA European Championship", category: "trophies", difficulty: "easy" },
  { id: "trophy-4", name: "Copa America", category: "trophies", difficulty: "easy" },
  { id: "trophy-5", name: "Premier League", category: "trophies", difficulty: "easy" },
  { id: "trophy-6", name: "La Liga", category: "trophies", difficulty: "easy" },
  { id: "trophy-7", name: "Bundesliga", category: "trophies", difficulty: "easy" },
  { id: "trophy-8", name: "Serie A", category: "trophies", difficulty: "easy" },
  { id: "trophy-9", name: "Ligue 1", category: "trophies", difficulty: "easy" },
  { id: "trophy-10", name: "FA Cup", category: "trophies", difficulty: "medium" },
  { id: "trophy-11", name: "Copa del Rey", category: "trophies", difficulty: "medium" },
  { id: "trophy-12", name: "DFB-Pokal", category: "trophies", difficulty: "medium" },
  { id: "trophy-13", name: "Coppa Italia", category: "trophies", difficulty: "medium" },
  { id: "trophy-14", name: "UEFA Europa League", category: "trophies", difficulty: "medium" },
  { id: "trophy-15", name: "FIFA Club World Cup", category: "trophies", difficulty: "medium" },
  { id: "trophy-16", name: "UEFA Super Cup", category: "trophies", difficulty: "medium" },
  { id: "trophy-17", name: "African Cup of Nations", category: "trophies", difficulty: "medium" },
  { id: "trophy-18", name: "AFC Asian Cup", category: "trophies", difficulty: "hard" },
  { id: "trophy-19", name: "CONCACAF Gold Cup", category: "trophies", difficulty: "hard" },
  { id: "trophy-20", name: "Copa Libertadores", category: "trophies", difficulty: "medium" },
  { id: "trophy-21", name: "Eredivisie", category: "trophies", difficulty: "medium" },
  { id: "trophy-22", name: "Primeira Liga", category: "trophies", difficulty: "medium" },
  { id: "trophy-23", name: "Scottish Premiership", category: "trophies", difficulty: "hard" },
  { id: "trophy-24", name: "MLS Cup", category: "trophies", difficulty: "hard" },
  { id: "trophy-25", name: "FIFA Confederations Cup", category: "trophies", difficulty: "hard" },
]

// Get all football items
export function getAllFootballItems(): FootballItem[] {
  return [...footballClubs, ...nationalTeams, ...footballTrophies]
}

// Get items by category
export function getItemsByCategory(category: FootballCategory): FootballItem[] {
  switch (category) {
    case "clubs":
      return footballClubs
    case "countries":
      return nationalTeams
    case "trophies":
      return footballTrophies
    default:
      return []
  }
}

// Get random items from a category
export function getRandomItemsFromCategory(
  category: FootballCategory,
  count: number,
  difficulty?: "easy" | "medium" | "hard",
): FootballItem[] {
  const items = getItemsByCategory(category)

  // Filter by difficulty if provided
  const filteredItems = difficulty ? items.filter((item) => item.difficulty === difficulty) : items

  // Shuffle and take the requested count
  return shuffleArray(filteredItems).slice(0, count)
}

// Fisher-Yates shuffle algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Helper functions to get specific data
// In a real app, these would fetch from a database
export function getCountryForClub(clubName: string): string {
  const clubCountries: Record<string, string> = {
    "Manchester United": "England",
    Barcelona: "Spain",
    "Real Madrid": "Spain",
    "Bayern Munich": "Germany",
    Liverpool: "England",
    Juventus: "Italy",
    "AC Milan": "Italy",
    "Inter Milan": "Italy",
    Chelsea: "England",
    "Manchester City": "England",
    Arsenal: "England",
    PSG: "France",
    "Borussia Dortmund": "Germany",
    "Atletico Madrid": "Spain",
    Ajax: "Netherlands",
    Porto: "Portugal",
    Benfica: "Portugal",
    Napoli: "Italy",
    Roma: "Italy",
    "Boca Juniors": "Argentina",
    "River Plate": "Argentina",
    Flamengo: "Brazil",
    Santos: "Brazil",
    Celtic: "Scotland",
    Rangers: "Scotland",
  }

  return clubCountries[clubName] || "Unknown"
}

export function getPlayerForItem(item: FootballItem): string {
  if (item.category === "clubs") {
    const clubPlayers: Record<string, string> = {
      "Manchester United": "Wayne Rooney",
      Barcelona: "Xavi Hernandez",
      "Real Madrid": "Sergio Ramos",
      "Bayern Munich": "Thomas Müller",
      Liverpool: "Steven Gerrard",
      Juventus: "Alessandro Del Piero",
      "AC Milan": "Paolo Maldini",
      "Inter Milan": "Javier Zanetti",
      Chelsea: "Frank Lampard",
      "Manchester City": "David Silva",
      Arsenal: "Thierry Henry",
      PSG: "Kylian Mbappé",
      "Borussia Dortmund": "Marco Reus",
      "Atletico Madrid": "Antoine Griezmann",
      Ajax: "Johan Cruyff",
      Porto: "Hulk",
      Benfica: "Eusébio",
      Napoli: "Diego Maradona",
      Roma: "Francesco Totti",
      "Boca Juniors": "Juan Román Riquelme",
      "River Plate": "Enzo Francescoli",
      Flamengo: "Zico",
      Santos: "Pelé",
      Celtic: "Henrik Larsson",
      Rangers: "Ally McCoist",
    }

    return clubPlayers[item.name] || "Unknown Player"
  } else if (item.category === "countries") {
    const countryPlayers: Record<string, string> = {
      Brazil: "Pelé",
      Germany: "Gerd Müller",
      France: "Zinedine Zidane",
      Italy: "Paolo Rossi",
      Spain: "Andres Iniesta",
      Argentina: "Diego Maradona",
      England: "Harry Kane",
      Netherlands: "Johan Cruyff",
      Portugal: "Eusébio",
      Belgium: "Eden Hazard",
      Uruguay: "Luis Suárez",
      Croatia: "Luka Modrić",
      Colombia: "James Rodríguez",
      Mexico: "Hugo Sánchez",
      Sweden: "Zlatan Ibrahimović",
      Denmark: "Michael Laudrup",
      Japan: "Hidetoshi Nakata",
      "South Korea": "Son Heung-min",
      Nigeria: "Jay-Jay Okocha",
      Senegal: "Sadio Mané",
      Ghana: "Asamoah Gyan",
      Cameroon: "Samuel Eto'o",
      Australia: "Tim Cahill",
      "United States": "Landon Donovan",
      Canada: "Alphonso Davies",
    }

    return countryPlayers[item.name] || "Unknown Player"
  } else {
    return "Unknown Player"
  }
}

export function getYearForItem(item: FootballItem): string {
  if (item.category === "clubs") {
    const clubFoundingYears: Record<string, string> = {
      "Manchester United": "1878",
      Barcelona: "1899",
      "Real Madrid": "1902",
      "Bayern Munich": "1900",
      Liverpool: "1892",
      Juventus: "1897",
      "AC Milan": "1899",
      "Inter Milan": "1908",
      Chelsea: "1905",
      "Manchester City": "1880",
      Arsenal: "1886",
      PSG: "1970",
      "Borussia Dortmund": "1909",
      "Atletico Madrid": "1903",
      Ajax: "1900",
      Porto: "1893",
      Benfica: "1904",
      Napoli: "1926",
      Roma: "1927",
      "Boca Juniors": "1905",
      "River Plate": "1901",
      Flamengo: "1895",
      Santos: "1912",
      Celtic: "1887",
      Rangers: "1872",
    }

    return clubFoundingYears[item.name] || "1900"
  } else if (item.category === "trophies") {
    const trophyFirstYears: Record<string, string> = {
      "FIFA World Cup": "1930",
      "UEFA Champions League": "1955",
      "UEFA European Championship": "1960",
      "Copa America": "1916",
      "Premier League": "1992",
      "La Liga": "1929",
      Bundesliga: "1963",
      "Serie A": "1898",
      "Ligue 1": "1932",
      "FA Cup": "1871",
      "Copa del Rey": "1903",
      "DFB-Pokal": "1935",
      "Coppa Italia": "1922",
      "UEFA Europa League": "1971",
      "FIFA Club World Cup": "2000",
      "UEFA Super Cup": "1972",
      "African Cup of Nations": "1957",
      "AFC Asian Cup": "1956",
      "CONCACAF Gold Cup": "1991",
      "Copa Libertadores": "1960",
      Eredivisie: "1956",
      "Primeira Liga": "1934",
      "Scottish Premiership": "1890",
      "MLS Cup": "1996",
      "FIFA Confederations Cup": "1992",
    }

    return trophyFirstYears[item.name] || "1950"
  } else {
    return "1950"
  }
}

export function getStadiumForClub(clubName: string): string {
  const clubStadiums: Record<string, string> = {
    "Manchester United": "Old Trafford",
    Barcelona: "Camp Nou",
    "Real Madrid": "Santiago Bernabéu",
    "Bayern Munich": "Allianz Arena",
    Liverpool: "Anfield",
    Juventus: "Allianz Stadium",
    "AC Milan": "San Siro",
    "Inter Milan": "San Siro",
    Chelsea: "Stamford Bridge",
    "Manchester City": "Etihad Stadium",
    Arsenal: "Emirates Stadium",
    PSG: "Parc des Princes",
    "Borussia Dortmund": "Signal Iduna Park",
    "Atletico Madrid": "Wanda Metropolitano",
    Ajax: "Johan Cruyff Arena",
    Porto: "Estádio do Dragão",
    Benfica: "Estádio da Luz",
    Napoli: "Stadio Diego Armando Maradona",
    Roma: "Stadio Olimpico",
    "Boca Juniors": "La Bombonera",
    "River Plate": "El Monumental",
    Flamengo: "Maracanã",
    Santos: "Vila Belmiro",
    Celtic: "Celtic Park",
    Rangers: "Ibrox Stadium",
  }

  return clubStadiums[clubName] || "Unknown Stadium"
}

export function getWorldCupsForCountry(countryName: string): string {
  const worldCupWins: Record<string, string> = {
    Brazil: "5",
    Germany: "4",
    Italy: "4",
    Argentina: "3",
    France: "2",
    Uruguay: "2",
    Spain: "1",
    England: "1",
  }

  return worldCupWins[countryName] || "0"
}

export function getManagerForItem(item: FootballItem): string {
  if (item.category === "countries") {
    const countryManagers: Record<string, string> = {
      Brazil: "Dorival Júnior",
      Germany: "Julian Nagelsmann",
      France: "Didier Deschamps",
      Italy: "Luciano Spalletti",
      Spain: "Luis de la Fuente",
      Argentina: "Lionel Scaloni",
      England: "Gareth Southgate",
      Netherlands: "Ronald Koeman",
      Portugal: "Roberto Martínez",
      Belgium: "Domenico Tedesco",
      Uruguay: "Marcelo Bielsa",
      Croatia: "Zlatko Dalić",
      Colombia: "Néstor Lorenzo",
      Mexico: "Jaime Lozano",
      Sweden: "Jon Dahl Tomasson",
      Denmark: "Kasper Hjulmand",
      Japan: "Hajime Moriyasu",
      "South Korea": "Jürgen Klinsmann",
      Nigeria: "Finidi George",
      Senegal: "Aliou Cissé",
      Ghana: "Otto Addo",
      Cameroon: "Marc Brys",
      Australia: "Graham Arnold",
      "United States": "Gregg Berhalter",
      Canada: "Jesse Marsch",
    }

    return countryManagers[item.name] || "Unknown Manager"
  } else {
    return "Unknown Manager"
  }
}

export function getMostWinsForTrophy(trophyName: string): string {
  const trophyMostWins: Record<string, string> = {
    "FIFA World Cup": "Brazil",
    "UEFA Champions League": "Real Madrid",
    "UEFA European Championship": "Spain & Germany",
    "Copa America": "Argentina & Uruguay",
    "Premier League": "Manchester United",
    "La Liga": "Real Madrid",
    Bundesliga: "Bayern Munich",
    "Serie A": "Juventus",
    "Ligue 1": "Saint-Étienne & Paris Saint-Germain",
    "FA Cup": "Arsenal",
    "Copa del Rey": "Barcelona",
    "DFB-Pokal": "Bayern Munich",
    "Coppa Italia": "Juventus",
    "UEFA Europa League": "Sevilla",
    "FIFA Club World Cup": "Real Madrid",
    "UEFA Super Cup": "Real Madrid & Barcelona",
    "African Cup of Nations": "Egypt",
    "AFC Asian Cup": "Japan",
    "CONCACAF Gold Cup": "Mexico",
    "Copa Libertadores": "Independiente",
    Eredivisie: "Ajax",
    "Primeira Liga": "Benfica",
    "Scottish Premiership": "Rangers",
    "MLS Cup": "LA Galaxy",
    "FIFA Confederations Cup": "Brazil",
  }

  return trophyMostWins[trophyName] || "Unknown Team"
}

export function getFrequencyForTrophy(trophyName: string): string {
  const trophyFrequency: Record<string, string> = {
    "FIFA World Cup": "Every 4 years",
    "UEFA Champions League": "Every year",
    "UEFA European Championship": "Every 4 years",
    "Copa America": "Every 4 years",
    "Premier League": "Every year",
    "La Liga": "Every year",
    Bundesliga: "Every year",
    "Serie A": "Every year",
    "Ligue 1": "Every year",
    "FA Cup": "Every year",
    "Copa del Rey": "Every year",
    "DFB-Pokal": "Every year",
    "Coppa Italia": "Every year",
    "UEFA Europa League": "Every year",
    "FIFA Club World Cup": "Every year",
    "UEFA Super Cup": "Every year",
    "African Cup of Nations": "Every 2 years",
    "AFC Asian Cup": "Every 4 years",
    "CONCACAF Gold Cup": "Every 2 years",
    "Copa Libertadores": "Every year",
    Eredivisie: "Every year",
    "Primeira Liga": "Every year",
    "Scottish Premiership": "Every year",
    "MLS Cup": "Every year",
    "FIFA Confederations Cup": "Every 4 years",
  }

  return trophyFrequency[trophyName] || "Unknown Frequency"
}

// Helper function to generate options for a question
export function generateOptionsForQuestion(item: FootballItem, question: string): { id: string; text: string }[] {
  // This is a simplified implementation
  // In a real app, you'd have a database of correct answers and distractors

  // Sample options based on question type
  if (question.includes("country")) {
    return [
      { id: "a", text: getCountryForClub(item.name) },
      { id: "b", text: "France" },
      { id: "c", text: "Brazil" },
      { id: "d", text: "Germany" },
    ]
  } else if (question.includes("player")) {
    return [
      { id: "a", text: getPlayerForItem(item) },
      { id: "b", text: "Lionel Messi" },
      { id: "c", text: "Cristiano Ronaldo" },
      { id: "d", text: "Neymar Jr." },
    ]
  } else if (question.includes("year")) {
    return [
      { id: "a", text: getYearForItem(item) },
      { id: "b", text: "1950" },
      { id: "c", text: "1970" },
      { id: "d", text: "1990" },
    ]
  } else if (question.includes("stadium")) {
    return [
      { id: "a", text: getStadiumForClub(item.name) },
      { id: "b", text: "Camp Nou" },
      { id: "c", text: "Old Trafford" },
      { id: "d", text: "Santiago Bernabéu" },
    ]
  } else if (question.includes("World Cup")) {
    return [
      { id: "a", text: getWorldCupsForCountry(item.name) },
      { id: "b", text: "1" },
      { id: "c", text: "2" },
      { id: "d", text: "3" },
    ]
  } else if (question.includes("manager") || question.includes("coach")) {
    return [
      { id: "a", text: getManagerForItem(item) },
      { id: "b", text: "Pep Guardiola" },
      { id: "c", text: "Jürgen Klopp" },
      { id: "d", text: "Carlo Ancelotti" },
    ]
  } else if (question.includes("most times")) {
    return [
      { id: "a", text: getMostWinsForTrophy(item.name) },
      { id: "b", text: "Barcelona" },
      { id: "c", text: "Real Madrid" },
      { id: "d", text: "Bayern Munich" },
    ]
  } else if (question.includes("how often")) {
    return [
      { id: "a", text: getFrequencyForTrophy(item.name) },
      { id: "b", text: "Every year" },
      { id: "c", text: "Every 2 years" },
      { id: "d", text: "Every 4 years" },
    ]
  } else {
    // Default options
    return [
      { id: "a", text: "Option A (Correct)" },
      { id: "b", text: "Option B" },
      { id: "c", text: "Option C" },
      { id: "d", text: "Option D" },
    ]
  }
}

// Generate a question for a football item
export function generateQuestionForItem(item: FootballItem): {
  question: string
  options: { id: string; text: string }[]
  correctAnswerId: string
} {
  // Different question types based on category
  const questionTypes = {
    clubs: [
      `In which country is ${item.name} based?`,
      `Which of these players has NOT played for ${item.name}?`,
      `In which year was ${item.name} founded?`,
      `Which stadium is the home ground of ${item.name}?`,
    ],
    countries: [
      `Which player has scored the most goals for ${item.name}?`,
      `How many World Cups has ${item.name} won?`,
      `Who is the current manager/coach of ${item.name}?`,
      `Which of these players has NOT played for ${item.name}?`,
    ],
    trophies: [
      `Which team has won the ${item.name} the most times?`,
      `In which year was the ${item.name} first contested?`,
      `How often is the ${item.name} held?`,
      `Which player has won the ${item.name} the most times?`,
    ],
  }

  // Select a random question type
  const questionType = questionTypes[item.category][Math.floor(Math.random() * questionTypes[item.category].length)]

  // Generate options based on the question type and item
  const options = generateOptionsForQuestion(item, questionType)

  // The correct answer is always the first option in this example
  const correctAnswerId = options[0].id

  // Shuffle the options
  const shuffledOptions = shuffleArray(options)

  return {
    question: questionType,
    options: shuffledOptions,
    correctAnswerId,
  }
}
