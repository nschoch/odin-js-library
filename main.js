let myLibrary = [];

function Book(title, author, pages, read) {
    // the constructor...
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

function addBookToLibrary() {
    let bookEntry;
    for(let i = 0; i < myLibrary.length; i++) {
        if(myLibrary[i].title === titleInput.value && myLibrary[i].author === authorInput.value) {
            alert("This book already exists!");
            return false;
        }
        else {
            //pass
        }
    }

    markRead = checkYes.checked ? true : false;
    bookEntry = new Book(titleInput.value, authorInput.value, pagesInput.value, markRead);
    myLibrary.push(bookEntry);
    return(bookEntry);
}

// Initialise all document variables here

const modal = document.querySelector(".modal");
const addNewBook = document.querySelector(".button--new");
const closeBtn = document.querySelector(".form__close");
const submitBtn = document.querySelector(".form__submit");
const titleInput = document.querySelector(".form__input--title");
const authorInput = document.querySelector(".form__input--author");
const pagesInput = document.querySelector(".form__input--pages");
const checkYes = document.querySelector(".form__radio--read");
const checkNo = document.querySelector(".form__radio--notRead");
const formInputFields = document.querySelectorAll(".form__input");
const formInputRadios = document.querySelectorAll(".form__radio");
const form = document.querySelector(".form");
const book = document.querySelector(".book");
const allBooks = document.getElementsByClassName("book");
const bookshelf = document. querySelector('.library-container');
const deleteBookBtn = document.querySelector(".book__delete");
let updatedBookList = document.getElementsByClassName('book__title');

// Listen for click on new book button, and activate function to display modal
const openModal = () => modal.style.display = "block";
addNewBook.addEventListener("click", openModal);

// Listen for click on close button, and activate function to hide modal
const closeModal = () => modal.style.display = "none";
closeBtn.addEventListener("click", closeModal)

// Listen for click outside of modal and close modal
const clickOutside = function(e) {
    if(e.target == modal) {
        modal.style.display = "none";
    }
};

window.addEventListener("click", clickOutside);

function renderBook(book, index) {
    let bookDiv = document.createElement("div");
    let deleteBtn = document.createElement("span");
    let readStatusBtnYes = document.createElement("button");
    let readStatusBtnNo = document.createElement("button");
    deleteBtn.classList.add("book__delete");
    deleteBtn.innerHTML = "&times;";
    bookDiv.classList.add("book");
    bookDiv.dataset.id = index;
    for(let property in book) {
      let bookDetails = document.createElement("div");
      if(property === "read" && book[property] === true) {
        bookDetails.classList.add("book__read--yes");
      }
      else if(property === "read" && book[property] === false) {
        bookDetails.classList.add("book__read--no");
      }
      else {
        bookDetails.textContent = book[property];
      }
      bookDetails.classList.add("book__property");
      bookDetails.classList.add(`book__${property}`);
      bookDiv.appendChild(bookDetails);
    }
    let readStatusDiv = bookDiv.querySelector(".book__read");
    readStatusDiv.appendChild(readStatusBtnYes);
    readStatusBtnYes.textContent = "Yes";
    readStatusBtnYes.classList.add("book__read-status");
    readStatusBtnYes.classList.add("book__read-status--yes");
    readStatusDiv.appendChild(readStatusBtnNo);
    readStatusBtnNo.classList.add("book__read-status");
    readStatusBtnNo.classList.add("book__read-status--no");
    readStatusBtnNo.textContent = "No";
    if(readStatusDiv.classList.contains("book__read--yes")) {
      readStatusBtnYes.classList.add("book__read-status--selected");
    }
    else {
      readStatusBtnNo.classList.add("book__read-status--selected");
    }

    bookDiv.appendChild(deleteBtn);
    addBookDeleteEvent(deleteBtn);
    addReadStatusEvent(readStatusBtnYes);
    addReadStatusEvent(readStatusBtnNo);
    bookshelf.appendChild(bookDiv);
}

//add sample book on page load
let lotr = new Book("The Lord of the Rings", "J.R.R. Tolkien", 423, true);
myLibrary.push(lotr);

function renderLibrary() {
  let currentDisplayedBookTitles = (Array.from(allBooks)).map(book => book.firstElementChild.textContent);
  let currentDisplayedBookAuthors = (Array.from(allBooks)).map(book => book.querySelector(".book__author").textContent);
  for(let i=0; i < myLibrary.length; i++) {
    if(currentDisplayedBookTitles.includes(myLibrary[i].title) &&
    currentDisplayedBookAuthors.includes(myLibrary[i].author)) {
      let bookmark = currentDisplayedBookTitles.indexOf(myLibrary[i].title);;
      allBooks[bookmark].dataset.id = i;
    }
    else {
      renderBook(myLibrary[i], i);
    }
  }
  deleteBooks();
}

window.addEventListener("load", checkStored);

function checkStored() {
  if(!localStorage.getItem("myLibrary")) {
    renderLibrary();
  }
  else {
    myLibrary = JSON.parse((localStorage.getItem("myLibrary")));
    renderLibrary();
  }
}

form.addEventListener("submit", function(e) {
  e.preventDefault();
  closeModal();
  addBookToLibrary();
  renderLibrary();
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
  Array.from(formInputFields).forEach(function(inputField) {
    inputField.value = "";
  })
  Array.from(formInputRadios).forEach(function(radio) {
    radio.checked = false;
  })
})

function addBookDeleteEvent(node) {
  node.addEventListener("click", function(e) {
    let bookToRemove = e.target.parentNode;
    myLibrary.splice(parseInt(bookToRemove.dataset.id), 1);
    renderLibrary();
  });
}

function deleteBooks() {
  let currentDisplayedBooks = Array.from(allBooks);
  let myLibraryTitles = myLibrary.map(book => book.title);
  for(let i = 0; i < currentDisplayedBooks.length; i++) {
    if(myLibraryTitles.includes(currentDisplayedBooks[i].firstElementChild.textContent)) {

    }
    else {
      currentDisplayedBooks[i].remove();
    }
  }
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

function addReadStatusEvent(node) {
  node.addEventListener("click", function(e) {
    changeReadStatus(e.target, e.target.parentNode, e.target.textContent);
  });
}

function changeReadStatus(target, parent, btnPressed) {
  let bookId = (parent.parentNode).dataset.id;
  if(btnPressed === "Yes" && !myLibrary[bookId].read) {
    target.classList.toggle("book__read-status--selected")
    target.nextSibling.classList.toggle("book__read-status--selected")
    parent.classList.toggle("book__read--yes");
    myLibrary[bookId].read = true;
  } 
  else if (btnPressed === "No" && myLibrary[bookId].read) {
    parent.classList.toggle("book__read--no");
    target.classList.toggle("book__read-status--selected");
    target.previousSibling.classList.toggle("book__read-status--selected");
    myLibrary[bookId].read = false;
  }
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}
