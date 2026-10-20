console.log('script.js підключено');

// дані конспектів
const notes = [
    { 
        subject: 'Вища математика', 
        pages: 45, 
        examSoon: true },
    { 
        subject: 'Програмування', 
        pages: 60, 
        examSoon: false },
    { 
        subject: 'Бази даних', 
        pages: 30, 
        examSoon: true },
    { 
        subject: "Комп'ютерні мережі", 
        pages: 25, 
        examSoon: false },
    { 
        subject: 'Алгоритми', 
        pages: 50, 
        examSoon: true }
];

/**
 * фукнція підраховує загальну кількість конспектів для кожного предмета за 
 * допомогою класичного циклу for та виводить результат в об'єкті
 */
function countNotesPerSubject(notesArray) {
    let subjectCounts = {};
    
    for (let i = 0; i < notesArray.length; i++) {
        let subject = notesArray[i].subject;
        if (subjectCounts[subject]) {
            subjectCounts[subject]++;
        } else {
            subjectCounts[subject] = 1;
        }
    }
    
    console.log('Кількість конспектів по кожному предмету:', subjectCounts);
}

// виклик першої функції 
countNotesPerSubject(notes);

/**
 * умовна класифікація конспектів залежно від наближення іспиту
 */
console.log('класифікація конспектів за термінами іспитів');

for (let i = 0; i < notes.length; i++) {
    let note = notes[i];
    
    let classification = note.examSoon ? '🚨горить (іспит скоро)' : '✅спокійно';
    
    console.log(`предмет: ${note.subject} — ${classification}`);
}

/**
 * стрілкова функція для розрахунку темпу підготовки:обчислює кількість сторінок, 
 * які потрібно читати щодня
 */
const pagesPerDay = (pages, daysLeft) => Math.ceil(pages / daysLeft);

// виклик стрілкової функції
console.log('розрахунок темпу читання');
console.log(`Вища математика (45 стор., 5 днів): ${pagesPerDay(45, 5)} стор./день`);
console.log(`Програмування (60 стор., 4 дні): ${pagesPerDay(60, 4)} стор./день`);

const listContainer = document.querySelector('#notes-list');

const staticCard = document.querySelector('.card');
if (staticCard) {
    staticCard.remove();
}

const notesCountElement = document.querySelector('#notes-count');

function renderNotes(notesArray) {
    listContainer.innerHTML = '';

    notesArray.forEach(note => {
        const card = document.createElement('article');
        card.classList.add('card');
        card.setAttribute('data-subject', note.subject);

        if (note.examSoon) {
            card.classList.add('exam-soon');
        }

        const title = document.createElement('h3');
        title.textContent = note.topic;

        const subjectP = document.createElement('p');
        subjectP.textContent = `Предмет: ${note.subject}`;

        card.append(title, subjectP);
        listContainer.append(card);
    });

    if (notesCountElement) {
        notesCountElement.textContent = `Загальна кількість конспектів: ${notesArray.length}`;
    }
}

renderNotes(notes);