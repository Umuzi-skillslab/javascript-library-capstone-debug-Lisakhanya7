# Library Management System

A polished digital library experience that combines a modern JavaScript data model, interactive DOM rendering, and a tested library workflow for browsing, borrowing, and managing members.

## Overview
The application provides a working library dashboard for browsing the catalogue, borrowing books, registering members, adding new books, and reviewing simple library statistics. The core logic is implemented in JavaScript with ES6+ classes and tested with Jest.

## Critical Issues Found
- Missing and improperly scoped state variables for books and members.
- Incomplete class methods for availability, member info, and borrow limits.
- Broken inheritance for digital books and premium members.
- Missing validation around borrowing and form submissions.
- Incomplete DOM wiring for search, filters, and dynamic rendering.
- Missing persistence APIs for JSON and localStorage.
- Insufficient automated test coverage for the required workflows.

## Fixes Implemented
### JavaScript core
- Added proper state declarations with let/const.
- Completed the Book, DigitalBook, Member, and PremiumMember classes.
- Implemented borrow validation, registration, and add-book flows.
- Leveraged array helpers such as filter, reduce, find, and flatMap.
- Added destructuring, template literals, spread/rest usage, and stronger type checks.

### DOM and UI
- Wired up search, filter, borrow, member registration, and book creation forms.
- Added null-safe DOM handling and event delegation for dynamic cards.
- Rendered updated catalogue, book details, member list, and statistics after user actions.

### Testing and reliability
- Expanded the Jest suite with success and failure cases for library logic and user-facing workflows.
- Added coverage reporting and verified the suite passes.

## Modern Features Added
- ES6+ class-based data model
- Destructuring and template literals throughout the app
- Spread and rest operators for array operations
- Robust try/catch error handling and validation
- Local persistence via JSON and localStorage

## Getting Started
1. Install dependencies with npm install.
2. Open index.html in a browser to use the app.
3. Run npm test to execute the test suite.
4. Run npm test -- --coverage for coverage output.

## Key Functionality
- Browse and search the catalogue
- Borrow books with member validation
- Register new members
- Add new books to the library
- Review total books, members, and borrow counts

## Project Structure
- library.js: core model, classes, validation, and library helpers
- ui.js: DOM rendering, event listeners, and form handling
- src/storage.js: JSON and localStorage persistence helpers
- src/validators.js: reusable input validation helpers
- tests: Jest-based regression tests for the core workflows

## Key API Methods
- registerMember(name, email, membershipType): creates a new member account
- addBook(bookData): appends a new book to the catalogue
- borrowBook(memberId, isbn): validates borrow eligibility and updates state
- initializeLibrary(): seeds the app with sample data
- resetLibraryState(): clears the books and members collections

## Testing and Coverage
- npm test
- npm test -- --coverage

The current suite passes with 28 tests and coverage above the 80% target.

## Notes
The app uses in-browser state and localStorage so the current library data is preserved across refreshes when available.
