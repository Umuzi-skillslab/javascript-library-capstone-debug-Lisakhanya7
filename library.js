// Library Management System - Starter Code with Complex Errors

// Global state management (scoping issues)
let books = [];  // Missing declaration
let members = [];  // Wrong: should use let
const LATE_FEE_PER_DAY = 0.50;
const MAX_BOOKS_PER_MEMBER = 5;  // Missing const

// Book class with multiple issues
class Book {
    constructor(isbn, title, author, year, copies, category = 'fiction') {
        this.isbn = isbn;
        this.title = title;
        this.author = author;
        this.year = year;
        this.category = category;
        this.totalCopies = Number(copies) || 1;
        this.availableCopies = Number(copies) || 1;
        this.checkedOut = [];
    }

    // Missing: method to check availability
    // Missing: method to get book info using template literals
    isAvailable() {
        return this.availableCopies > 0;
    }

    getInfo() {
        return `Title: ${this.title} | Author: ${this.author} | ISBN: ${this.isbn}`;
    }

    checkOut(memberId) {
        // No validation for available copies
        if (!this.isAvailable()) {
            return false;
        }
        this.availableCopies -= 1;
        this.checkedOut.push({ memberId, checkedOutAt: new Date().toISOString(), daysLate: 0 });
        return true;
    }
}

// Digital book class with inheritance problems
class DigitalBook extends Book {
    constructor(isbn, title, author, year, fileSize, format, copies = 1) {
        // Missing: super() call with correct parameters
        super(isbn, title, author, year, copies, 'reference');
        this.fileSize = fileSize;
        this.format = format;
        this.downloads = 0;
    }

    download(memberId) {
        // Should override differently than physical checkout
        this.downloads += 1;
        return `${memberId} downloaded ${this.title}`;
    }
}

// Member class with errors
class Member {
    constructor(id, name, email, membershipType = 'standard') {
        this.id = id;
        this.name = name;
        this.email = email;
        this.membershipType = membershipType;
        this.borrowedBooks = [];
        this.joinDate = new Date().toISOString();
    }

    // Missing: method to calculate membership duration
    // Missing: method using destructuring
    getMembershipDuration() {
        const start = new Date(this.joinDate);
        const now = new Date();
        return Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
    }

    getMemberInfo() {
        const { id, name, email, membershipType } = this;
        return `${name} (${id}) - ${email} - ${membershipType}`;
    }

    canBorrow() {
        // Wrong comparison operator
        return this.borrowedBooks.length < MAX_BOOKS_PER_MEMBER;
    }
}

// Premium member with inheritance issues
class PremiumMember extends Member {
    constructor(id, name, email) {
        super(id, name, email, 'premium');
        this.benefits = ['Priority service', 'Extended borrow window'];
    }

    // Should override canBorrow to allow more books
    canBorrow() {
        return this.borrowedBooks.length < 10;
    }
}

// Complex function with nested loops and errors
function findOverdueBooks(daysOverdue) {
    if (typeof daysOverdue !== 'number' || Number.isNaN(daysOverdue)) {
        return [];
    }

    return books.flatMap((book) => book.checkedOut.filter((record) => Number(record.daysLate) > daysOverdue));
}

// Function with while loop error
function processReturnQueue(queue) {
    if (!Array.isArray(queue)) {
        return [];
    }

    const processed = [];
    for (const item of queue) {
        processed.push(`Processed return: ${item}`);
    }

    return processed;
}

// Recursive function with multiple errors
function searchBooksByCategory(bookList, category, index = 0) {
    if (!Array.isArray(bookList) || typeof category !== 'string' || !category.trim()) {
        return [];
    }

    if (index >= bookList.length) {
        return [];
    }

    const currentBook = bookList[index];
    const nextBooks = searchBooksByCategory(bookList, category, index + 1);

    if (currentBook && currentBook.category && currentBook.category.toLowerCase() === category.toLowerCase().trim()) {
        return [currentBook, ...nextBooks];
    }

    return nextBooks;
}

function findBookByISBNRecursive(isbn, index = 0) {
    if (typeof isbn !== 'string' || !isbn.trim()) {
        return null;
    }

    if (index >= books.length) {
        return null;
    }

    const currentBook = books[index];

    if (currentBook && currentBook.isbn === isbn.trim()) {
        return currentBook;
    }

    return findBookByISBNRecursive(isbn, index + 1);
}

// Function missing array methods
function getBooksByAuthor(authorName) {
    if (typeof authorName !== 'string' || !authorName.trim()) {
        return [];
    }

    return books.filter((book) => book.author.toLowerCase() === authorName.toLowerCase().trim());
}

// Function that should use reduce
function calculateTotalLateFees(memberRecord) {
    if (!memberRecord || !Array.isArray(memberRecord.overdueBooks)) {
        return 0;
    }

    return memberRecord.overdueBooks.reduce((total, entry) => total + Number(entry.daysLate || 0) * LATE_FEE_PER_DAY, 0);
}

// Function missing spread operator
function combineBookCollections(...collections) {
    return collections.reduce((combined, collection) => [...combined, ...(Array.isArray(collection) ? collection : [])], []);
}

// Function missing rest parameters
function addMultipleBooks(...newBooks) {
    const validBooks = newBooks.filter((book) => Boolean(book));
    books.push(...validBooks);
    return validBooks.length;
}

// Function missing destructuring
function updateMemberInfo(member, updates) {
    if (!member || typeof updates !== 'object' || updates === null) {
        return member;
    }

    const { name, email, membershipType } = updates;
    if (typeof name === 'string' && name.trim()) {
        member.name = name.trim();
    }
    if (typeof email === 'string' && email.trim()) {
        member.email = email.trim();
    }
    if (typeof membershipType === 'string' && membershipType.trim()) {
        member.membershipType = membershipType.trim();
    }

    return member;
}

// Function with no error handling
function borrowBook(memberId, isbn) {
    // Missing: try-catch block
    // Missing: validation for undefined/null
    // Missing: typeof checks
    try {
        if (typeof memberId !== 'string' || !memberId.trim()) {
            throw new Error('Member ID is required.');
        }
        if (typeof isbn !== 'string' || !isbn.trim()) {
            throw new Error('ISBN is required.');
        }

        const member = findMemberById(memberId.trim());
        const book = findBookByISBN(isbn.trim());

        if (!member) {
            throw new Error('Member not found.');
        }
        if (!book) {
            throw new Error('Book not found.');
        }
        if (!member.canBorrow()) {
            throw new Error('Member has reached the borrow limit.');
        }
        if (!book.isAvailable()) {
            throw new Error('Book is unavailable.');
        }

        const borrowed = book.checkOut(member.id);
        if (!borrowed) {
            throw new Error('Unable to borrow the selected book.');
        }
        member.borrowedBooks.push(book.isbn);
        LibraryStats.updateStats();
        return true;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

// Helper functions with errors
function findMemberById(id) {
    if (typeof id !== 'string' || !id.trim()) {
        return undefined;
    }

    return members.find((member) => member.id === id.trim());
}

function findBookByISBN(isbn) {
    if (typeof isbn !== 'string' || !isbn.trim()) {
        return null;
    }

    return books.find((book) => book.isbn === isbn.trim()) || findBookByISBNRecursive(isbn.trim(), 0);
}

// Statistics object with missing methods
const LibraryStats = {
    totalBooks: 0,
    totalMembers: 0,
    totalBorrowings: 0,

    // Missing: method using Math object for calculations
    // Missing: method using for-of loop
    // Missing: method returning object with destructuring
    updateStats() {
        this.totalBooks = books.length;
        this.totalMembers = members.length;
        this.totalBorrowings = books.reduce((count, book) => count + book.checkedOut.length, 0);
    },

    getMostPopularBook() {
        if (!books.length) {
            return null;
        }

        return books.reduce((popularBook, currentBook) => (currentBook.checkedOut.length > popularBook.checkedOut.length ? currentBook : popularBook), books[0]);
    },

    getAverageBooksPerMember() {
        if (!members.length) {
            return 0;
        }

        return Math.round((books.length / members.length) * 10) / 10;
    },

    getInventorySummary() {
        const { totalBooks, totalMembers, totalBorrowings } = this;
        return { totalBooks, totalMembers, totalBorrowings };
    }
};

// Function with string manipulation errors
function formatBookInfo(book) {
    if (!book || typeof book !== 'object') {
        return '';
    }

    const info = `Title: ${book.title?.trim() || ''}\nAuthor: ${book.author?.trim() || ''}\nYear: ${book.year || ''}`;
    return info.trim().toUpperCase();
}

// Function with number/type issues
function calculateFineAmount(daysLate) {
    if (typeof daysLate !== 'number' || Number.isNaN(daysLate) || daysLate <= 0) {
        return 0;
    }

    const fine = daysLate * LATE_FEE_PER_DAY;
    return Number(fine.toFixed(2));
}

function getAllBooks() {
    return books;
}

function registerMember(name, email, membershipType = 'standard') {
    if (typeof name !== 'string' || !name.trim()) {
        return null;
    }
    if (typeof email !== 'string' || !email.trim()) {
        return null;
    }

    const nextId = `M-${String(members.length + 1).padStart(3, '0')}`;
    const member = membershipType === 'premium'
        ? new PremiumMember(nextId, name.trim(), email.trim())
        : new Member(nextId, name.trim(), email.trim(), membershipType);

    members.push(member);
    LibraryStats.updateStats();
    return member;
}

function addBook(bookData) {
    if (!bookData || typeof bookData !== 'object') {
        return null;
    }

    const { isbn, title, author, year, copies, category = 'fiction', fileSize, format } = bookData;
    if (typeof isbn !== 'string' || !isbn.trim()) {
        return null;
    }
    if (typeof title !== 'string' || !title.trim()) {
        return null;
    }
    if (typeof author !== 'string' || !author.trim()) {
        return null;
    }

    const normalizedBook = typeof fileSize === 'string' && typeof format === 'string'
        ? new DigitalBook(isbn.trim(), title.trim(), author.trim(), Number(year) || new Date().getFullYear(), fileSize, format, Number(copies) || 1)
        : new Book(isbn.trim(), title.trim(), author.trim(), Number(year) || new Date().getFullYear(), Number(copies) || 1, category);

    books.push(normalizedBook);
    LibraryStats.updateStats();
    return normalizedBook;
}

function addSeedData() {
    if (books.length || members.length) {
        return;
    }

    const sampleBooks = [
        new Book('978-1-111', 'The Great Gatsby', 'F. Scott Fitzgerald', 1925, 3, 'fiction'),
        new Book('978-1-112', 'Sapiens', 'Yuval Noah Harari', 2011, 2, 'non-fiction'),
        new DigitalBook('978-1-113', 'JavaScript Pocket Guide', 'David Flanagan', 2022, '2.3 MB', 'PDF', 4),
        new Book('978-1-114', 'The Elements of Style', 'Strunk and White', 1999, 5, 'reference')
    ];

    const sampleMembers = [
        new Member('M-001', 'Ava Thompson', 'ava@example.com', 'standard'),
        new PremiumMember('M-002', 'Liam Chen', 'liam@example.com')
    ];

    books.push(...sampleBooks);
    members.push(...sampleMembers);
    LibraryStats.updateStats();
}

function initializeLibrary() {
    addSeedData();
    LibraryStats.updateStats();
    return { books, members };
}

function resetLibraryState() {
    books = [];
    members = [];
    LibraryStats.updateStats();
}

const libraryApi = {
    Book,
    DigitalBook,
    Member,
    PremiumMember,
    get books() {
        return books;
    },
    get members() {
        return members;
    },
    LATE_FEE_PER_DAY,
    MAX_BOOKS_PER_MEMBER,
    findOverdueBooks,
    processReturnQueue,
    searchBooksByCategory,
    findBookByISBNRecursive,
    getBooksByAuthor,
    calculateTotalLateFees,
    combineBookCollections,
    addMultipleBooks,
    updateMemberInfo,
    borrowBook,
    registerMember,
    addBook,
    findMemberById,
    findBookByISBN,
    LibraryStats,
    formatBookInfo,
    calculateFineAmount,
    getAllBooks,
    addSeedData,
    initializeLibrary,
    resetLibraryState
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = libraryApi;
}

if (typeof window !== 'undefined') {
    window.LibraryApp = libraryApi;
}
