// Library UI - DOM Manipulation with Complex Errors

// Missing: proper initialization with DOMContentLoaded
let catalogueContainer;
let searchInput;
let filterDropdown;
let borrowForm;
let detailsContainer;
let memberFormContainer;
let memberListContainer;
let messageBox;
let addBookFormContainer;
let addBookForm;

const BOOK_COVER_IMAGES = [
    'covers/Screenshot 2026-07-13 093445.png',
    'covers/Screenshot 2026-07-13 0936102.png',
    'covers/Screenshot 2026-07-13 0941503.png',
    'covers/Screenshot 2026-07-13 0943123.png',
    'covers/Screenshot_13-7-2026_93918_.jpeg',
    'covers/Screenshot_13-7-2026_94354_.jpeg'
];

function getBookCoverImage(book, index) {
    const imageName = BOOK_COVER_IMAGES[index % BOOK_COVER_IMAGES.length];
    return `./${encodeURI(imageName)}`;
}

function initializeUI() {
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

    if (typeof window.LibraryApp !== 'undefined') {
        window.LibraryApp.initializeLibrary();
    }

    setupEventListeners();
    renderBookCatalogue(window.LibraryApp.getAllBooks());
    updateStatisticsDisplay();
    createMemberForm();
    createBookForm();
    renderMemberList();
}

function setupEventListeners() {
    // Missing: search input event listener
    searchInput.addEventListener('input', handleSearch);
    // Wrong event type
    filterDropdown.addEventListener('change', handleFilterChange);
    // Missing: form submission prevention
    borrowForm.addEventListener('submit', handleBorrowSubmit);
    // Missing: event delegation for dynamic elements
    catalogueContainer.addEventListener('click', handleBookClick);

    const tabs = [
        document.getElementById('catalogue-tab'),
        document.getElementById('members-tab'),
        document.getElementById('statistics-tab')
    ];

    tabs.forEach((tab) => {
        if (tab) {
            tab.addEventListener('click', () => {
                const sectionId = tab.id.replace('-tab', '-section');
                document.querySelectorAll('main section').forEach((section) => {
                    if (section.id === 'borrow-section') {
                        section.style.display = 'block';
                    } else {
                        section.style.display = section.id === sectionId ? 'block' : 'none';
                    }
                });
            });
        }
    });
}

// Complex DOM rendering with errors
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
        const bookCard = document.createElement('article');
        bookCard.className = 'book-card';
        bookCard.dataset.bookId = book.isbn;
        bookCard.innerHTML = `
            <div class="book-cover">
                <img src="${getBookCoverImage(book, index)}" alt="${book.title} cover">
            </div>
            <div class="book-info">
                <h3>${book.title}</h3>
                <span class="badge">${book.category}</span>
                <p class="book-meta">Author: ${book.author}</p>
                <p class="book-meta">Available: ${book.availableCopies}</p>
                <p class="book-meta">ISBN: ${book.isbn}</p>
            </div>
        `;
        fragment.appendChild(bookCard);
    });

    catalogueContainer.appendChild(fragment);
}

// Function with event handling errors
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

    const success = window.LibraryApp.borrowBook(memberId, isbn);
    if (success) {
        showMessage('Book borrowed successfully.', 'success');
        borrowForm.reset();
        renderBookCatalogue(window.LibraryApp.getAllBooks());
        updateStatisticsDisplay();
        displayBookDetails(isbn);
    } else {
        showMessage('Unable to complete the borrow request.', 'error');
    }
}

// Function missing event delegation
function handleBookClick(event) {
    const card = event.target.closest('.book-card');
    if (!card) {
        return;
    }

    const bookId = card.dataset.bookId;
    displayBookDetails(bookId);
}

// Search function with errors
function handleSearch(event) {
    const searchTerm = event.target.value.trim().toLowerCase();
    const selectedCategory = filterDropdown ? filterDropdown.value : 'all';
    const results = window.LibraryApp.getAllBooks().filter((book) => {
        const titleMatch = book.title.toLowerCase().includes(searchTerm);
        const authorMatch = book.author.toLowerCase().includes(searchTerm);
        const categoryMatch = selectedCategory === 'all' || book.category === selectedCategory;
        return (titleMatch || authorMatch) && categoryMatch;
    });

    renderBookCatalogue(results);
}

// Function with filter errors
function handleFilterChange() {
    const selectedCategory = filterDropdown ? filterDropdown.value : 'all';
    const activeTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const filtered = window.LibraryApp.getAllBooks().filter((book) => {
        const categoryMatch = selectedCategory === 'all' || book.category === selectedCategory;
        const textMatch = !activeTerm || book.title.toLowerCase().includes(activeTerm) || book.author.toLowerCase().includes(activeTerm);
        return categoryMatch && textMatch;
    });

    renderBookCatalogue(filtered);
}

// Function missing JSON operations
function exportLibraryData() {
    try {
        const data = {
            books: window.LibraryApp.getAllBooks(),
            members: window.LibraryApp.members
        };
        return JSON.stringify(data);
    } catch (error) {
        console.error(error.message);
        return '';
    }
}

// Function missing JSON parsing
function importLibraryData(jsonString) {
    try {
        const parsed = JSON.parse(jsonString);
        if (!parsed || !Array.isArray(parsed.books) || !Array.isArray(parsed.members)) {
            throw new Error('Invalid library data.');
        }
        window.LibraryApp.resetLibraryState();
        window.LibraryApp.books.push(...parsed.books);
        window.LibraryApp.members.push(...parsed.members);
        window.LibraryApp.LibraryStats.updateStats();
        renderBookCatalogue(window.LibraryApp.getAllBooks());
        updateStatisticsDisplay();
    } catch (error) {
        console.error(error.message);
    }
}

// LocalStorage functions with errors
function saveToLocalStorage() {
    try {
        localStorage.setItem('libraryBooks', JSON.stringify(window.LibraryApp.getAllBooks()));
        localStorage.setItem('libraryMembers', JSON.stringify(window.LibraryApp.members));
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
        window.LibraryApp.resetLibraryState();
        window.LibraryApp.books.push(...bookList);
        window.LibraryApp.members.push(...memberList);
        window.LibraryApp.LibraryStats.updateStats();
        renderBookCatalogue(window.LibraryApp.getAllBooks());
        updateStatisticsDisplay();
    } catch (error) {
        console.error(error.message);
    }
}

// Display function with template issues
function displayBookDetails(isbn) {
    if (!detailsContainer) {
        return;
    }

    const book = window.LibraryApp.findBookByISBN(isbn);
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

// Statistics display with errors
function updateStatisticsDisplay() {
    const totalBooksEl = document.querySelector('.total-books');
    const totalMembersEl = document.querySelector('.total-members');
    const borrowedBooksEl = document.querySelector('.books-borrowed');

    if (totalBooksEl) {
        totalBooksEl.textContent = window.LibraryApp.getAllBooks().length;
    }
    if (totalMembersEl) {
        totalMembersEl.textContent = window.LibraryApp.members.length;
    }
    if (borrowedBooksEl) {
        borrowedBooksEl.textContent = window.LibraryApp.getAllBooks().reduce((count, book) => count + book.checkedOut.length, 0);
    }
}

// Dynamic form generation with errors
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

    const newMember = window.LibraryApp.registerMember(nameInput.value, emailInput.value, typeInput.value);
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

    const newBook = window.LibraryApp.addBook({
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

    window.LibraryApp.members.forEach((member) => {
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

// Initialize on wrong event
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initializeUI);
}
