import { CharacterResponse, Character, SpellsResponse, Spells, PotionsResponse, Potions, QuestionsResponse, Questions, HighscoreUser} from "./models/interfaces";

window.addEventListener('load', () : void => {
    const searchCharacterRef : HTMLButtonElement = document.querySelector('#searchBtn');
    searchCharacterRef.addEventListener('click', (event: MouseEvent) : void => {
        event.preventDefault();
        const mainRef = document.querySelector('.characterSearchResult') as HTMLElement;
        mainRef.innerHTML = '';
        getCharacters();
    })
}) 

//Hämatar alla karakärer utifrån sökningen
async function getCharacters() : Promise<void> {
    const inputref = document.querySelector('#search') as HTMLInputElement;
    const inputValue : string = inputref.value.toLowerCase();
    inputref.value = '';

    if (inputValue === '') {
        console.log('You have not written anything')
    } else {
        const url = `https://api.potterdb.com/v1/characters?filter[name_cont]=${inputValue}`;
        const response = await getApi(url)
        console.log('Response:', response);

        if (!response) {
            console.log('Something went wrong')
            return;
        } else {
            const characterInfo = response.data;

            if (characterInfo.length === 0) {
                console.log('Did not find any character');
            } else {
                console.log('Character info:', characterInfo)
                renderCharacter (characterInfo);
            }
        }
    }
}

//Hämtar api och skickar tillbaka datan
async function getApi(url : string) : Promise<CharacterResponse> | null {
    try {
        const response : Response = await fetch(url)
        if(!response.ok){
            throw new Error('Problem when fetching api, the response was not ok.');
        } else {
            const data : CharacterResponse = await response.json();
            console.log(data)
            return data;
        }
    }
    catch(error) {
        console.log(error)
    }
}

//Skriver ut hämtade karaktärer på sidan
function renderCharacter (characterInfo : Character[]) : void {
    const mainRef = document.querySelector('.characterSearchResult') as HTMLElement;
    let foundImage : boolean = false;
    characterInfo.forEach((character: Character) => {
        if(character.attributes.image){
            foundImage = true;
            const cardRef = document.createElement('article') as HTMLElement;
            cardRef.classList.add('cardWrapper');
            const card = `
                <article class="card">
                    <section class="card__front">
                        ${character.attributes.image ? `<img class="characterImg" src="${character.attributes.image}" alt="a picture of ${character.attributes.name}">` : ''}
                        <h2>${character.attributes.name}</h2>
                    </section>
                    <section class="card__back">
                        <p><span class="bold">Name:</span> ${character.attributes.name}</p>
                        ${character.attributes.nationality ? `<p><span class="bold">Nationality:</span> ${character.attributes.nationality}</p>` : ''}
                        ${character.attributes.born ? `<p><span class="bold">Born:</span> ${character.attributes.born}</p>` : ''}
                        ${character.attributes.died ? `<p><span class="bold">Died:</span> ${character.attributes.died}</p>` : ''}
                        ${character.attributes.gender ? `<p><span class="bold">Gender:</span> ${character.attributes.gender}</p>` : ''}
                        ${character.attributes.hair_color ? `<p><span class="bold">Hair color:</span> ${character.attributes.hair_color}</p>` : ''}
                        ${character.attributes.eye_color ? `<p><span class="bold">Eye color:</span> ${character.attributes.eye_color}</p>` : ''}
                        ${character.attributes.skin_color ? `<p><span class="bold">Skin color:</span> ${character.attributes.skin_color}</p>` : ''}
                        ${character.attributes.height ? `<p><span class="bold">Height:</span> ${character.attributes.height}</p>` : ''}
                        ${character.attributes.species ? `<p><span class="bold">Species:</span> ${character.attributes.species}</p>` : ''}
                        ${character.attributes.animagus ? `<p><span class="bold">Animagus:</span> ${character.attributes.animagus}</p>` : ''}
                        ${character.attributes.blood_status ? `<p><span class="bold">Blood Status:</span> ${character.attributes.blood_status}</p>` : ''}
                        ${character.attributes.house ? `<p><span class="bold">House:</span> ${character.attributes.house}</p>` : ''}
                        ${character.attributes.boggart ? `<p><span class="bold">Boggart:</span> ${character.attributes.boggart}</p>` : ''}
                        ${character.attributes.patronus ? `<p><span class="bold">Patronus:</span> ${character.attributes.patronus}</p>` : ''}
                        ${character.attributes.wands.length > 0 ? `<p><span class="bold">Wand:</span> ${character.attributes.wands}</p>` : ''}
                        ${character.attributes.marital_status ? `<p><span class="bold">Marital Status:</span> ${character.attributes.marital_status}</p>` : ''}
                        ${character.attributes.romances.length > 0 ? `<p><span class="bold">Romances:</span> ${character.attributes.romances}</p>` : ''}
                        ${character.attributes.jobs.length > 0 ? `<p><span class="bold">Jobs:</span> ${character.attributes.jobs}</p>` : ''}
                    </section>
                </article>
            `
            cardRef.innerHTML = card;
            mainRef.appendChild(cardRef)
        }
    })

    if(!foundImage) {
        console.log('Ingen karaktär hittades')
        const headerRef = document.createElement('h2') as HTMLElement;
        headerRef.classList.add('nothingFound')
        headerRef.innerHTML = 'No character found, try only using first or lastname'
        mainRef.appendChild(headerRef)
    }
}

//Hämtar all data från api och skickar vidare den för att rendera ut informationen på sidan.
async function getSpells() : Promise<void> {
    let url : string = 'https://api.potterdb.com/v1/spells';
    let hasMorePages = true;

    while(hasMorePages){
        const response = await getSpellsApi(url);
        if(!response) {
            console.log('Something did not work')
        } else {
            console.log('Spell Response', response)
            const spells = response.data;
            renderSpells(spells)
        }

        if(response.links.next) {
            url = response.links.next
        } else {
            hasMorePages = false;
        }
    }
}

//Hämtar trollformler och returnerar dem 
async function getSpellsApi(url : string) : Promise<SpellsResponse> | null {
    try {
        const response : Response = await fetch(url)
        if(!response.ok){
            throw new Error('Problem when fetching api, the response was not ok.');
        } else {
            const data : SpellsResponse = await response.json();
            console.log(data)
            return data;
        }
    }
    catch(error) {
        console.log(error)
    }
}

//Skriver ut alla spells på sidan
function renderSpells(spells : Spells[]) : void {
    const spellsRef = document.querySelector('.spellsPage') as HTMLElement
    spells.map(spell => {

        if(spell.attributes.image){
            const spellCard = document.createElement('article') as HTMLElement;
            spellCard.classList.add('spellCard')

            if(spell.attributes){
            spellCard.innerHTML = `
                <section>
                    <h2>${spell.attributes.name}</h2>
                    ${spell.attributes.category ? `<p><span class="bold">Category:</span> ${spell.attributes.category}</p>` : ''}
                    ${spell.attributes.incantation ? `<p><span class="bold">Incantation:</span> ${spell.attributes.incantation}</p>` : ''}
                    ${spell.attributes.effect ? `<p><span class="bold">Effect:</span> ${spell.attributes.effect}</p>` : ''}
                    ${spell.attributes.light ? `<p><span class="bold">Light:</span> ${spell.attributes.light}</p>` : ''}
                    ${spell.attributes.hand ? `<p><span class="bold">Handmovement:</span> ${spell.attributes.hand}</p>` : ''}
                </section>
                ${spell.attributes.image ? `<section class="spellWrapper"><img class="spell__image" src="${spell.attributes.image}" alt="a image of the spell ${spell.attributes.name}"/></section>` : ''}
            `
            spellsRef.appendChild(spellCard)
            }
        }
    })
}

//Hämtar all data från api och skickar vidare den för att rendera ut informationen på sidan.
async function potions() : Promise<void> {
    let url : string = 'https://api.potterdb.com/v1/potions';
    let hasMorePages = true;

    while(hasMorePages){
        const response = await getPotions(url);
        if(!response) {
            console.log('Something did not work')
        } else {
            console.log('Potion Response', response)
            const potions = response.data;
            console.log(potions)
            renderPotions(potions)
        }

        if(response.links.next) {
            url = response.links.next
        } else {
            hasMorePages = false;
        }
    }
}

//Skriver ut alla potions på sidan
function renderPotions(potions : Potions[]) : void {
    const potionsRef = document.querySelector('.potionsPage') as HTMLElement
    potions.map(potion => {

        if(potion.attributes.image){
            const potionCard = document.createElement('article') as HTMLElement;
            potionCard.classList.add('potionCard')

            if(potion.attributes.image){
            potionCard.innerHTML = `
                <section>
                    <h2>${potion.attributes.name}</h2>
                    ${potion.attributes.effect ? `<p><span class="bold">Effect:</span> ${potion.attributes.effect}</p>` : ''}
                    ${potion.attributes.ingredients ? `<p><span class="bold">Ingredients:</span> ${potion.attributes.ingredients}</p>` : ''}
                    ${potion.attributes.difficulty ? `<p><span class="bold">Difficulty:</span> ${potion.attributes.difficulty}</p>` : ''}
                    ${potion.attributes.characteristics ? `<p><span class="bold">Characteristics:</span> ${potion.attributes.characteristics}</p>` : ''}
                    ${potion.attributes.side_effects ? `<p><span class="bold">Side Effects:</span> ${potion.attributes.side_effects}</p>` : ''}
                </section>
                ${potion.attributes.image ? `<section class="potionWrapper"><img class="potion__image" src="${potion.attributes.image}" alt="a image of the spell ${potion.attributes.name}"/></section>` : ''}
            `
            potionsRef.appendChild(potionCard)
            }
        }
    })
}


//Hämtar trolldrycker och returnerar dem 
async function getPotions(url : string) : Promise<PotionsResponse> | null {
    try {
        const response : Response = await fetch(url)
        if(!response.ok){
            throw new Error('Problem when fetching api, the response was not ok.');
        } else {
            const data : PotionsResponse = await response.json();
            console.log(data)
            return data;
        }
    }
    catch(error) {
        console.log(error)
    }
}

// Här hämtas navigeringsknapparna in 
const toggleBtn = document.querySelector('.toggle') as HTMLElement;
const nav = document.querySelector('nav') as HTMLElement;
const spellsBtn = document.querySelector('.btn__spells') as HTMLElement;
const characterBtn = document.querySelector('.btn__character') as HTMLElement;
const potionsBtn = document.querySelector('.btn__potions') as HTMLElement;
const quizBtn = document.querySelector('.btn__quiz') as HTMLElement;

// Här hämtas de olika sidorna in 
const spellsPage = document.querySelector('.spells__page') as HTMLElement;
const characterPage = document.querySelector('.characters__page') as HTMLElement;
const potionsPage = document.querySelector('.potions__page') as HTMLElement;
const quizPage = document.querySelector('.quiz__page') as HTMLElement;
const winnerPage = document.querySelector('.showResult') as HTMLElement;

// Här hämtas nmenyknappens olika utseenden in
const menu = document.querySelector('.fa-bars') as HTMLElement;
const xmark = document.querySelector('.fa-xmark') as HTMLElement;

//Här är koden för menun
function toggleMenu() : void {
    nav.classList.toggle('open');
    spellsBtn.classList.toggle('slide');
    characterBtn.classList.toggle('slide');
    potionsBtn.classList.toggle('slide');
    quizBtn.classList.toggle('slide');
    togglex();
}

// Här togglas menyknapparnas utseenden
function togglex() : void {
    menu.classList.toggle('dontShow');
    xmark.classList.toggle('dontShow');
}

// Här är funktionen för att öppna spellssidan
function openSpellspage() : void {
    spellsPage.classList.remove('d-none');
}

// Här är funktionen för att stänga spellssidan
function closeSpellspage() : void {
    spellsPage.classList.add('d-none');
}

// Här är funktionen för att öppna karaktärssidan
function openCharacterPage() : void {
    characterPage.classList.remove('d-none');
}

// Här är funktionen för att stänga karaktärssidan
function closeCharacterPage() : void {
    characterPage.classList.add('d-none');
}

// Här är funktionen för att öppna trolldryckssidan
function openPotionsPage() : void {
    potionsPage.classList.remove('d-none')
}

// Här är funktionen för att stänga trolldryckssidan
function closePotionsPage() : void {
    potionsPage.classList.add('d-none')
}

// Här är funktionen för att öppna quizsidan
function openQuizPage() : void {
    quizPage.classList.remove('d-none');
}

// Här är funktionen för att stänga quizsidan
function closeQuizPage() : void {
    quizPage.classList.add('d-none');
}

// Hämtar in quizpageBtn och highscorepageBtn
const quizpageBtn = document.querySelector('.quizpageBtn') as HTMLElement;
const highscorepageBtn = document.querySelector('.highscorepageBtn') as HTMLElement

//Hämtar in sidorna för att visa quiz home page och highscore homepage
const quizhome = document.querySelector('.quizPage') as HTMLElement
const highscorehome = document.querySelector('.highScorePage') as HTMLElement

//Hämtar sidan för att kunna visa första frågan
const quizPageStarted = document.querySelector('.quizPageStarted') as HTMLElement

//Ser till att High score knappen får en aktiv färg
function activeQuizPageBtn() :  void {
    quizpageBtn.classList.remove('notActive')
    quizpageBtn.classList.add('active')
    highscorepageBtn.classList.remove('active')
    highscorepageBtn.classList.add('notActive')
}

//Ser till att Quiz page knappen får en aktiv färg
function activeHighScoreBtn() : void {
    quizpageBtn.classList.remove('active')
    quizpageBtn.classList.add('notActive')
    highscorepageBtn.classList.remove('notActive')
    highscorepageBtn.classList.add('active')  
}

//Ser till att high score sidan är aktiv
function openHighScorePage() : void {
    highscorehome.classList.remove('d-none');
    renderHighscore();
}

//Ser till att high score sidan inte är synlig
function closeHighScorePage() : void {
    highscorehome.classList.add('d-none');
}

//Ser till att username och startsidan är aktiv
function openQuizStartPage() : void {
    quizhome.classList.remove('d-none')
}
//Ser till att username och startsidan inte är synlig
function closeQuizStartPage() : void {
    quizhome.classList.add('d-none')
}

// Här är funktionen för att öppna vinnarsidan
function openWinnerPage() : void {
    winnerPage.classList.remove('d-none');
}

// Här är funktionen för att stänga vinnarsidan
function closeWinnerPage() : void {
    winnerPage.classList.add('d-none');
}

//Öppnar sidan med frågor
function openQuestionPage() : void {
    quizPageStarted.classList.remove('d-none')
}

//Stänger sidan med frågor
function closeQuestionPage() : void {
    quizPageStarted.classList.add('d-none')

    //FUNKTION SOM SER TILL ATT QUIZET AVSLUTAS!!!
}

//Vid klick på toggleBtn triggas funktionen toggleMenu
toggleBtn.addEventListener('click', toggleMenu);

/* Vid klick på Spells i menun triggas följande funktioner
    - openSpellsPage: För att öppna sidan med alla trollformler
    - closeCharacterPage: För att stänga karaktärsidan om den är öppen
    - closePotionsPage: För att stänga trolldryckssidan om den är öppen
    - closeQuizPage: För att stänga quizsidan om den är öppen
    - toggleMenu: För att toggla menun
    - getSpells: för att hämta alla trollformler
*/

spellsBtn.addEventListener('click', () => {
    openSpellspage();
    closeCharacterPage();
    closePotionsPage();
    closeQuizPage();
    toggleMenu();
    getSpells();
})

/* Vid klick på Character i menun triggas följande funktioner
    - openCharacterPage: För att öppna karaktärsidan
    - closeSpellsPage: För att stränga trollformlersidan om den är öppen
    - closePotionsPage: För att stänga trolldryckssidan om den är öppen
    - closeQuizPage: För att stänga quizsidan om den är öppen
    - toggleMenu: För att toggla menun
*/
characterBtn.addEventListener('click', () => {
    openCharacterPage();
    closeSpellspage();
    closePotionsPage();
    closeQuizPage();
    toggleMenu();
})

/* Vid klick på Potions i menun triggas följande funktioner
    - openPotionsPage: För att öppna trolldryckssidan 
    - closeSpellsPage: För att stränga trollformlersidan om den är öppen
    - closeCharacterPage: För att stänga karaktärsidan om den är öppen
    - closeQuizPage: För att stänga quizsidan om den är öppen
    - toggleMenu: För att toggla menun
    - potions: För att hämta alla trolldrycker
*/
potionsBtn.addEventListener('click', () => {
    openPotionsPage();
    closeSpellspage();
    closeCharacterPage();
    closeQuizPage();
    toggleMenu();
    potions();
})

/* Vid klick på Quiz i menun triggas följande funktioner
    - openQuizPage: För att öppna quizsidan 
    - closeSpellsPage: För att stränga trollformlersidan om den är öppen
    - closeCharacterPage: För att stänga karaktärsidan om den är öppen
    - closePotionsPage: För att stänga trolldryckssidan om den är öppen
    - openQuizStartPage: För att se till att sidan med username och starta quiz är öppen
    - closeHighScorePage: För att se till att Highscore sidan är stängd om den är öppen
    - activeQuizPageBtn: Ser till att quizpagebtn får färg och highscores knappens färg avaktiveras
    - toggleMenu: För att toggla menun
    - closeQuestionPage(): Ser till att eventuellt quiz stängs och avslutas
*/
quizBtn.addEventListener('click', () => {
    openQuizPage();
    closeSpellspage();
    closeCharacterPage();
    closePotionsPage();
    openQuizStartPage();
    closeHighScorePage();
    activeQuizPageBtn()
    toggleMenu();
    closeQuestionPage()
})

/* Vid klick på Quiz Page knappen på Quiz sidan triggas följande funktioner
    - activeQuizPageBtn: Ser till att quizpagebtn får färg och highscores knappens färg avaktiveras
    - openQuizStartPage: För att se till att sidan med username och starta quiz är öppen
    - closeHighScorePage: För att se till att Highscore sidan är stängd om den är öppen
    - closeQuestionPage(): Ser till att eventuellt quiz stängs och avslutas
*/
quizpageBtn.addEventListener('click', () => {
    activeQuizPageBtn()
    openQuizStartPage()
    closeHighScorePage()
    closeQuestionPage()
})
/* Vid klick på High Score knappen på Quiz sidan triggas följande funktioner
    - activeHighScoreBtn: Ser till att High score knappen får färg och quiz page knappens färg avaktiveras   
    - openHighScorePage: För att se till att Highscore sidan är öppen
    - closeQuizStartPage: För att se till att sidan med usernamn och starta quiz är stängd om den är öppen
    - closeQuestionPage(): Ser till att eventuellt quiz stängs och avslutas
*/
highscorepageBtn.addEventListener('click', () => {
    activeHighScoreBtn()
    openHighScorePage()
    closeQuizStartPage()
    closeQuestionPage()
})


//Läser in startQuiz knappen och input elementer
const startQuizBtn = document.querySelector('.startQuizBtn') as HTMLElement
const usernameRef = document.querySelector('.username') as HTMLInputElement

//Hämtar värdet i input elementet och returnerar
function getUsername(usernameRef : HTMLInputElement) : string {
    return usernameRef.value;
}

//Här kontrolleras att vi har ett användarnamn, och om vi har det startas funktionen quiz
startQuizBtn.addEventListener('click', (event : MouseEvent) => {
    event.preventDefault();
    let username = getUsername(usernameRef);
    console.log('username:', username)

    if(username === '') {
        usernameRef.classList.add('red');
    } else {
        console.log('username entered', username)
        openQuestionPage()
        closeQuizStartPage()
        usernameRef.classList.remove('red')
        quiz(username)
        usernameRef.value = '';
    }
})


//Här hämtar vi alla frågorna i från api och skickar vidare till startQuiz
async function quiz(username : string) : Promise<void> {
    let url : string = 'https://raw.githubusercontent.com/IdaWalther/quizQuestions/main/questions.json';

        const response = await getQuestions(url);
        if(!response) {
            console.log('Something did not work')
        } else {
            const questions = response.questions;
            startQuiz(questions, username)
        }
}

//Hämtar frågor och returnerar dem 
async function getQuestions(url : string) : Promise<QuestionsResponse> | null {
    try {
        const response : Response = await fetch(url)
        if(!response.ok){
            throw new Error('Problem when fetching api, the response was not ok.');
        } else {
            const data : QuestionsResponse = await response.json();
            return data;
        }
    }
    catch(error) {
        console.log(error)
    }
}


function startQuiz(questions : Questions[], username : string) : void {
    let questionCount: number = 0;
    let correctAnswers: number = 0;

    const firstPage = document.createElement('article')
    const questionRef = document.createElement('h2')
    const answerListRef = document.createElement('ul')
    firstPage.classList.add('questionPage')
    questionRef.classList.add('question')
    answerListRef.classList.add('answers')

    firstPage.appendChild(questionRef)
    firstPage.appendChild(answerListRef)
    quizPageStarted.appendChild(firstPage)

    //Här skapas en kopia av alla frågorna, denna array skickas till en funktion för att blandas innan den kommer tillbaka
    let questionArray : Questions[] = [...questions]
    shuffleArray(questionArray)
    showQuestions(questionArray, questionRef, answerListRef, questionCount, correctAnswers, username);
}

function showQuestions(questionArray: Questions[], questionRef: HTMLElement, answerListRef: HTMLElement, questionCount : number, correctAnswers : number, username : string) : void {
        questionRef.textContent = ''; 
        answerListRef.innerHTML = '';
        
        const question = questionArray[0];
        questionRef.textContent = question.question

        //Här skickas alla svar till en shuffle funktion för att sedan komma tillbaka
        let allAnswers = [...question.wrongAnswers, question.correctAnswer]
        shuffleArray(allAnswers)

        allAnswers.forEach(answer => {
            const answerLi = document.createElement('li')
            answerLi.textContent = answer;
            answerLi.classList.add('answer');
            answerListRef.appendChild(answerLi)

            //Här kollar vi vilket svarsalternativ vi tryckt på
            answerLi.addEventListener('click', () => {
                if (answer === question.correctAnswer) {
                    correctAnswers++;
                }  
                questionCount ++;
                questionArray.shift();

                //Om vi inte gått igenom 20 frågor, får vi en ny fråga, annars är quizet över
                if(questionCount < 20) {
                    showQuestions(questionArray, questionRef, answerListRef, questionCount, correctAnswers, username)
                } else {
                    questionRef.textContent = '';
                    answerListRef.innerHTML = '';
                    showWinnerPage(correctAnswers, username)
                }
            })
        })
}

function showWinnerPage(correctAnswers : number, username : string) : void {
    openWinnerPage()
    closeQuizPage()

    const ExistingWinnerMessage = winnerPage.querySelector('.winnerMessage');
    if(ExistingWinnerMessage) {
        ExistingWinnerMessage.remove()
    }

    const winnerMessage = document.createElement('h1')
    winnerMessage.classList.add('winnerMessage')

    if(correctAnswers < 7) {
        winnerMessage.textContent = `${username}, you suck! You only got ${correctAnswers} correct answer. You are not a true Harry Potter fan! Why are you even doing this quiz for?` 
    } else if (correctAnswers > 19) {
        winnerMessage.textContent = `${username}, you rock! You got ${correctAnswers} correct answers! You are a true Harry Potter fan!` 
    } else {
        winnerMessage.textContent = `${username}, you did a good job! You got ${correctAnswers} correct answers!`
    }
    winnerPage.appendChild(winnerMessage)

    const quizPageStarted = document.querySelector('.quizPageStarted') as HTMLElement

    const existingFirstPage = quizPageStarted.querySelector('.questionPage')
    if(existingFirstPage) {
        existingFirstPage.remove()
    }

    const existingBtn = winnerPage.querySelector('.addToHighScoreBtn');
    if (existingBtn) {
        existingBtn.remove();
    }

    const addToHighScoreBtn = document.createElement('button');
    addToHighScoreBtn.classList.add('addToHighScoreBtn');
    addToHighScoreBtn.textContent = 'Add Highscore';
    winnerPage.appendChild(addToHighScoreBtn);

    addToHighScoreBtn.addEventListener('click', () => {
        winnerMessage.remove();
        console.log('addToHighScore clicked');
        closeWinnerPage();
        winnerPage.textContent = '';
        saveHighScore(correctAnswers, username);
        openQuizPage();
        openHighScorePage();
        closeQuizStartPage()
        activeHighScoreBtn()
    })
}

function saveHighScore(correctAnswers : number, username : string) : void {
    console.log(username, ' du sparade', correctAnswers, ' poäng till din HighScore')
    let highScores : HighscoreUser[] = JSON.parse(localStorage.getItem('highScores') || '[]')
    const user : HighscoreUser = {
        name : username,
        points : correctAnswers
    }
    highScores.push(user)
    localStorage.setItem('highScores', JSON.stringify(highScores))
}

function renderHighscore() : void {
    const highscoreOl = document.querySelector('.highscoreList') as HTMLElement;
    highscoreOl.innerHTML = '';

    let local = localStorage.getItem('highScores');
    if(!local){
        let highscoreLi = document.createElement('li');
        highscoreLi.textContent = "It looks empty, maybe you can be the first?";
        highscoreOl.appendChild(highscoreLi);
    } else {
        let highScores : HighscoreUser[] = JSON.parse(local);
        highScores.sort((a, b) => b.points - a.points);
        highScores.forEach((user ) => {
            let highscoreLi = document.createElement('li');
            highscoreLi.textContent = `${user.name}: ${user.points} points`;
            highscoreOl.appendChild(highscoreLi);
        })
    }
}

function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j: number = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}