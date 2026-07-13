// Jest Tests - Library Management System
// Incomplete and with errors

const library = require('./library.js');

const {
    Book,
    DigitalBook,
    Member,
    PremiumMember,
    findBookByISBN,
    findBookByISBNRecursive,
    getBooksByAuthor,
    calculateTotalLateFees,
    combineBookCollections,
    addMultipleBooks,
    updateMemberInfo,
    borrowBook,
    registerMember,
    addBook,
    searchBooksByCategory,
    formatBookInfo,
    calculateFineAmount,
    LibraryStats,
    processReturnQueue,
    findOverdueBooks,
    getAllBooks,
    initializeLibrary,
    resetLibraryState
} = library;

beforeEach(() => {
    library.resetLibraryState();
    library.initializeLibrary();
});

describe('Book Class', () => {
    test('should create a book instance', () => {
        const book = new Book('978-0-123', 'Test Book', 'Author Name', 2020, 5);

        expect(book.isbn).toBe('978-0-123');
        expect(book.title).toBe('Test Book');
        expect(book.availableCopies).toBe(5);
        expect(book.totalCopies).toBe(5);
    });

    test('should track availability and checkout state', () => {
        const book = new Book('978-0-456', 'Sample', 'Author', 2021, 1);
        expect(book.isAvailable()).toBe(true);
        expect(book.checkOut('M-001')).toBe(true);
        expect(book.isAvailable()).toBe(false);
        expect(book.checkedOut).toHaveLength(1);
    });

    test('should return formatted book info', () => {
        const book = new Book('978-0-789', 'Readable', 'Writer', 2019, 2);
        expect(book.getInfo()).toContain('Readable');
        expect(book.getInfo()).toContain('Writer');
    });
});

describe('DigitalBook Class', () => {
    test('should inherit from Book and override download behavior', () => {
        const digitalBook = new DigitalBook('978-0-999', 'Guide', 'Maker', 2023, '6 MB', 'EPUB');
        expect(digitalBook).toBeInstanceOf(Book);
        expect(digitalBook.format).toBe('EPUB');
        expect(digitalBook.download('M-001')).toContain('downloaded');
    });
});

describe('Member Class', () => {
    test('canBorrow returns boolean', () => {
        const member = new Member('1', 'John Doe', 'john@example.com', 'standard');
        const result = member.canBorrow();

        expect(typeof result).toBe('boolean');
        expect(result).toBe(true);
    });

    test('should calculate membership duration and expose info', () => {
        const member = new Member('2', 'Jane Doe', 'jane@example.com', 'standard');
        expect(member.getMembershipDuration()).toBeGreaterThanOrEqual(0);
        expect(member.getMemberInfo()).toContain('Jane Doe');
    });
});

describe('PremiumMember Class', () => {
    test('should inherit and allow an extended borrow limit', () => {
        const premium = new PremiumMember('3', 'Alex', 'alex@example.com');
        expect(premium).toBeInstanceOf(Member);
        expect(premium.membershipType).toBe('premium');
        expect(premium.canBorrow()).toBe(true);
        expect(premium.benefits).toHaveLength(2);
    });
});

describe('Library Functions', () => {
    test('findBookByISBN returns a matching book', () => {
        const book = findBookByISBN('978-1-111');
        expect(book).toBeDefined();
        expect(book.title).toBe('The Great Gatsby');
    });

    test('registerMember creates a new member account', () => {
        const member = registerMember('Nina Patel', 'nina@example.com', 'standard');
        expect(member).toBeDefined();
        expect(member.name).toBe('Nina Patel');
        expect(member.email).toBe('nina@example.com');
        expect(library.members).toHaveLength(3);
    });

    test('addBook adds a new book to the catalogue', () => {
        const newBook = addBook({
            isbn: '978-9-999',
            title: 'New Horizons',
            author: 'A. Writer',
            year: 2024,
            copies: 2,
            category: 'fiction'
        });
        expect(newBook).toBeDefined();
        expect(newBook.title).toBe('New Horizons');
        expect(library.getAllBooks()).toHaveLength(5);
    });

    test('getBooksByAuthor returns matching books', () => {
        const books = getBooksByAuthor('yuval noah harari');
        expect(books).toHaveLength(1);
        expect(books[0].title).toBe('Sapiens');
    });

    test('should handle invalid author input gracefully', () => {
        expect(getBooksByAuthor('')).toEqual([]);
        expect(getBooksByAuthor(42)).toEqual([]);
    });
});

describe('Array Operations', () => {
    test('combineBookCollections should merge arrays with spread semantics', () => {
        const combined = combineBookCollections([1], [2, 3], [4]);
        expect(combined).toEqual([1, 2, 3, 4]);
    });

    test('addMultipleBooks should accept rest parameters', () => {
        const count = addMultipleBooks(new Book('a', 'A', 'Author', 2000, 1), new Book('b', 'B', 'Author', 2001, 1));
        expect(count).toBe(2);
    });

    test('updateMemberInfo uses destructuring safely', () => {
        const member = new Member('5', 'Old Name', 'old@example.com', 'standard');
        const updated = updateMemberInfo(member, { name: 'New Name', email: 'new@example.com' });
        expect(updated.name).toBe('New Name');
        expect(updated.email).toBe('new@example.com');
    });
});

describe('Recursive Functions', () => {
    test('searchBooksByCategory returns recursive matches', () => {
        const fiction = searchBooksByCategory(library.getAllBooks(), 'fiction');
        expect(fiction).toHaveLength(1);
        expect(fiction[0].title).toBe('The Great Gatsby');
    });

    test('searchBooksByCategory should return empty for invalid input', () => {
        expect(searchBooksByCategory(null, 'fiction')).toEqual([]);
    });
});

describe('Error Handling', () => {
    test('borrowBook should fail gracefully with bad data', () => {
        expect(borrowBook('', '')).toBe(false);
        expect(borrowBook('M-001', 'unknown')).toBe(false);
    });

    test('calculateFineAmount should guard invalid values', () => {
        expect(calculateFineAmount('five')).toBe(0);
        expect(calculateFineAmount(0)).toBe(0);
    });
});

describe('String Operations', () => {
    test('formatBookInfo should produce a formatted string', () => {
        const info = formatBookInfo(new Book('978-2-000', 'Book', 'Writer', 2020, 1));
        expect(info).toContain('BOOK');
        expect(info).toContain('WRITER');
    });
});

describe('Math Operations', () => {
    test('calculateFineAmount returns the expected value', () => {
        expect(calculateFineAmount(5)).toBe(2.5);
        expect(calculateFineAmount(3)).toBe(1.5);
    });
});

describe('Library Statistics', () => {
    test('statistics should update from the current library state', () => {
        LibraryStats.updateStats();
        expect(LibraryStats.totalBooks).toBeGreaterThan(0);
        expect(LibraryStats.totalMembers).toBeGreaterThan(0);
    });

    test('getMostPopularBook should return the most borrowed book', () => {
        const book = LibraryStats.getMostPopularBook();
        expect(book).toBeDefined();
    });

    test('inventory helpers should expose summary metrics', () => {
        const summary = LibraryStats.getInventorySummary();
        expect(summary).toHaveProperty('totalBooks');
        expect(LibraryStats.getAverageBooksPerMember()).toBeGreaterThanOrEqual(0);
    });
});

describe('Utility Helpers', () => {
    test('processReturnQueue and overdue search should return safe values', () => {
        expect(processReturnQueue(['A', 'B'])).toEqual(['Processed return: A', 'Processed return: B']);
        expect(findOverdueBooks('bad')).toEqual([]);
    });

    test('initialize and reset helpers should manage library state', () => {
        const state = initializeLibrary();
        expect(state.books).toHaveLength(4);
        resetLibraryState();
        expect(getAllBooks()).toEqual([]);
    });

    test('recursive ISBN lookup should find the seeded book', () => {
        expect(findBookByISBNRecursive('978-1-111')).toBeDefined();
    });
});

describe('Late Fee Calculations', () => {
    test('calculateTotalLateFees should use reduce semantics', () => {
        const memberRecord = { overdueBooks: [{ daysLate: 2 }, { daysLate: 4 }] };
        expect(calculateTotalLateFees(memberRecord)).toBe(3);
    });
});
