//обрано фреймворк Vue 3, оскільки він підключається одним CDN-скриптом без збірки та Babel і дозволяє декларативно керувати станом списку.
const API_URL = 'https://jsonplaceholder.typicode.com/posts?userId=2';
console.log('script.js підключено');

//те що було у минулих практичних, я видалив 

const NoteSummary = {
    props: ['id', 'subject', 'topic', 'pages', 'learned'],
    emits: ['toggleLearned'],
    template: `
        <article 
            class="card" 
            :class="{ 'exam-soon': learned }" 
            style="cursor: pointer;"
            @click="$emit('toggleLearned', id)"
        >
            <h3>{{ topic }}</h3>
            <p>Предмет: {{ subject }} ({{ pages }} стор.)</p>
            <p>{{ learned ? '✅ Вивчено' : '📖 Ще не вивчено' }}</p>
        </article>
    `
};

const app = Vue.createApp({
    components: {
        NoteSummary
    },
    data() {
        return {
            notes: [
                {
                    id: 1,
                    subject: 'Вища математика',
                    topic: 'Тема 1: Невизначені інтеграли',
                    pages: 45,
                    learned: false
                },
                {
                    id: 2,
                    subject: 'Програмування',
                    topic: 'Тема 1: Вказівники та пам’ять у C++',
                    pages: 60,
                    learned: false
                },
                {
                    id: 3,
                    subject: 'Бази даних',
                    topic: 'Тема 1: SQL та реляційна модель',
                    pages: 30,
                    learned: false
                },
                {
                    id: 4,
                    subject: "Комп'ютерні мережі",
                    topic: 'Тема 1: Семирівнева модель OSI',
                    pages: 25,
                    learned: false
                },
                {
                    id: 5,
                    subject: 'Алгоритми',
                    topic: 'Тема 1: Сортування масивів (QuickSort)',
                    pages: 50,
                    learned: false
                }
            ]
        };
    },
    methods: {
        toggleLearned(id) {
            const note = this.notes.find((item) => item.id === id);
            if (note) {
                note.learned = !note.learned;
            }
        }
    }
});

app.mount('#app');