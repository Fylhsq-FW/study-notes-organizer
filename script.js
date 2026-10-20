console.log('script.js підключено');

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

countNotesPerSubject(notes);

console.log('класифікація конспектів за термінами іспитів');

for (let i = 0; i < notes.length; i++) {
    let note = notes[i];
    
    let classification = note.examSoon ? '🚨горить (іспит скоро)' : '✅спокійно';
    
    console.log(`предмет: ${note.subject} — ${classification}`);
}


const pagesPerDay = (pages, daysLeft) => Math.ceil(pages / daysLeft);

console.log('розрахунок темпу читання');
console.log(`Вища математика (45 стор., 5 днів): ${pagesPerDay(45, 5)} стор./день`);
console.log(`Програмування (60 стор., 4 дні): ${pagesPerDay(60, 4)} стор./день`);