spaces.push(...loadUserSpaces());

const state = {
    activeType: "all",
    activeView: "all",
    activeAmenities: [],
    selectedSpaceId: null,
    modalSpaceId: null,
    editingBookingId: null,
    editingSpaceId: null,
    favoriteSpaces: loadFavorites(),
    bookings: loadBookings()
};

const spaceGrid = document.getElementById("spaceGrid");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const catalogTabs = document.getElementById("catalogTabs");
const typeFilters = document.getElementById("typeFilters");
const amenityFilters = document.getElementById("amenityFilters");
const resetAmenities = document.getElementById("resetAmenities");
const openAddSpace = document.getElementById("openAddSpace");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchDate = document.getElementById("searchDate");
const guestFilter = document.getElementById("guestFilter");
const selectedPlaceholder = document.getElementById("selectedPlaceholder");
const selectedSpace = document.getElementById("selectedSpace");
const selectedImage = document.getElementById("selectedImage");
const selectedType = document.getElementById("selectedType");
const selectedName = document.getElementById("selectedName");
const selectedAddress = document.getElementById("selectedAddress");
const bookingForm = document.getElementById("bookingForm");
const bookingDate = document.getElementById("bookingDate");
const bookingTime = document.getElementById("bookingTime");
const bookingDuration = document.getElementById("bookingDuration");
const bookingGuests = document.getElementById("bookingGuests");
const totalPrice = document.getElementById("totalPrice");
const formMessage = document.getElementById("formMessage");
const bookingButton = bookingForm.querySelector(".booking-button");
const cancelEditButton = document.getElementById("cancelEditButton");
const bookingList = document.getElementById("bookingList");
const bookingEmpty = document.getElementById("bookingEmpty");
const historyCount = document.getElementById("historyCount");
const menuButton = document.getElementById("menuButton");
const mainNav = document.getElementById("mainNav");
const themeButton = document.getElementById("themeButton");
const spaceModal = document.getElementById("spaceModal");
const modalClose = document.getElementById("modalClose");
const modalImage = document.getElementById("modalImage");
const modalType = document.getElementById("modalType");
const modalTitle = document.getElementById("modalTitle");
const modalAddress = document.getElementById("modalAddress");
const modalDescription = document.getElementById("modalDescription");
const modalAmenities = document.getElementById("modalAmenities");
const modalSelect = document.getElementById("modalSelect");
const addSpaceModal = document.getElementById("addSpaceModal");
const addSpaceClose = document.getElementById("addSpaceClose");
const addSpaceForm = document.getElementById("addSpaceForm");
const addSpaceEyebrow = document.getElementById("addSpaceEyebrow");
const addSpaceTitle = document.getElementById("addSpaceTitle");
const addSpaceSubmit = document.getElementById("addSpaceSubmit");
const addSpaceFormMessage = document.getElementById("addSpaceFormMessage");
const newSpaceName = document.getElementById("newSpaceName");
const newSpaceType = document.getElementById("newSpaceType");
const newSpaceCapacity = document.getElementById("newSpaceCapacity");
const newSpaceAddress = document.getElementById("newSpaceAddress");
const newSpacePrice = document.getElementById("newSpacePrice");
const newSpaceDescription = document.getElementById("newSpaceDescription");
const newSpaceImages = document.getElementById("newSpaceImages");
const toast = document.getElementById("toast");
const availableSpaceImages = Array.from(
    { length: 8 },
    (_, index) => `images/coworking-space_${index + 1}.jpg`
);

function loadUserSpaces() {
    try {
        const savedSpaces = JSON.parse(localStorage.getItem("coworkingUserSpaces"));
        return Array.isArray(savedSpaces) ? savedSpaces : [];
    } catch {
        return [];
    }
}

function saveUserSpaces() {
    const userSpaces = spaces.filter((space) => space.isCustom);
    localStorage.setItem("coworkingUserSpaces", JSON.stringify(userSpaces));
}

function loadBookings() {
    try {
        return JSON.parse(localStorage.getItem("coworkingBookings")) || [];
    } catch {
        return [];
    }
}

function saveBookings() {
    localStorage.setItem("coworkingBookings", JSON.stringify(state.bookings));
}

function loadFavorites() {
    try {
        return JSON.parse(localStorage.getItem("coworkingFavorites")) || [];
    } catch {
        return [];
    }
}

function saveFavorites() {
    localStorage.setItem("coworkingFavorites", JSON.stringify(state.favoriteSpaces));
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatPrice(value) {
    return `${value.toLocaleString("ru-RU")} ₽`;
}

function formatDate(value) {
    if (!value) {
        return "";
    }

    return new Date(`${value}T12:00:00`).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long"
    });
}

function formatDuration(hours) {
    if (hours < 24) {
        const hourWord = hours === 1 ? "час" : [2, 3, 4].includes(hours) ? "часа" : "часов";
        return `${hours} ${hourWord}`;
    }

    const days = hours / 24;
    const dayWord = days === 1 ? "день" : [2, 3, 4].includes(days) ? "дня" : "дней";
    return `${days} ${dayWord}`;
}

function formatResultCount(count) {
    if (count % 10 === 1 && count % 100 !== 11) {
        return `${count} вариант`;
    }

    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
        return `${count} варианта`;
    }

    return `${count} вариантов`;
}

function getFilteredSpaces() {
    const query = searchInput.value.trim().toLowerCase();
    const guests = Number(guestFilter.value);

    return spaces.filter((space) => {
        const matchesType = state.activeType === "all" || space.type === state.activeType;
        const matchesGuests = space.capacity >= guests;
        const matchesView = state.activeView === "all" || state.favoriteSpaces.includes(space.id);
        const matchesAmenities = state.activeAmenities.every((amenity) => {
            return space.features.includes(amenity);
        });
        const matchesQuery = space.name.toLowerCase().includes(query)
            || space.address.toLowerCase().includes(query)
            || space.district.toLowerCase().includes(query);

        return matchesType && matchesGuests && matchesView && matchesAmenities && matchesQuery;
    });
}

function renderCatalogTabs() {
    catalogTabs.querySelectorAll("button").forEach((button) => {
        button.classList.toggle("active", button.dataset.view === state.activeView);

        if (button.dataset.view === "favorites") {
            button.textContent = `Избранное (${state.favoriteSpaces.length})`;
        }
    });
}

function renderSpaces() {
    const filteredSpaces = getFilteredSpaces();

    spaceGrid.innerHTML = "";
    renderCatalogTabs();
    resultCount.textContent = formatResultCount(filteredSpaces.length);
    emptyState.textContent = state.activeView === "favorites"
        ? "В избранном пока нет подходящих пространств."
        : "Подходящие пространства не найдены.";
    emptyState.classList.toggle("show", filteredSpaces.length === 0);

    filteredSpaces.forEach((space) => {
        const isFavorite = state.favoriteSpaces.includes(space.id);
        const safeName = escapeHtml(space.name);
        const safeType = escapeHtml(space.typeLabel);
        const safeAddress = escapeHtml(space.address);
        const card = document.createElement("article");
        card.className = `space-card ${state.selectedSpaceId === space.id ? "selected" : ""}`;
        card.innerHTML = `
            <div class="space-image">
                <img src="${space.image}" alt="${safeName}">
                <span class="availability">Свободно</span>
                ${space.isCustom ? `
                    <div class="custom-space-actions">
                        <button class="custom-space-button edit-space-button" type="button"
                            data-action="edit-space" data-id="${space.id}"
                            aria-label="Редактировать коворкинг" title="Редактировать коворкинг">✎</button>
                        <button class="custom-space-button delete-space-button" type="button"
                            data-action="delete-space" data-id="${space.id}"
                            aria-label="Удалить коворкинг" title="Удалить коворкинг">×</button>
                    </div>
                ` : ""}
                <button class="favorite-button ${isFavorite ? "active" : ""}" type="button"
                    data-action="favorite" data-id="${space.id}"
                    aria-label="${isFavorite ? "Убрать из избранного" : "Добавить в избранное"}">
                    ${isFavorite ? "★" : "☆"}
                </button>
            </div>
            <div class="space-body">
                <div class="space-meta">
                    <span class="space-type">${safeType}</span>
                    <span class="rating">${space.rating ? `★ ${space.rating}` : "Новое"}</span>
                </div>
                <h3>${safeName}</h3>
                <p class="space-address">${safeAddress}</p>
                <div class="feature-list">
                    ${space.features.map((feature) => `<span>${escapeHtml(feature)}</span>`).join("")}
                    <span>До ${space.capacity} чел.</span>
                </div>
                <div class="card-footer">
                    <div class="space-price">
                        <small>Стоимость за час</small>
                        <strong>${formatPrice(space.price)}</strong>
                    </div>
                    <div class="card-actions">
                        <button class="details-button" type="button" data-action="details" data-id="${space.id}">Подробнее</button>
                        <button class="select-button" type="button" data-action="select" data-id="${space.id}">
                            ${state.selectedSpaceId === space.id ? "Выбрано" : "Выбрать"}
                        </button>
                    </div>
                </div>
            </div>
        `;

        spaceGrid.appendChild(card);
    });
}

function selectSpace(spaceId) {
    const space = spaces.find((item) => item.id === spaceId);

    if (!space) {
        return;
    }

    state.selectedSpaceId = spaceId;
    selectedPlaceholder.hidden = true;
    selectedSpace.hidden = false;
    selectedImage.src = space.image;
    selectedImage.alt = space.name;
    selectedType.textContent = space.typeLabel;
    selectedName.textContent = space.name;
    selectedAddress.textContent = space.address;
    bookingGuests.max = space.capacity;
    bookingGuests.value = Math.min(Number(bookingGuests.value), space.capacity);
    bookingButton.disabled = false;
    clearFormValidation(bookingForm);
    clearFormMessage();
    updateTotal();
    renderSpaces();
}

function updateTotal() {
    const space = spaces.find((item) => item.id === state.selectedSpaceId);
    const duration = Number(bookingDuration.value);
    const total = space ? space.price * duration : 0;
    totalPrice.textContent = formatPrice(total);
}

function showStatusMessage(element, text, type = "error") {
    element.textContent = text;
    element.classList.add("show");
    element.classList.toggle("success", type === "success");
}

function clearStatusMessage(element) {
    element.textContent = "";
    element.classList.remove("show", "success");
}

function showFormMessage(text, type = "error") {
    showStatusMessage(formMessage, text, type);
}

function clearFormMessage() {
    clearStatusMessage(formMessage);
}

function showFieldError(field, text) {
    const error = field.closest(".field")?.querySelector(".field-error");

    field.classList.add("input-error");
    field.setAttribute("aria-invalid", "true");

    if (error) {
        error.textContent = text;
    }
}

function clearFieldError(field) {
    const error = field.closest(".field")?.querySelector(".field-error");

    field.classList.remove("input-error");
    field.removeAttribute("aria-invalid");

    if (error) {
        error.textContent = "";
    }
}

function clearFormValidation(form) {
    form.querySelectorAll(".input-error").forEach(clearFieldError);
}

function validateBookingDate() {
    if (!bookingDate.value) {
        showFieldError(bookingDate, "Выберите дату бронирования.");
        return false;
    }

    if (bookingDate.min && bookingDate.value < bookingDate.min) {
        showFieldError(bookingDate, "Дата не может быть раньше сегодняшней.");
        return false;
    }

    clearFieldError(bookingDate);
    return true;
}

function validateBookingGuests(space) {
    const guests = Number(bookingGuests.value);

    if (!Number.isInteger(guests) || guests < 1) {
        showFieldError(bookingGuests, "Укажите минимум одного гостя.");
        return false;
    }

    if (space && guests > space.capacity) {
        showFieldError(bookingGuests, `Максимальная вместимость: ${space.capacity} человек.`);
        return false;
    }

    clearFieldError(bookingGuests);
    return true;
}

function finishEditing() {
    state.editingBookingId = null;
    bookingButton.textContent = "Забронировать";
    cancelEditButton.hidden = true;
    clearFormMessage();
    renderBookings();
}

function startEditing(bookingId) {
    const booking = state.bookings.find((item) => item.id === bookingId);

    if (!booking) {
        return;
    }

    state.editingBookingId = bookingId;
    selectSpace(booking.spaceId);
    bookingDate.value = booking.date;
    bookingTime.value = booking.time;
    bookingDuration.value = String(booking.duration);
    bookingGuests.value = booking.guests;
    bookingButton.textContent = "Сохранить изменения";
    cancelEditButton.hidden = false;
    updateTotal();
    renderBookings();
    document.getElementById("booking").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderBookings() {
    bookingList.innerHTML = "";
    historyCount.textContent = state.bookings.length;
    bookingEmpty.hidden = state.bookings.length > 0;

    state.bookings.forEach((booking) => {
        const item = document.createElement("li");
        item.classList.toggle("editing", booking.id === state.editingBookingId);
        item.innerHTML = `
            <strong>${booking.spaceName}</strong>
            <span>${formatDate(booking.date)}, ${booking.time} · ${formatDuration(booking.duration)} · ${formatPrice(booking.total)}</span>
            <button class="edit-booking" type="button" data-action="edit" data-id="${booking.id}" aria-label="Редактировать бронирование">✎</button>
            <button class="cancel-booking" type="button" data-action="delete" data-id="${booking.id}" aria-label="Отменить бронирование">×</button>
        `;
        bookingList.appendChild(item);
    });
}

function openModal(spaceId) {
    const space = spaces.find((item) => item.id === spaceId);

    if (!space) {
        return;
    }

    state.modalSpaceId = spaceId;
    modalImage.src = space.image;
    modalImage.alt = space.name;
    modalType.textContent = space.typeLabel;
    modalTitle.textContent = space.name;
    modalAddress.textContent = space.address;
    modalDescription.textContent = space.description;
    modalAmenities.innerHTML = space.features
        .concat(`До ${space.capacity} человек`)
        .map((feature) => `<span>${feature}</span>`)
        .join("");
    spaceModal.classList.add("show");
    spaceModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
    spaceModal.classList.remove("show");
    spaceModal.setAttribute("aria-hidden", "true");
    state.modalSpaceId = null;
}

function resetAddSpaceForm() {
    addSpaceForm.reset();
    newSpaceCapacity.value = "1";
    newSpacePrice.value = "500";
    const firstImage = addSpaceForm.querySelector('input[name="newSpaceImage"]');

    if (firstImage) {
        firstImage.checked = true;
    }

    clearFormValidation(addSpaceForm);
    clearStatusMessage(addSpaceFormMessage);
}

function renderImageOptions() {
    newSpaceImages.innerHTML = "";

    availableSpaceImages.forEach((image, index) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        const choice = document.createElement("span");
        const preview = document.createElement("img");
        const caption = document.createElement("small");

        label.className = "image-option";
        input.type = "radio";
        input.name = "newSpaceImage";
        input.value = image;
        input.defaultChecked = index === 0;
        preview.src = image;
        preview.alt = "";
        preview.loading = "lazy";
        caption.textContent = `Фото ${index + 1}`;
        choice.className = "image-choice";
        choice.append(preview, caption);
        label.append(input, choice);
        newSpaceImages.appendChild(label);
    });
}

function getAddSpaceFieldError(field) {
    const value = field.value.trim();

    if (field === newSpaceName && !value) {
        return "Введите название коворкинга.";
    }

    if (field === newSpaceAddress && !value) {
        return "Введите адрес коворкинга.";
    }

    if (field === newSpaceDescription && !value) {
        return "Добавьте краткое описание.";
    }

    if (field === newSpaceCapacity) {
        const capacity = Number(field.value);

        if (!Number.isInteger(capacity) || capacity < 1 || capacity > 50) {
            return "Укажите вместимость от 1 до 50 человек.";
        }
    }

    if (field === newSpacePrice) {
        const price = Number(field.value);

        if (!Number.isFinite(price) || price < 1 || price > 100000) {
            return "Укажите стоимость от 1 до 100 000 ₽.";
        }
    }

    return "";
}

function validateAddSpaceField(field) {
    const error = getAddSpaceFieldError(field);

    if (error) {
        showFieldError(field, error);
        return false;
    }

    clearFieldError(field);
    return true;
}

function validateAddSpaceForm() {
    const fields = [
        newSpaceName,
        newSpaceCapacity,
        newSpaceAddress,
        newSpacePrice,
        newSpaceDescription
    ];
    const isValid = fields.map(validateAddSpaceField).every(Boolean);

    if (!isValid) {
        showStatusMessage(addSpaceFormMessage, "Исправьте выделенные поля.");
        addSpaceForm.querySelector(".input-error")?.focus();
        return false;
    }

    clearStatusMessage(addSpaceFormMessage);
    return true;
}

function openAddSpaceModal(spaceId = null) {
    const space = spaces.find((item) => item.id === spaceId && item.isCustom);

    resetAddSpaceForm();
    state.editingSpaceId = space ? space.id : null;
    addSpaceEyebrow.textContent = space ? "Редактирование пространства" : "Новое пространство";
    addSpaceTitle.textContent = space ? "Изменить коворкинг" : "Добавить коворкинг";
    addSpaceSubmit.textContent = space ? "Сохранить изменения" : "Добавить коворкинг";

    if (space) {
        newSpaceName.value = space.name;
        newSpaceType.value = space.type;
        newSpaceCapacity.value = space.capacity;
        newSpaceAddress.value = space.address;
        newSpacePrice.value = space.price;
        newSpaceDescription.value = space.description;
        const imageInputs = addSpaceForm.querySelectorAll('input[name="newSpaceImage"]');
        const hasCurrentImage = availableSpaceImages.includes(space.image);

        imageInputs.forEach((input, index) => {
            input.checked = hasCurrentImage ? input.value === space.image : index === 0;
        });
        addSpaceForm.querySelectorAll('input[name="newAmenity"]').forEach((input) => {
            input.checked = space.features.includes(input.value);
        });
    }

    addSpaceModal.classList.add("show");
    addSpaceModal.setAttribute("aria-hidden", "false");
    newSpaceName.focus();
}

function closeAddSpaceModal() {
    addSpaceModal.classList.remove("show");
    addSpaceModal.setAttribute("aria-hidden", "true");
    state.editingSpaceId = null;
}

function clearSelectedSpace() {
    state.selectedSpaceId = null;
    state.editingBookingId = null;
    selectedPlaceholder.hidden = false;
    selectedSpace.hidden = true;
    selectedImage.removeAttribute("src");
    bookingGuests.removeAttribute("max");
    bookingButton.disabled = true;
    bookingButton.textContent = "Забронировать";
    cancelEditButton.hidden = true;
    totalPrice.textContent = formatPrice(0);
    clearFormValidation(bookingForm);
    clearFormMessage();
}

function deleteCustomSpace(spaceId) {
    const spaceIndex = spaces.findIndex((space) => space.id === spaceId && space.isCustom);

    if (spaceIndex === -1) {
        return;
    }

    const space = spaces[spaceIndex];
    const relatedBookings = state.bookings.filter((booking) => booking.spaceId === spaceId).length;
    const bookingWarning = relatedBookings > 0
        ? ` Связанные бронирования (${relatedBookings}) также будут удалены.`
        : "";

    if (!window.confirm(`Удалить коворкинг «${space.name}»?${bookingWarning}`)) {
        return;
    }

    spaces.splice(spaceIndex, 1);
    state.favoriteSpaces = state.favoriteSpaces.filter((id) => id !== spaceId);
    state.bookings = state.bookings.filter((booking) => booking.spaceId !== spaceId);

    if (state.selectedSpaceId === spaceId) {
        clearSelectedSpace();
    }

    if (state.modalSpaceId === spaceId) {
        closeModal();
    }

    saveUserSpaces();
    saveFavorites();
    saveBookings();
    renderBookings();
    renderSpaces();
    showToast(`Коворкинг «${space.name}» удалён`);
}

function resetCatalogFilters() {
    state.activeType = "all";
    state.activeView = "all";
    state.activeAmenities = [];
    searchInput.value = "";
    guestFilter.value = "1";
    typeFilters.querySelectorAll("button").forEach((button) => {
        button.classList.toggle("active", button.dataset.type === "all");
    });
    amenityFilters.querySelectorAll('input[type="checkbox"]').forEach((input) => {
        input.checked = false;
    });
    resetAmenities.hidden = true;
}

function showToast(text) {
    toast.textContent = text;
    toast.classList.add("show");

    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}

function setTheme(isDark) {
    document.body.classList.toggle("dark-theme", isDark);
    themeButton.textContent = isDark ? "Светлая тема" : "Тёмная тема";
    localStorage.setItem("coworkingTheme", isDark ? "dark" : "light");
}

function setMenuOpen(isOpen) {
    mainNav.classList.toggle("open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
}

typeFilters.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    state.activeType = button.dataset.type;
    typeFilters.querySelectorAll("button").forEach((item) => {
        item.classList.toggle("active", item === button);
    });
    renderSpaces();
});

amenityFilters.addEventListener("change", () => {
    state.activeAmenities = Array.from(
        amenityFilters.querySelectorAll('input[type="checkbox"]:checked'),
        (input) => input.value
    );
    resetAmenities.hidden = state.activeAmenities.length === 0;
    renderSpaces();
});

resetAmenities.addEventListener("click", () => {
    amenityFilters.querySelectorAll('input[type="checkbox"]').forEach((input) => {
        input.checked = false;
    });
    state.activeAmenities = [];
    resetAmenities.hidden = true;
    renderSpaces();
});

catalogTabs.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    state.activeView = button.dataset.view;
    renderSpaces();
});

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    bookingDate.value = searchDate.value;
    bookingGuests.value = guestFilter.value;
    renderSpaces();
    document.getElementById("spaces").scrollIntoView({ behavior: "smooth", block: "start" });
});

searchInput.addEventListener("input", renderSpaces);
guestFilter.addEventListener("change", renderSpaces);

spaceGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const spaceId = Number(button.dataset.id);

    if (button.dataset.action === "edit-space") {
        openAddSpaceModal(spaceId);
        return;
    }

    if (button.dataset.action === "delete-space") {
        deleteCustomSpace(spaceId);
        return;
    }

    if (button.dataset.action === "details") {
        openModal(spaceId);
        return;
    }

    if (button.dataset.action === "favorite") {
        if (state.favoriteSpaces.includes(spaceId)) {
            state.favoriteSpaces = state.favoriteSpaces.filter((id) => id !== spaceId);
            showToast("Коворкинг удалён из избранного");
        } else {
            state.favoriteSpaces.push(spaceId);
            showToast("Коворкинг добавлен в избранное");
        }

        saveFavorites();
        renderSpaces();
        return;
    }

    selectSpace(spaceId);
    document.getElementById("booking").scrollIntoView({ behavior: "smooth", block: "start" });
});

bookingDuration.addEventListener("change", updateTotal);

bookingDate.addEventListener("input", () => {
    validateBookingDate();

    if (!bookingForm.querySelector(".input-error")) {
        clearFormMessage();
    }
});

bookingGuests.addEventListener("input", () => {
    const space = spaces.find((item) => item.id === state.selectedSpaceId);
    validateBookingGuests(space);

    if (!bookingForm.querySelector(".input-error")) {
        clearFormMessage();
    }
});

bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearFormMessage();

    const space = spaces.find((item) => item.id === state.selectedSpaceId);

    if (!space) {
        showFormMessage("Сначала выберите пространство.");
        return;
    }

    const dateIsValid = validateBookingDate();
    const guestsAreValid = validateBookingGuests(space);

    if (!dateIsValid || !guestsAreValid) {
        showFormMessage("Исправьте выделенные поля.");
        bookingForm.querySelector(".input-error")?.focus();
        return;
    }

    const guests = Number(bookingGuests.value);
    const duration = Number(bookingDuration.value);
    const bookingData = {
        spaceId: space.id,
        spaceName: space.name,
        date: bookingDate.value,
        time: bookingTime.value,
        duration,
        guests,
        total: space.price * duration
    };

    if (state.editingBookingId !== null) {
        const bookingIndex = state.bookings.findIndex((item) => item.id === state.editingBookingId);

        if (bookingIndex !== -1) {
            state.bookings[bookingIndex] = {
                ...state.bookings[bookingIndex],
                ...bookingData
            };
        }

        saveBookings();
        finishEditing();
        showFormMessage("Изменения бронирования сохранены.", "success");
        showToast("Изменения бронирования сохранены");
        return;
    }

    state.bookings.unshift({
        id: Date.now(),
        ...bookingData
    });
    saveBookings();
    renderBookings();
    showFormMessage(`Бронирование «${space.name}» успешно оформлено.`, "success");
    showToast(`Бронирование «${space.name}» оформлено`);
});

bookingList.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const bookingId = Number(button.dataset.id);

    if (button.dataset.action === "edit") {
        startEditing(bookingId);
        return;
    }

    state.bookings = state.bookings.filter((booking) => booking.id !== bookingId);

    if (state.editingBookingId === bookingId) {
        finishEditing();
    }

    saveBookings();
    renderBookings();
    showToast("Бронирование отменено");
});

cancelEditButton.addEventListener("click", finishEditing);

openAddSpace.addEventListener("click", () => openAddSpaceModal());
addSpaceClose.addEventListener("click", closeAddSpaceModal);

addSpaceModal.addEventListener("click", (event) => {
    if (event.target === addSpaceModal) {
        closeAddSpaceModal();
    }
});

addSpaceForm.addEventListener("input", (event) => {
    const field = event.target.closest("input, textarea");

    if (!field || !field.closest(".field")) {
        return;
    }

    if (field.classList.contains("input-error")) {
        validateAddSpaceField(field);
    }

    if (!addSpaceForm.querySelector(".input-error")) {
        clearStatusMessage(addSpaceFormMessage);
    }
});

addSpaceForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateAddSpaceForm()) {
        return;
    }

    const typeSettings = {
        open: {
            label: "Открытое место"
        },
        office: {
            label: "Приватный кабинет"
        },
        meeting: {
            label: "Переговорная"
        }
    };
    const selectedType = typeSettings[newSpaceType.value];
    const selectedImage = addSpaceForm.querySelector('input[name="newSpaceImage"]:checked');
    const features = Array.from(
        addSpaceForm.querySelectorAll('input[name="newAmenity"]:checked'),
        (input) => input.value
    );
    const spaceData = {
        name: newSpaceName.value.trim(),
        type: newSpaceType.value,
        typeLabel: selectedType.label,
        address: newSpaceAddress.value.trim(),
        district: newSpaceAddress.value.trim(),
        capacity: Number(newSpaceCapacity.value),
        price: Number(newSpacePrice.value),
        rating: null,
        image: selectedImage?.value || availableSpaceImages[0],
        features,
        description: newSpaceDescription.value.trim(),
        isCustom: true
    };
    const editingSpace = spaces.find((space) => {
        return space.id === state.editingSpaceId && space.isCustom;
    });

    if (editingSpace) {
        Object.assign(editingSpace, spaceData);
        state.bookings = state.bookings.map((booking) => {
            if (booking.spaceId !== editingSpace.id) {
                return booking;
            }

            return {
                ...booking,
                spaceName: editingSpace.name,
                total: editingSpace.price * booking.duration
            };
        });
        saveUserSpaces();
        saveBookings();
        closeAddSpaceModal();
        renderBookings();

        if (state.selectedSpaceId === editingSpace.id) {
            selectSpace(editingSpace.id);
        } else {
            renderSpaces();
        }

        showToast(`Коворкинг «${editingSpace.name}» изменён`);
        return;
    }

    const newSpace = {
        id: Date.now(),
        ...spaceData
    };

    spaces.unshift(newSpace);
    saveUserSpaces();
    resetCatalogFilters();
    resetAddSpaceForm();
    closeAddSpaceModal();
    renderSpaces();
    showToast(`Коворкинг «${newSpace.name}» добавлен`);
    document.getElementById("spaces").scrollIntoView({ behavior: "smooth", block: "start" });
});

modalClose.addEventListener("click", closeModal);

spaceModal.addEventListener("click", (event) => {
    if (event.target === spaceModal) {
        closeModal();
    }
});

modalSelect.addEventListener("click", () => {
    if (state.modalSpaceId !== null) {
        const spaceId = state.modalSpaceId;
        closeModal();
        selectSpace(spaceId);
        document.getElementById("booking").scrollIntoView({ behavior: "smooth", block: "start" });
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        setMenuOpen(false);

        if (spaceModal.classList.contains("show")) {
            closeModal();
        }

        if (addSpaceModal.classList.contains("show")) {
            closeAddSpaceModal();
        }
    }
});

themeButton.addEventListener("click", () => {
    setTheme(!document.body.classList.contains("dark-theme"));
});

menuButton.addEventListener("click", () => {
    setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
});

mainNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
        setMenuOpen(false);
    }
});

window.matchMedia("(min-width: 721px)").addEventListener("change", (event) => {
    if (event.matches) {
        setMenuOpen(false);
    }
});

const now = new Date();
const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
].join("-");
searchDate.min = today;
bookingDate.min = today;
searchDate.value = today;
bookingDate.value = today;

setTheme(localStorage.getItem("coworkingTheme") === "dark");
renderImageOptions();
renderSpaces();
renderBookings();
