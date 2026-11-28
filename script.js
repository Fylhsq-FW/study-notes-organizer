//обрано фреймворк Vue 3, оскільки він підключається одним CDN-скриптом без збірки та Babel і дозволяє декларативно керувати станом списку.
const API_URL = 'https://jsonplaceholder.typicode.com/posts?userId=2';
console.log('script.js підключено');

//те що було у минулих практичних, я видалив 

const DB_NAME = 'StudyNotesDB';
const DB_VERSION = 1;
const STORE_NAME = 'notes';

const STORAGE_KEY = 'studyNotes';

const DEFAULT_NOTES = [
    {
        id: 1,
        subject: 'Вища математика',
        title: 'Тема 1: Невизначені інтеграли',
        text: 'Таблиця основних інтегралів та метод заміни змінної.',
        pages: 45,
        date: '2026-11-20',
        learned: false
    },
    {
        id: 2,
        subject: 'Програмування',
        title: 'Тема 1: Вказівники та пам’ять у C++',
        text: 'Робота з динамічною пам’яттю, new/delete та посиланнями.',
        pages: 60,
        date: '2026-11-22',
        learned: false
    },
    {
        id: 3,
        subject: 'Бази даних',
        title: 'Тема 1: SQL та реляційна модель',
        text: 'Нормальні форми, первинні та зовнішні ключі.',
        pages: 30,
        date: '2026-11-24',
        learned: false
    },
    {
        id: 4,
        subject: "Комп'ютерні мережі",
        title: 'Тема 1: Семирівнева модель OSI',
        text: 'Функції рівнів моделі OSI та базові протоколи.',
        pages: 25,
        date: '2026-11-25',
        learned: false
    },
    {
        id: 5,
        subject: 'Алгоритми',
        title: 'Тема 1: Сортування масивів (QuickSort)',
        text: 'Вибір опорного елемента, складність O(n log n).',
        pages: 50,
        date: '2026-11-27',
        learned: false
    }
];

function saveToLocalStorage(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function loadFromLocalStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        console.error('Пошкоджені дані в localStorage:', error);
        return null;
    }
}

function openDB() {
    return new Promise((resolve, reject) => {
        if (!('indexedDB' in window)) {
            reject(new Error('Ваш браузер не підтримує IndexedDB'));
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// додавання нового конспекту до сховища IndexedDB
async function addItem(item) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put({ ...item });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

// оновлення наявного конспекту в IndexedDB за його id
async function updateItem(item) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put({ ...item });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

// зчитування всіх конспектів зі сховища IndexedDB
async function getAllItems() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const request = tx.objectStore(STORE_NAME).getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// видалення конспекту за його id зі сховища IndexedDB
async function deleteItem(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

const MIGRATED_KEY = 'studyNotesMigrated';

// однораз перенесення конспектів із localStorage в IndexedDB
async function migrateFromLocalStorage() {
    if (localStorage.getItem(MIGRATED_KEY) === 'true') {
        return;
    }

    const existingItems = await getAllItems();
    const localItems = loadFromLocalStorage();

    if (existingItems.length === 0 && localItems && localItems.length > 0) {
        for (const item of localItems) {
            await addItem(item);
        }
    }

    localStorage.setItem(MIGRATED_KEY, 'true');
}

const NoteSummary = {
    props: ['note'],
    emits: ['toggleLearned', 'editNote', 'deleteNote'],
    template: `
        <article 
            class="card" 
            :class="{ 'exam-soon': note.learned }" 
            style="cursor: pointer;"
            @click="$emit('toggleLearned', note.id)"
        >
            <h3>{{ note.title }}</h3>
            <p>Предмет: {{ note.subject }} ({{ note.pages }} стор.)</p>
            <p v-if="note.text">{{ note.text }}</p>
            <p><small>Дата: {{ note.date }}</small></p>
            <p>{{ note.learned ? '✅ Вивчено' : '📖 Ще не вивчено' }}</p>
            <div style="margin-top: 8px; display: flex; gap: 8px;">
                <button type="button" @click.stop="$emit('editNote', note)">Редагувати</button>
                <button type="button" @click.stop="$emit('deleteNote', note.id)">Видалити</button>
            </div>
        </article>
    `
};

const app = Vue.createApp({
    components: {
        NoteSummary
    },
    data() {
        return {
            notes: [],
            dbError: '',
            selectedSubject: '',
            editingId: null,
            form: {
                subject: '',
                title: '',
                text: '',
                pages: 15
            }
        };
    },
    async mounted() {
        await this.initDB();
    },
    computed: {
        filteredNotes() {
            if (!this.selectedSubject) return this.notes;
            return this.notes.filter((note) => note.subject === this.selectedSubject);
        },
        //кількість вивчених конспектів у поточному списку
        learnedCount() {
            return this.filteredNotes.filter((note) => note.learned).length;
        },
        //відсоток вивчених конспектів прогрес-бару
        learnedPercent() {
            if (this.filteredNotes.length === 0) return 0;
            return Math.round((this.learnedCount / this.filteredNotes.length) * 100);
        }
    },
    methods: {
        async initDB() {
            try {
                await migrateFromLocalStorage();
                let items = await getAllItems();

                if (items.length === 0) {
                    for (const item of DEFAULT_NOTES) {
                        await addItem(item);
                    }
                    items = await getAllItems();
                }

                this.notes = items;
            } catch (error) {
                console.error('Помилка роботи з IndexedDB:', error);
                this.dbError = 'Не вдалося відкрити базу даних IndexedDB у браузері (можливо, увімкнено приватний режим).';
            }
        },
        async saveNote() {
            try {
                if (this.editingId) {
                    const existing = this.notes.find((item) => item.id === this.editingId);
                    if (existing) {
                        await updateItem({
                            ...existing,
                            subject: this.form.subject,
                            title: this.form.title,
                            text: this.form.text,
                            pages: Number(this.form.pages) || 1
                        });
                    }
                    this.editingId = null;
                } else {
                    await addItem({
                        id: Date.now(),
                        subject: this.form.subject,
                        title: this.form.title,
                        text: this.form.text,
                        pages: Number(this.form.pages) || 1,
                        date: new Date().toISOString().slice(0, 10),
                        learned: false
                    });
                }

                this.notes = await getAllItems();
                this.resetForm();
            } catch (error) {
                console.error('Помилка збереження конспекту:', error);
                this.dbError = 'Не вдалося зберегти конспект у базу даних.';
            }
        },
        startEdit(note) {
            this.editingId = note.id;
            this.form = {
                subject: note.subject,
                title: note.title,
                text: note.text || '',
                pages: note.pages
            };
        },
        cancelEdit() {
            this.editingId = null;
            this.resetForm();
        },
        async deleteNote(id) {
            try {
                await deleteItem(id);
                if (this.editingId === id) {
                    this.cancelEdit();
                }
                this.notes = await getAllItems();
            } catch (error) {
                console.error('Помилка видалення конспекту:', error);
                this.dbError = 'Не вдалося видалити конспект із бази даних.';
            }
        },
        async toggleLearned(id) {
            const note = this.notes.find((item) => item.id === id);
            if (!note) return;

            try {
                await updateItem({
                    ...note,
                    learned: !note.learned
                });
                this.notes = await getAllItems();
            } catch (error) {
                console.error('Помилка оновлення статусу:', error);
                this.dbError = 'Не вдалося оновити статус конспекту.';
            }
        },
        resetForm() {
            this.form = {
                subject: '',
                title: '',
                text: '',
                pages: 15
            };
        }
    }
});

app.mount('#app');