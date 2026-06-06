const books = [
    {
        id: 1,
        title: "Война и мир",
        author: "Лев Толстой",
        genre: "Классика",
        cover: "classic",
        description: "Роман-эпопея о жизни русского общества в период войны 1812 года. Книга показывает судьбы нескольких семей и связь личных решений с историческими событиями."
    },
    {
        id: 2,
        title: "451 градус по Фаренгейту",
        author: "Рэй Брэдбери",
        genre: "Фантастика",
        cover: "science",
        description: "Антиутопия о мире, где книги запрещены, а пожарные занимаются их уничтожением. Произведение поднимает тему ценности чтения и самостоятельного мышления."
    },
    {
        id: 3,
        title: "Приключения Шерлока Холмса",
        author: "Артур Конан Дойл",
        genre: "Детектив",
        cover: "detective",
        description: "Сборник детективных рассказов о Шерлоке Холмсе и докторе Ватсоне. В центре сюжета находятся расследования, логика и внимательность к мелким деталям."
    },
    {
        id: 4,
        title: "Основы веб-разработки",
        author: "Учебное пособие",
        genre: "Учебная",
        cover: "study",
        description: "Учебный материал для знакомства с HTML, CSS и JavaScript. Подходит для начинающих, которые изучают создание простых веб-страниц и интерфейсов."
    },
    {
        id: 5,
        title: "Мастер и Маргарита",
        author: "Михаил Булгаков",
        genre: "Классика",
        cover: "classic",
        description: "Роман, объединяющий сатиру, философские мотивы и фантастические элементы. В книге переплетаются московская история и линия о Понтии Пилате."
    },
    {
        id: 6,
        title: "Таинственный остров",
        author: "Жюль Верн",
        genre: "Фантастика",
        cover: "science",
        description: "Приключенческий роман о группе людей, оказавшихся на необитаемом острове. Герои используют знания и изобретательность, чтобы выжить и обустроить жизнь."
    },
    {
        id: 7,
        title: "Робинзон Крузо",
        author: "Даниэль Дефо",
        genre: "Приключения",
        cover: "adventure",
        description: "Роман о моряке, который после кораблекрушения оказывается на необитаемом острове. Герой учится выживать, строить быт и не терять надежду."
    },
    {
        id: 8,
        title: "Гордость и предубеждение",
        author: "Джейн Остин",
        genre: "Роман",
        cover: "novel",
        description: "Классический роман о семье, воспитании, личном выборе и отношениях между людьми. В центре сюжета находится история Элизабет Беннет."
    },
    {
        id: 9,
        title: "Хоббит",
        author: "Джон Р. Р. Толкин",
        genre: "Фэнтези",
        cover: "fantasy",
        description: "История о путешествии Бильбо Бэггинса, который отправляется в опасное приключение вместе с гномами. Книга знакомит читателя с волшебным миром Средиземья."
    }
];

let selectedBooks = [];
let favoriteBooks = [];
let bookRatings = {};
let activeBookId = null;
let activeView = "all";

const booksGrid = document.getElementById("booksGrid");
const searchInput = document.getElementById("searchInput");
const genreSelect = document.getElementById("genreSelect");
const genreButtons = document.getElementById("genreButtons");
const viewTabs = document.getElementById("viewTabs");
const booksCount = document.getElementById("booksCount");
const selectedCount = document.getElementById("selectedCount");
const selectedList = document.getElementById("selectedList");
const selectedEmpty = document.getElementById("selectedEmpty");
const emptyMessage = document.getElementById("emptyMessage");
const addBookForm = document.getElementById("addBookForm");
const newTitle = document.getElementById("newTitle");
const newAuthor = document.getElementById("newAuthor");
const newGenre = document.getElementById("newGenre");
const bookModal = document.getElementById("bookModal");
const modalClose = document.getElementById("modalClose");
const modalGenre = document.getElementById("modalGenre");
const modalTitle = document.getElementById("modalTitle");
const modalAuthor = document.getElementById("modalAuthor");
const modalDescription = document.getElementById("modalDescription");
const ratingButtons = document.getElementById("ratingButtons");
const themeToggle = document.getElementById("themeToggle");

function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function getBooksWord(count) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastDigit === 1 && lastTwoDigits !== 11) {
        return "книга";
    }

    if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
        return "книги";
    }

    return "книг";
}

function getFilteredBooks() {
    const searchValue = searchInput.value.trim().toLowerCase();
    const genreValue = genreSelect.value;

    return books.filter((book) => {
        const matchesSearch = book.title.toLowerCase().includes(searchValue)
            || book.author.toLowerCase().includes(searchValue);
        const matchesGenre = genreValue === "all" || book.genre === genreValue;
        const matchesView = activeView === "all" || favoriteBooks.includes(book.id);

        return matchesSearch && matchesGenre && matchesView;
    });
}

function getCoverByGenre(genre) {
    if (genre === "Детектив") {
        return "detective";
    }

    if (genre === "Учебная") {
        return "study";
    }

    if (genre === "Фантастика") {
        return "science";
    }

    if (genre === "Приключения") {
        return "adventure";
    }

    if (genre === "Роман") {
        return "novel";
    }

    if (genre === "Фэнтези") {
        return "fantasy";
    }

    return "classic";
}

function renderGenreButtons() {
    genreButtons.innerHTML = "";

    Array.from(genreSelect.options).forEach((option) => {
        const button = document.createElement("button");
        button.className = `genre-filter ${option.value === genreSelect.value ? "active" : ""}`;
        button.type = "button";
        button.dataset.genre = option.value;
        button.textContent = option.textContent;
        genreButtons.appendChild(button);
    });
}

function renderViewTabs() {
    const tabs = viewTabs.querySelectorAll("button");

    tabs.forEach((tab) => {
        const isActive = tab.dataset.view === activeView;
        tab.classList.toggle("active", isActive);

        if (tab.dataset.view === "favorites") {
            tab.textContent = `Избранное (${favoriteBooks.length})`;
        }
    });
}

function renderBooks() {
    const filteredBooks = getFilteredBooks();

    booksGrid.innerHTML = "";
    renderViewTabs();
    renderGenreButtons();
    booksCount.textContent = `${filteredBooks.length} ${getBooksWord(filteredBooks.length)}`;
    emptyMessage.classList.toggle("show", filteredBooks.length === 0);

    filteredBooks.forEach((book) => {
        const isSelected = selectedBooks.includes(book.id);
        const isFavorite = favoriteBooks.includes(book.id);
        const card = document.createElement("article");
        card.className = "book-card";
        const safeTitle = escapeHtml(book.title);
        const safeAuthor = escapeHtml(book.author);
        const safeGenre = escapeHtml(book.genre);

        card.innerHTML = `
            <div class="cover ${book.cover}">
                <button class="favorite-button ${isFavorite ? "active" : ""}" type="button" data-action="favorite" data-id="${book.id}" aria-label="Добавить в избранное">
                    ${isFavorite ? "★" : "☆"}
                </button>
                <span class="cover-title">${safeTitle}</span>
            </div>
            <div class="book-info">
                <h3>${safeTitle}</h3>
                <p class="author">${safeAuthor}</p>
                <p class="genre">${safeGenre}</p>
                <div class="book-actions">
                    <button class="details-button" type="button" data-action="details" data-id="${book.id}">Подробнее</button>
                    <button class="${isSelected ? "added" : ""}" type="button" data-action="select" data-id="${book.id}">
                        ${isSelected ? "В списке" : "Добавить"}
                    </button>
                </div>
            </div>
        `;

        booksGrid.appendChild(card);
    });
}

function renderSelectedBooks() {
    selectedList.innerHTML = "";
    selectedCount.textContent = selectedBooks.length;
    selectedEmpty.classList.toggle("show", selectedBooks.length === 0);

    selectedBooks.forEach((bookId) => {
        const book = books.find((item) => item.id === bookId);

        if (!book) {
            return;
        }

        const item = document.createElement("li");
        const safeTitle = escapeHtml(book.title);
        const safeAuthor = escapeHtml(book.author);
        item.innerHTML = `
            <div>
                <strong>${safeTitle}</strong>
                <span>${safeAuthor}</span>
            </div>
            <button class="remove-button" type="button" data-id="${book.id}" aria-label="Убрать книгу">x</button>
        `;

        selectedList.appendChild(item);
    });
}

function updatePage() {
    renderBooks();
    renderSelectedBooks();
}

function setTheme(isDark) {
    document.body.classList.toggle("dark-theme", isDark);
    themeToggle.textContent = isDark ? "Светлая тема" : "Темная тема";
    localStorage.setItem("libraryTheme", isDark ? "dark" : "light");
}

function renderRatingButtons() {
    ratingButtons.innerHTML = "";
    const currentRating = bookRatings[activeBookId] || 0;

    for (let value = 1; value <= 5; value++) {
        const button = document.createElement("button");
        button.className = `rating-button ${value <= currentRating ? "active" : ""}`;
        button.type = "button";
        button.dataset.rating = value;
        button.textContent = value;
        ratingButtons.appendChild(button);
    }
}

function openBookModal(bookId) {
    const book = books.find((item) => item.id === bookId);

    if (!book) {
        return;
    }

    activeBookId = bookId;
    modalGenre.textContent = book.genre;
    modalTitle.textContent = book.title;
    modalAuthor.textContent = book.author;
    modalDescription.textContent = book.description || "Описание для этой книги пока не добавлено.";
    renderRatingButtons();
    bookModal.classList.add("show");
    bookModal.setAttribute("aria-hidden", "false");
}

function closeBookModal() {
    bookModal.classList.remove("show");
    bookModal.setAttribute("aria-hidden", "true");
    activeBookId = null;
}

booksGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const bookId = Number(button.dataset.id);

    if (button.dataset.action === "details") {
        openBookModal(bookId);
        return;
    }

    if (button.dataset.action === "favorite") {
        if (favoriteBooks.includes(bookId)) {
            favoriteBooks = favoriteBooks.filter((id) => id !== bookId);
        } else {
            favoriteBooks.push(bookId);
        }

        updatePage();
        return;
    }

    if (selectedBooks.includes(bookId)) {
        selectedBooks = selectedBooks.filter((id) => id !== bookId);
    } else {
        selectedBooks.push(bookId);
    }

    updatePage();
});

selectedList.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const bookId = Number(button.dataset.id);
    selectedBooks = selectedBooks.filter((id) => id !== bookId);
    updatePage();
});

searchInput.addEventListener("input", renderBooks);
genreSelect.addEventListener("change", renderBooks);

viewTabs.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    activeView = button.dataset.view;
    renderBooks();
});

genreButtons.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    genreSelect.value = button.dataset.genre;
    renderBooks();
});

addBookForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const book = {
        id: Date.now(),
        title: newTitle.value.trim(),
        author: newAuthor.value.trim(),
        genre: newGenre.value,
        cover: getCoverByGenre(newGenre.value),
        description: "Пользовательская книга, добавленная через форму каталога. Описание можно уточнить при дальнейшем развитии приложения."
    };

    books.push(book);
    addBookForm.reset();
    searchInput.value = "";
    genreSelect.value = "all";
    activeView = "all";
    updatePage();
});

ratingButtons.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button || activeBookId === null) {
        return;
    }

    bookRatings[activeBookId] = Number(button.dataset.rating);
    renderRatingButtons();
});

modalClose.addEventListener("click", closeBookModal);

bookModal.addEventListener("click", (event) => {
    if (event.target === bookModal) {
        closeBookModal();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && bookModal.classList.contains("show")) {
        closeBookModal();
    }
});

themeToggle.addEventListener("click", () => {
    setTheme(!document.body.classList.contains("dark-theme"));
});

setTheme(localStorage.getItem("libraryTheme") === "dark");
updatePage();
