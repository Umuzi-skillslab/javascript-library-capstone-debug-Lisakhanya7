// Library UI - DOM Manipulation and asset rendering
let catalogueContainer;
let searchInput;
let filterDropdown;
let borrowForm;
let detailsContainer;
let memberFormContainer;
let memberListContainer;
let messageBox;
let addBookFormContainer;

const BOOK_COVER_IMAGES = [
    'covers/Screenshot 2026-07-13 101032.png',
    'covers/Screenshot 2026-07-13 101159.png',
    'covers/Screenshot 2026-07-13 101327.png',
    'covers/Screenshot 2026-07-13 101444.png'
];

globalThis.BOOK_COVER_IMAGES = BOOK_COVER_IMAGES;

function getBookCoverImage(book, index) {
    const coverList = Array.isArray(globalThis.BOOK_COVER_IMAGES) && globalThis.BOOK_COVER_IMAGES.length
        ? globalThis.BOOK_COVER_IMAGES
        : BOOK_COVER_IMAGES;
    const safeIndex = Number.isInteger(index) ? index : 0;
    const imageName = coverList[safeIndex % coverList.length];
    return imageName.startsWith('.') ? imageName : `./${imageName}`;
}

function initializeUI() {
    if (typeof document === 'undefined') {
        return;
    }

    catalogueContainer = document.querySelector('#catalogue-list');
    searchInput = document.getElementById('search');
    filterDropdown = document.getElementById('filter-category');
    borrowForm = document.getElementById('borrow-form');
    detailsContainer = document.getElementById('book-details');
    memberFormContainer = document.getElementById('member-form');
    memberListContainer = document.getElementById('member-list');
    messageBox = document.getElementById('status-message');
    addBookFormContainer = document.getElementById('add-book-form');

    if (!catalogueContainer || !searchInput || !filterDropdown || !borrowForm) {
        return;
    }

    if (typeof window !== 'undefined' && window.LibraryApp) {
        window.LibraryApp.initializeLibrary();
    }

    setupEventListeners();
    renderBookCatalogue(window.LibraryApp?.getAllBooks?.() ?? []);
    updateStatisticsDisplay();
    createMemberForm();
    createBookForm();
    renderMemberList();
}

function setupEventListeners() {
    if (searchInput && typeof handleSearch === 'function') {
        searchInput.addEventListener('input', handleSearch);
    }
    if (filterDropdown && typeof handleFilterChange === 'function') {
        filterDropdown.addEventListener('change', handleFilterChange);
    }
    if (borrowForm && typeof handleBorrowSubmit === 'function') {
        borrowForm.addEventListener('submit', handleBorrowSubmit);
    }
    if (catalogueContainer && typeof handleBookClick === 'function') {
        catalogueContainer.addEventListener('click', handleBookClick);
    }

    const tabs = [
        document.getElementById('catalogue-tab'),
        document.getElementById('members-tab'),
        document.getElementById('statistics-tab')
    ];

    tabs.forEach((tab) => {
        if (!tab) {
            return;
        }

        tab.addEventListener('click', () => {
            const sectionId = tab.id.replace('-tab', '-section');
            document.querySelectorAll('main section').forEach((section) => {
                const isBorrowSection = section.id === 'borrow-section';
                section.style.display = isBorrowSection || section.id === sectionId ? 'block' : 'none';
            });
        });
    });
}

function renderBookCatalogue(bookList) {
    if (!catalogueContainer) {
        return;
    }

    catalogueContainer.innerHTML = '';
    const safeList = Array.isArray(bookList) ? bookList : [];
    const fragment = document.createDocumentFragment();

    if (!safeList.length) {
        const emptyState = document.createElement('p');
        emptyState.className = 'empty-state';
        emptyState.textContent = 'No books match the current filters.';
        fragment.appendChild(emptyState);
        catalogueContainer.appendChild(fragment);
        return;
    }

    safeList.forEach((book, index) => {
        const title = typeof book?.title === 'string' ? book.title : 'Untitled';
        const author = typeof book?.author === 'string' ? book.author : 'Unknown author';
        const category = typeof book?.category === 'string' ? book.category : 'general';
        const availableCopies = Number.isFinite(book?.availableCopies) ? book.availableCopies : 0;
        const isbn = typeof book?.isbn === 'string' ? book.isbn : '';

        const bookCard = document.createElement('article');
        bookCard.className = 'book-card';
        bookCard.dataset.bookId = isbn;
        bookCard.innerHTML = `
            <div class="book-cover">
                <img src="${getBookCoverImage(book, index)}" alt="${title} cover">
            </div>
            <div class="book-info">
                <h3>${title}</h3>
                <span class="badge">${category}</span>
                <p class="book-meta">Author: ${author}</p>
                <p class="book-meta">Available: ${availableCopies}</p>
                <p class="book-meta">ISBN: ${isbn}</p>
            </div>
        `;
        fragment.appendChild(bookCard);
    });

    catalogueContainer.appendChild(fragment);
}

function handleBorrowSubmit(event) {
    event.preventDefault();

    const memberIdInput = document.getElementById('member-id');
    const isbnInput = document.getElementById('isbn');
    const memberId = memberIdInput ? memberIdInput.value.trim() : '';
    const isbn = isbnInput ? isbnInput.value.trim() : '';

    if (!memberId || !isbn) {
        showMessage('Please provide both a member ID and ISBN.', 'error');
        return;
    }

    const success = window.LibraryApp?.borrowBook?.(memberId, isbn) ?? false;

    if (success) {
        showMessage('Book borrowed successfully.', 'success');
        borrowForm?.reset?.();
        renderBookCatalogue(window.LibraryApp.getAllBooks());
        updateStatisticsDisplay();
        displayBookDetails(isbn);
    } else {
        showMessage('Unable to complete the borrow request.', 'error');
    }
}

function handleBookClick(event) {
    const card = event.target?.closest?.('.book-card');
    if (!card) {
        return;
    }

    const bookId = card.dataset.bookId ?? '';
    displayBookDetails(bookId);
}

function handleSearch(event) {
    const searchTerm = event.target?.value?.trim()?.toLowerCase() ?? '';
    const selectedCategory = filterDropdown ? filterDropdown.value : 'all';
    const results = (window.LibraryApp?.getAllBooks?.() ?? []).filter((book) => {
        const titleMatch = book.title?.toLowerCase().includes(searchTerm);
        const authorMatch = book.author?.toLowerCase().includes(searchTerm);
        const categoryMatch = selectedCategory === 'all' || book.category === selectedCategory;
        return (titleMatch || authorMatch) && categoryMatch;
    });

    renderBookCatalogue(results);
}

function handleFilterChange() {
    const selectedCategory = filterDropdown ? filterDropdown.value : 'all';
    const activeTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const filtered = (window.LibraryApp?.getAllBooks?.() ?? []).filter((book) => {
        const categoryMatch = selectedCategory === 'all' || book.category === selectedCategory;
        const textMatch = !activeTerm || book.title.toLowerCase().includes(activeTerm) || book.author.toLowerCase().includes(activeTerm);
        return categoryMatch && textMatch;
    });

    renderBookCatalogue(filtered);
}

function exportLibraryData() {
    try {
        const data = {
            books: window.LibraryApp?.getAllBooks?.() ?? [],
            members: window.LibraryApp?.members ?? []
        };
        return JSON.stringify(data);
    } catch (error) {
        console.error(error.message);
        return '';
    }
}

function importLibraryData(jsonString) {
    try {
        const parsed = JSON.parse(jsonString ?? '{}');
        if (!parsed || !Array.isArray(parsed.books) || !Array.isArray(parsed.members)) {
            throw new Error('Invalid library data.');
        }
        window.LibraryApp?.resetLibraryState?.();
        window.LibraryApp?.books?.push(...parsed.books);
        window.LibraryApp?.members?.push(...parsed.members);
        window.LibraryApp?.LibraryStats?.updateStats?.();
        renderBookCatalogue(window.LibraryApp?.getAllBooks?.() ?? []);
        updateStatisticsDisplay();
    } catch (error) {
        console.error(error.message);
    }
}

function saveToLocalStorage() {
    try {
        localStorage.setItem('libraryBooks', JSON.stringify(window.LibraryApp?.getAllBooks?.() ?? []));
        localStorage.setItem('libraryMembers', JSON.stringify(window.LibraryApp?.members ?? []));
    } catch (error) {
        console.error(error.message);
    }
}

function loadFromLocalStorage() {
    try {
        const booksData = localStorage.getItem('libraryBooks');
        const membersData = localStorage.getItem('libraryMembers');

        if (!booksData || !membersData) {
            return;
        }

        const bookList = JSON.parse(booksData);
        const memberList = JSON.parse(membersData);
        window.LibraryApp?.resetLibraryState?.();
        window.LibraryApp?.books?.push(...(Array.isArray(bookList) ? bookList : []));
        window.LibraryApp?.members?.push(...(Array.isArray(memberList) ? memberList : []));
        window.LibraryApp?.LibraryStats?.updateStats?.();
        renderBookCatalogue(window.LibraryApp?.getAllBooks?.() ?? []);
        updateStatisticsDisplay();
    } catch (error) {
        console.error(error.message);
    }
}

function displayBookDetails(isbn) {
    if (!detailsContainer) {
        return;
    }

    const book = window.LibraryApp?.findBookByISBN?.(isbn ?? '');
    if (!book) {
        detailsContainer.innerHTML = '<div class="details-card"><h2>No selection</h2><p>Select a book to view details.</p></div>';
        return;
    }

    detailsContainer.innerHTML = `
        <div class="details-card">
            <h2>${book.title}</h2>
            <p class="detail-list"><strong>Author:</strong> ${book.author}</p>
            <p class="detail-list"><strong>ISBN:</strong> ${book.isbn}</p>
            <p class="detail-list"><strong>Year:</strong> ${book.year}</p>
            <p class="detail-list"><strong>Available copies:</strong> ${book.availableCopies}</p>
        </div>
    `;
}

function updateStatisticsDisplay() {
    const totalBooksEl = document.querySelector('.total-books');
    const totalMembersEl = document.querySelector('.total-members');
    const borrowedBooksEl = document.querySelector('.books-borrowed');

    const books = window.LibraryApp?.getAllBooks?.() ?? [];
    const members = window.LibraryApp?.members ?? [];

    if (totalBooksEl) {
        totalBooksEl.textContent = String(books.length);
    }
    if (totalMembersEl) {
        totalMembersEl.textContent = String(members.length);
    }
    if (borrowedBooksEl) {
        borrowedBooksEl.textContent = String(books.reduce((count, book) => count + (Array.isArray(book.checkedOut) ? book.checkedOut.length : 0), 0));
    }
}

function createMemberForm() {
    if (!memberFormContainer) {
        return;
    }

    memberFormContainer.innerHTML = '';
    const form = document.createElement('form');
    form.className = 'form-grid';
    form.innerHTML = `
        <label>
            <span>Name</span>
            <input type="text" id="member-name" placeholder="Member name" required>
        </label>
        <label>
            <span>Email</span>
            <input type="email" id="member-email" placeholder="member@example.com" required>
        </label>
        <label>
            <span>Membership Type</span>
            <select id="member-type">
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
            </select>
        </label>
        <button type="submit">Add Member</button>
    `;

    form.addEventListener('submit', handleMemberFormSubmit);
    memberFormContainer.appendChild(form);
}

function handleMemberFormSubmit(event) {
    event.preventDefault();
    const nameInput = document.getElementById('member-name');
    const emailInput = document.getElementById('member-email');
    const typeInput = document.getElementById('member-type');

    if (!nameInput || !emailInput || !typeInput) {
        return;
    }

    const newMember = window.LibraryApp?.registerMember?.(nameInput.value, emailInput.value, typeInput.value);
    if (!newMember) {
        showMessage('Please provide a valid name and email.', 'error');
        return;
    }

    updateStatisticsDisplay();
    renderMemberList();
    event.currentTarget.reset();
    showMessage('Member added successfully.', 'success');
}

function createBookForm() {
    if (!addBookFormContainer) {
        return;
    }

    addBookFormContainer.innerHTML = '';
    const form = document.createElement('form');
    form.className = 'form-grid';
    form.innerHTML = `
        <label>
            <span>ISBN</span>
            <input type="text" id="book-isbn" placeholder="ISBN" required>
        </label>
        <label>
            <span>Title</span>
            <input type="text" id="book-title" placeholder="Book title" required>
        </label>
        <label>
            <span>Author</span>
            <input type="text" id="book-author" placeholder="Author" required>
        </label>
        <label>
            <span>Year</span>
            <input type="number" id="book-year" placeholder="Year" required>
        </label>
        <label>
            <span>Copies</span>
            <input type="number" id="book-copies" placeholder="Copies" min="1" value="1" required>
        </label>
        <label>
            <span>Category</span>
            <select id="book-category">
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-Fiction</option>
                <option value="reference">Reference</option>
            </select>
        </label>
        <button type="submit">Add Book</button>
    `;

    form.addEventListener('submit', handleAddBookSubmit);
    addBookFormContainer.appendChild(form);
}

function handleAddBookSubmit(event) {
    event.preventDefault();

    const isbnInput = document.getElementById('book-isbn');
    const titleInput = document.getElementById('book-title');
    const authorInput = document.getElementById('book-author');
    const yearInput = document.getElementById('book-year');
    const copiesInput = document.getElementById('book-copies');
    const categoryInput = document.getElementById('book-category');

    if (!isbnInput || !titleInput || !authorInput || !yearInput || !copiesInput || !categoryInput) {
        return;
    }

    const newBook = window.LibraryApp?.addBook?.({
        isbn: isbnInput.value,
        title: titleInput.value,
        author: authorInput.value,
        year: yearInput.value,
        copies: copiesInput.value,
        category: categoryInput.value
    });

    if (!newBook) {
        showMessage('Please provide complete book details.', 'error');
        return;
    }

    renderBookCatalogue(window.LibraryApp.getAllBooks());
    updateStatisticsDisplay();
    displayBookDetails(newBook.isbn);
    event.currentTarget.reset();
    showMessage('Book added successfully.', 'success');
}

function renderMemberList() {
    if (!memberListContainer) {
        return;
    }

    memberListContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();

    (window.LibraryApp?.members ?? []).forEach((member) => {
        const card = document.createElement('div');
        card.className = 'member-card';
        card.innerHTML = `
            <h3>${member.name}</h3>
            <p class="book-meta">ID: ${member.id}</p>
            <p class="book-meta">Email: ${member.email}</p>
            <p class="book-meta">Type: ${member.membershipType}</p>
        `;
        fragment.appendChild(card);
    });

    memberListContainer.appendChild(fragment);
}

function showMessage(text, variant = 'success') {
    if (!messageBox) {
        return;
    }

    messageBox.textContent = text;
    messageBox.className = `message show ${variant}`;
    window.setTimeout(() => {
        messageBox.className = 'message';
    }, 2200);
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeUI);
    } else {
        initializeUI();
    }
}

if (typeof globalThis !== 'undefined') {
    globalThis.BOOK_COVER_IMAGES = BOOK_COVER_IMAGES;
    globalThis.getBookCoverImage = getBookCoverImage;
    globalThis.initializeUI = initializeUI;
    globalThis.renderBookCatalogue = renderBookCatalogue;
    globalThis.handleSearch = handleSearch;
    globalThis.handleFilterChange = handleFilterChange;
    globalThis.showMessage = showMessage;
    globalThis.displayBookDetails = displayBookDetails;
    globalThis.updateStatisticsDisplay = updateStatisticsDisplay;
    globalThis.setupEventListeners = setupEventListeners;
    globalThis.handleBorrowSubmit = handleBorrowSubmit;
    globalThis.handleBookClick = handleBookClick;
    globalThis.handleMemberFormSubmit = handleMemberFormSubmit;
    globalThis.handleAddBookSubmit = handleAddBookSubmit;
}
