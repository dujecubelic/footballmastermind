export interface FootballPlayer {
  id: string
  name: string
  clubs: string[]
  countries: string[]
  trophies: string[]
  image?: string
}

// Database of football players with their clubs, countries, and trophies
export const footballPlayers: FootballPlayer[] = [
  {
    id: "player-1",
    name: "Lionel Messi",
    clubs: ["Barcelona", "PSG", "Inter Miami"],
    countries: ["Argentina"],
    trophies: ["FIFA World Cup", "UEFA Champions League", "La Liga", "Copa America"],
  },
  {
    id: "player-2",
    name: "Cristiano Ronaldo",
    clubs: ["Sporting CP", "Manchester United", "Real Madrid", "Juventus", "Al Nassr"],
    countries: ["Portugal"],
    trophies: ["UEFA Champions League", "Premier League", "La Liga", "Serie A", "UEFA European Championship"],
  },
  {
    id: "player-3",
    name: "Zinedine Zidane",
    clubs: ["Cannes", "Bordeaux", "Juventus", "Real Madrid"],
    countries: ["France"],
    trophies: ["FIFA World Cup", "UEFA Champions League", "Serie A", "La Liga"],
  },
  {
    id: "player-4",
    name: "Thierry Henry",
    clubs: ["Monaco", "Juventus", "Arsenal", "Barcelona", "New York Red Bulls"],
    countries: ["France"],
    trophies: ["FIFA World Cup", "Premier League", "La Liga", "UEFA Champions League"],
  },
  {
    id: "player-5",
    name: "Ronaldinho",
    clubs: ["Grêmio", "PSG", "Barcelona", "AC Milan", "Flamengo", "Atlético Mineiro"],
    countries: ["Brazil"],
    trophies: ["FIFA World Cup", "UEFA Champions League", "La Liga", "Serie A"],
  },
  {
    id: "player-6",
    name: "Andrés Iniesta",
    clubs: ["Barcelona", "Vissel Kobe", "Emirates Club"],
    countries: ["Spain"],
    trophies: ["FIFA World Cup", "UEFA Champions League", "La Liga", "UEFA European Championship"],
  },
  {
    id: "player-7",
    name: "Xavi Hernández",
    clubs: ["Barcelona", "Al Sadd"],
    countries: ["Spain"],
    trophies: ["FIFA World Cup", "UEFA Champions League", "La Liga", "UEFA European Championship"],
  },
  {
    id: "player-8",
    name: "Sergio Ramos",
    clubs: ["Sevilla", "Real Madrid", "PSG"],
    countries: ["Spain"],
    trophies: ["FIFA World Cup", "UEFA Champions League", "La Liga", "UEFA European Championship"],
  },
  {
    id: "player-9",
    name: "Karim Benzema",
    clubs: ["Lyon", "Real Madrid", "Al-Ittihad"],
    countries: ["France"],
    trophies: ["UEFA Champions League", "La Liga", "Ligue 1"],
  },
  {
    id: "player-10",
    name: "Robert Lewandowski",
    clubs: ["Znicz Pruszków", "Lech Poznań", "Borussia Dortmund", "Bayern Munich", "Barcelona"],
    countries: ["Poland"],
    trophies: ["UEFA Champions League", "Bundesliga", "La Liga"],
  },
  {
    id: "player-11",
    name: "Neymar Jr.",
    clubs: ["Santos", "Barcelona", "PSG", "Al Hilal"],
    countries: ["Brazil"],
    trophies: ["UEFA Champions League", "La Liga", "Ligue 1", "Copa Libertadores"],
  },
  {
    id: "player-12",
    name: "Kylian Mbappé",
    clubs: ["Monaco", "PSG", "Real Madrid"],
    countries: ["France"],
    trophies: ["FIFA World Cup", "Ligue 1"],
  },
  {
    id: "player-13",
    name: "Luka Modrić",
    clubs: ["Dinamo Zagreb", "Tottenham Hotspur", "Real Madrid"],
    countries: ["Croatia"],
    trophies: ["UEFA Champions League", "La Liga"],
  },
  {
    id: "player-14",
    name: "Kevin De Bruyne",
    clubs: ["Genk", "Chelsea", "Werder Bremen", "Wolfsburg", "Manchester City"],
    countries: ["Belgium"],
    trophies: ["Premier League", "UEFA Champions League"],
  },
  {
    id: "player-15",
    name: "Virgil van Dijk",
    clubs: ["Groningen", "Celtic", "Southampton", "Liverpool"],
    countries: ["Netherlands"],
    trophies: ["UEFA Champions League", "Premier League", "Scottish Premiership"],
  },
  {
    id: "player-16",
    name: "Mohamed Salah",
    clubs: ["Al Mokawloon", "Basel", "Chelsea", "Fiorentina", "Roma", "Liverpool"],
    countries: ["Egypt"],
    trophies: ["UEFA Champions League", "Premier League", "Serie A"],
  },
  {
    id: "player-17",
    name: "Erling Haaland",
    clubs: ["Bryne", "Molde", "Red Bull Salzburg", "Borussia Dortmund", "Manchester City"],
    countries: ["Norway"],
    trophies: ["Premier League", "UEFA Champions League", "Austrian Bundesliga"],
  },
  {
    id: "player-18",
    name: "Gianluigi Buffon",
    clubs: ["Parma", "Juventus", "PSG"],
    countries: ["Italy"],
    trophies: ["FIFA World Cup", "Serie A", "Ligue 1"],
  },
  {
    id: "player-19",
    name: "Paolo Maldini",
    clubs: ["AC Milan"],
    countries: ["Italy"],
    trophies: ["UEFA Champions League", "Serie A"],
  },
  {
    id: "player-20",
    name: "Ronaldo Nazário",
    clubs: ["Cruzeiro", "PSV", "Barcelona", "Inter Milan", "Real Madrid", "AC Milan", "Corinthians"],
    countries: ["Brazil"],
    trophies: ["FIFA World Cup", "La Liga", "UEFA Cup"],
  },
  {
    id: "player-21",
    name: "Zlatan Ibrahimović",
    clubs: [
      "Malmö FF",
      "Ajax",
      "Juventus",
      "Inter Milan",
      "Barcelona",
      "AC Milan",
      "PSG",
      "Manchester United",
      "LA Galaxy",
    ],
    countries: ["Sweden"],
    trophies: ["La Liga", "Serie A", "Ligue 1", "Eredivisie"],
  },
  {
    id: "player-22",
    name: "David Beckham",
    clubs: ["Manchester United", "Real Madrid", "LA Galaxy", "AC Milan", "PSG"],
    countries: ["England"],
    trophies: ["UEFA Champions League", "Premier League", "La Liga", "Ligue 1"],
  },
  {
    id: "player-23",
    name: "Andrea Pirlo",
    clubs: ["Brescia", "Inter Milan", "AC Milan", "Juventus", "New York City FC"],
    countries: ["Italy"],
    trophies: ["FIFA World Cup", "UEFA Champions League", "Serie A"],
  },
  {
    id: "player-24",
    name: "Luis Suárez",
    clubs: ["Nacional", "Groningen", "Ajax", "Liverpool", "Barcelona", "Atlético Madrid", "Grêmio", "Inter Miami"],
    countries: ["Uruguay"],
    trophies: ["UEFA Champions League", "La Liga", "Eredivisie", "Copa America"],
  },
  {
    id: "player-25",
    name: "Sergio Agüero",
    clubs: ["Independiente", "Atlético Madrid", "Manchester City", "Barcelona"],
    countries: ["Argentina"],
    trophies: ["Premier League", "Europa League", "Copa America"],
  },
  {
    id: "player-26",
    name: "Didier Drogba",
    clubs: [
      "Le Mans",
      "Guingamp",
      "Marseille",
      "Chelsea",
      "Shanghai Shenhua",
      "Galatasaray",
      "Montreal Impact",
      "Phoenix Rising",
    ],
    countries: ["Ivory Coast"],
    trophies: ["UEFA Champions League", "Premier League", "FA Cup"],
  },
  {
    id: "player-27",
    name: "Iker Casillas",
    clubs: ["Real Madrid", "Porto"],
    countries: ["Spain"],
    trophies: ["FIFA World Cup", "UEFA Champions League", "La Liga", "UEFA European Championship"],
  },
  {
    id: "player-28",
    name: "Carles Puyol",
    clubs: ["Barcelona"],
    countries: ["Spain"],
    trophies: ["FIFA World Cup", "UEFA Champions League", "La Liga", "UEFA European Championship"],
  },
  {
    id: "player-29",
    name: "Philipp Lahm",
    clubs: ["Bayern Munich", "Stuttgart"],
    countries: ["Germany"],
    trophies: ["FIFA World Cup", "UEFA Champions League", "Bundesliga"],
  },
  {
    id: "player-30",
    name: "Bastian Schweinsteiger",
    clubs: ["Bayern Munich", "Manchester United", "Chicago Fire"],
    countries: ["Germany"],
    trophies: ["FIFA World Cup", "UEFA Champions League", "Bundesliga"],
  },
]

// Find players that match a specific club and country
export function findPlayersByClubAndCountry(club: string, country: string): FootballPlayer[] {
  return footballPlayers.filter((player) => player.clubs.includes(club) && player.countries.includes(country))
}

// Find players that match a specific club and trophy
export function findPlayersByClubAndTrophy(club: string, trophy: string): FootballPlayer[] {
  return footballPlayers.filter((player) => player.clubs.includes(club) && player.trophies.includes(trophy))
}

// Find players that match a specific country and trophy
export function findPlayersByCountryAndTrophy(country: string, trophy: string): FootballPlayer[] {
  return footballPlayers.filter((player) => player.countries.includes(country) && player.trophies.includes(trophy))
}

// Get unique clubs from all players
export function getUniqueClubs(): string[] {
  const clubs = new Set<string>()
  footballPlayers.forEach((player) => {
    player.clubs.forEach((club) => clubs.add(club))
  })
  return Array.from(clubs).sort()
}

// Get unique countries from all players
export function getUniqueCountries(): string[] {
  const countries = new Set<string>()
  footballPlayers.forEach((player) => {
    player.countries.forEach((country) => countries.add(country))
  })
  return Array.from(countries).sort()
}

// Get unique trophies from all players
export function getUniqueTrophies(): string[] {
  const trophies = new Set<string>()
  footballPlayers.forEach((player) => {
    player.trophies.forEach((trophy) => trophies.add(trophy))
  })
  return Array.from(trophies).sort()
}

// Generate a question about a player
export function generatePlayerQuestion(player: FootballPlayer): {
  question: string
  options: { id: string; text: string }[]
  correctAnswerId: string
} {
  // Different question types
  const questionTypes = [
    `Which club did ${player.name} NOT play for?`,
    `In which year did ${player.name} win the ${player.trophies[0] || "Champions League"}?`,
    `Which trophy has ${player.name} NOT won?`,
    `Which national team did ${player.name} represent?`,
  ]

  // Select a random question type
  const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)]

  let options: { id: string; text: string }[] = []
  let correctAnswerId: string

  if (questionType.includes("NOT play for")) {
    // Create options with 3 clubs the player played for and 1 they didn't
    const allClubs = getUniqueClubs()
    const clubsNotPlayed = allClubs.filter((club) => !player.clubs.includes(club))

    // Get 3 random clubs the player played for (or fewer if they played for less than 3)
    const playerClubs = [...player.clubs].sort(() => 0.5 - Math.random()).slice(0, Math.min(3, player.clubs.length))

    // Add a club they didn't play for
    const randomClubNotPlayed = clubsNotPlayed[Math.floor(Math.random() * clubsNotPlayed.length)]

    options = [
      { id: "a", text: randomClubNotPlayed },
      ...playerClubs.map((club, index) => ({ id: String.fromCharCode(98 + index), text: club })),
    ]

    correctAnswerId = "a"
  } else if (questionType.includes("which year")) {
    // Years are fictional for this example
    const correctYear = 2015 - Math.floor(Math.random() * 10)
    options = [
      { id: "a", text: correctYear.toString() },
      { id: "b", text: (correctYear + 1).toString() },
      { id: "c", text: (correctYear + 2).toString() },
      { id: "d", text: (correctYear - 1).toString() },
    ]
    correctAnswerId = "a"
  } else if (questionType.includes("NOT won")) {
    // Create options with 3 trophies the player won and 1 they didn't
    const allTrophies = getUniqueTrophies()
    const trophiesNotWon = allTrophies.filter((trophy) => !player.trophies.includes(trophy))

    // Get 3 random trophies the player won (or fewer if they won less than 3)
    const playerTrophies = [...player.trophies]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.min(3, player.trophies.length))

    // Add a trophy they didn't win
    const randomTrophyNotWon = trophiesNotWon[Math.floor(Math.random() * trophiesNotWon.length)]

    options = [
      { id: "a", text: randomTrophyNotWon },
      ...playerTrophies.map((trophy, index) => ({ id: String.fromCharCode(98 + index), text: trophy })),
    ]

    correctAnswerId = "a"
  } else if (questionType.includes("national team")) {
    // Create options with the correct country and 3 wrong ones
    const allCountries = getUniqueCountries()
    const countriesNotPlayed = allCountries.filter((country) => !player.countries.includes(country))

    // Get 3 random countries the player didn't represent
    const randomCountriesNotPlayed = countriesNotPlayed.sort(() => 0.5 - Math.random()).slice(0, 3)

    options = [
      { id: "a", text: player.countries[0] },
      ...randomCountriesNotPlayed.map((country, index) => ({ id: String.fromCharCode(98 + index), text: country })),
    ]

    correctAnswerId = "a"
  }

  // Shuffle the options
  options = options.sort(() => 0.5 - Math.random())

  // Find the new position of the correct answer after shuffling
  const correctOption = options.find((option) => {
    if (questionType.includes("NOT play for")) {
      const allClubs = getUniqueClubs()
      const clubsNotPlayed = allClubs.filter((club) => !player.clubs.includes(club))
      return clubsNotPlayed.includes(option.text)
    } else if (questionType.includes("which year")) {
      const correctYear = 2015 - Math.floor(Math.random() * 10)
      return option.text === correctYear.toString()
    } else if (questionType.includes("NOT won")) {
      const allTrophies = getUniqueTrophies()
      const trophiesNotWon = allTrophies.filter((trophy) => !player.trophies.includes(trophy))
      return trophiesNotWon.includes(option.text)
    } else if (questionType.includes("national team")) {
      return option.text === player.countries[0]
    }
    return false
  })

  correctAnswerId = correctOption?.id || "a"

  return {
    question: questionType,
    options,
    correctAnswerId,
  }
}
