console.log('script.js підключено');

// дані конспектів
const notes = [
    { 
        subject: 'Вища математика', 
        topic: 'Тема 1: Невизначені інтеграли',
        pages: 45, 
        examSoon: true 
    },
    { 
        subject: 'Програмування', 
        topic: 'Тема 1: Вказівники та пам’ять у C++',
        pages: 60, 
        examSoon: false 
    },
    { 
        subject: 'Бази даних', 
        topic: 'Тема 1: SQL та реляційна модель',
        pages: 30, 
        examSoon: true 
    },
    { 
        subject: "Комп'ютерні мережі", 
        topic: 'Тема 1: Семирівнева модель OSI',
        pages: 25, 
        examSoon: false 
    },
    { 
        subject: 'Алгоритми', 
        topic: 'Тема 1: Сортування масивів (QuickSort)',
        pages: 50, 
        examSoon: true 
    }
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
 * стрілкова функція для розрахунку темпу підготовки: обчислює кількість сторінок, 
 * які потрібно читати щодня
 */
const pagesPerDay = (pages, daysLeft) => Math.ceil(pages / daysLeft);

// виклик стрілкової функції
console.log('розрахунок темпу читання');
console.log(`Вища математика (45 стор., 5 днів): ${pagesPerDay(45, 5)} стор./день`);
console.log(`Програмування (60 стор., 4 дні): ${pagesPerDay(60, 4)} стор./день`);

// вибір контейнера списку конспектів та видалення статичної заглушки саме з нього
const listContainer = document.querySelector('#notes-list');

if (listContainer) {
    const staticCard = listContainer.querySelector('.card');
    if (staticCard) {
        staticCard.remove();
    }
}

const notesCountElement = document.querySelector('#notes-count');

/**
 * функція рендерить конспекти на сторінці та оновлює загальну кількість конспектів
 */
function renderNotes(notesArray) {
    if (!listContainer) return;
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