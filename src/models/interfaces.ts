interface CharacterResponse {
    data: Character[],
    links: Links[]
}

interface Character {
    id: string,
    type: string,
    attributes: Attributes,
}

interface Attributes {
    name: string,
    slug: string,
    alias_names: alias[],
    animagus: string,
    blood_status: string,
    boggart: string,
    born: string,
    died: string,
    eye_color: string,
    family_members: family[],
    gender: string,
    hair_color: string,
    height: string,
    house: string,
    image: string,
    jobs: Jobs[],
    marital_status: string,
    nationality: string,
    patronus: string,
    romances: Romances[],
    skin_color: string,
    species: string,
    titles: Titles[],
    wands: Wands[],
}

interface alias {
    alias_names: string,
}

interface family {
    family_members: string,
}

interface Jobs {
    jobs: string,
}

interface Romances {
    romances: string,
}

interface Titles {
    titles: string,
}

interface Wands {
    wands: string,
}

interface Links {
    links: string
}

interface SpellsResponse {
    data: Spells[],
    links: SpellLinks;
}

interface Spells {
    id: string,
    type: string,
    attributes: SpellAttributes;
}

interface SpellAttributes {
    category: string,
    creator: string,
    effect: string,
    hand: string,
    image: string,
    incantation: string,
    light: string,
    name: string,
    slug: string
}

interface SpellLinks {
    self: string
    next?: string
}

interface PotionsResponse {
    data: Potions[],
    links: PotionLinks
}

interface PotionLinks {
    self: string,
    next?: string
}

interface Potions {
    id: string,
    type: string,
    attributes: PotionAttributes,
}

interface PotionAttributes {
    slug: string,
    characteristics: string,
    difficulty: string,
    effect: string,
    image: string,
    inventors: string,
    ingredients: string,
    manufacturers: string,
    name: string,
    side_effects: string,
}

interface QuestionsResponse {
    questions: Questions[],
}

interface Questions {
    id: number,
    question: string,
    correctAnswer: string
    wrongAnswers: string[]
}

interface HighscoreUser {
    name: string,
    points: number
}


export {CharacterResponse, Character, SpellsResponse, Spells, PotionsResponse, Potions, QuestionsResponse, Questions, HighscoreUser}