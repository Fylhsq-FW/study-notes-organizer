const API_URL = 'https://jsonplaceholder.typicode.com/posts?userId=2';

console.log('script.js підключено');

// дані конспектів
let notes = [
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

    notesArray.forEach((note, index) => {
        const card = document.createElement('article');
        card.classList.add('card');
        card.setAttribute('data-subject', note.subject);

        if (note.examSoon) {
            card.classList.add('exam-soon');
        }

        const title = document.createElement('h3');
        title.textContent = note.topic;

        const subjectP = document.createElement('p');
        subjectP.textContent = `Предмет: ${note.subject} (${note.pages} стор.)`;

        const bodyP = document.createElement('p');
        bodyP.textContent = note.body ? note.body : '';

        const examLabel = document.createElement('label');
        examLabel.classList.add('exam-checkbox-label');

        const examCheckbox = document.createElement('input');
        examCheckbox.type = 'checkbox';
        examCheckbox.classList.add('exam-soon-checkbox');
        examCheckbox.checked = note.examSoon;
        examCheckbox.dataset.index = index;

        examLabel.append(examCheckbox, ' Скоро іспит');

        card.append(title, subjectP, bodyP, examLabel);
        listContainer.append(card);
    });

    if (notesCountElement) {
        notesCountElement.textContent = `Загальна кількість конспектів: ${notesArray.length}`;
    }
}

renderNotes(notes);

const noteForm = document.querySelector('#note-form');
const subjectSelect = document.querySelector('#subject-select');
const topicInput = document.querySelector('#topic-input');
const pagesInput = document.querySelector('#pages-input');

// обробник надсилання форми додавання нового конспекту без перезавантаження
noteForm.addEventListener('submit', (event) => {
    event.preventDefault(); 

    const subject = subjectSelect.value; 
    const topic = topicInput.value.trim();
    const pages = Number(pagesInput.value);

    const newNote = { 
        subject: subject,
        topic: topic,
        pages: pages,
        examSoon: false
    };

    notes.push(newNote);
    renderNotes(notes);
    noteForm.reset();
});

// додаткова клієнтська валідація поля теми конспекту (мінімум 3 символи)
topicInput.addEventListener('input', () => {
    const trimmedValue = topicInput.value.trim();
    if (trimmedValue.length > 0 && trimmedValue.length < 3) {
        topicInput.setCustomValidity('Тема конспекту має містити щонайменше 3 символи!');
    } else {
        topicInput.setCustomValidity('');
    }
});

// делегування події change для перемикання статусу "Скоро іспит" у картках
listContainer.addEventListener('change', (event) => {
    if (event.target.classList.contains('exam-soon-checkbox')) {
        const index = Number(event.target.dataset.index);
        const isChecked = event.target.checked;

        notes[index].examSoon = isChecked;

        const card = event.target.closest('.card');
        if (card) {
            card.classList.toggle('exam-soon', isChecked);
        }
    }
});

const loadingStatus = document.querySelector('#loading-status');
const errorMessage = document.querySelector('#error-message');
const reloadBtn = document.querySelector('#reload-btn');

// завантаження конспектів з  https://jsonplaceholder.typicode.com/posts?userId=2
async function loadNotes() {
    if (loadingStatus) loadingStatus.hidden = false;
    if (errorMessage) errorMessage.hidden = true;
    if (reloadBtn) reloadBtn.disabled = true;

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Помилка HTTP: статус ${response.status}`);
        }

        const data = await response.json();
        console.log('Отримані дані з API:', data);

        notes = data.map((item) => ({
            subject: 'ПВЗ (API)',
            topic: item.title,
            body: item.body,
            pages: Math.max(5, Math.round(item.body.length / 10)),
            examSoon: false
        }));

        renderNotes(notes);
    } catch (error) {
        console.error('Помилка під час завантаження конспектів:', error);
        if (errorMessage) {
            errorMessage.textContent = 'Конспекти тимчасово недоступні';
            errorMessage.hidden = false;
        }
    } finally {
        if (loadingStatus) loadingStatus.hidden = true;
        if (reloadBtn) reloadBtn.disabled = false;
    }
}

if (reloadBtn) {
    reloadBtn.addEventListener('click', loadNotes);
}

loadNotes();