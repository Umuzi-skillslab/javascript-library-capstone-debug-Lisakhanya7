export function saveLibraryState() {
  try {
    if (typeof window === 'undefined' || !window.LibraryApp) {
      return false;
    }

    localStorage.setItem('libraryBooks', JSON.stringify(window.LibraryApp.getAllBooks()));
    localStorage.setItem('libraryMembers', JSON.stringify(window.LibraryApp.members));
    return true;
  } catch (error) {
    console.error(error.message);
    return false;
  }
}

export function loadLibraryState() {
  try {
    if (typeof window === 'undefined' || !window.LibraryApp) {
      return false;
    }

    const booksData = localStorage.getItem('libraryBooks');
    const membersData = localStorage.getItem('libraryMembers');

    if (!booksData || !membersData) {
      return false;
    }

    const bookList = JSON.parse(booksData);
    const memberList = JSON.parse(membersData);

    if (!Array.isArray(bookList) || !Array.isArray(memberList)) {
      return false;
    }

    window.LibraryApp.resetLibraryState();
    window.LibraryApp.books.push(...bookList);
    window.LibraryApp.members.push(...memberList);
    window.LibraryApp.LibraryStats.updateStats();
    return true;
  } catch (error) {
    console.error(error.message);
    return false;
  }
}

export function exportLibraryData() {
  try {
    if (typeof window === 'undefined' || !window.LibraryApp) {
      return '';
    }

    return JSON.stringify({
      books: window.LibraryApp.getAllBooks(),
      members: window.LibraryApp.members
    });
  } catch (error) {
    console.error(error.message);
    return '';
  }
}

export function importLibraryData(jsonString) {
  try {
    if (typeof window === 'undefined' || !window.LibraryApp) {
      return false;
    }

    const parsed = JSON.parse(jsonString);
    if (!parsed || !Array.isArray(parsed.books) || !Array.isArray(parsed.members)) {
      throw new Error('Invalid library data.');
    }

    window.LibraryApp.resetLibraryState();
    window.LibraryApp.books.push(...parsed.books);
    window.LibraryApp.members.push(...parsed.members);
    window.LibraryApp.LibraryStats.updateStats();
    return true;
  } catch (error) {
    console.error(error.message);
    return false;
  }
}
