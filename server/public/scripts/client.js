$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);

  // TODO - Add code for edit & delete buttons
  // Listener for DELETE song
  $('#bookShelf').on('click', '.delete-book', deleteBookHandler);
  $('#bookShelf').on('click', '.read-book', readBookHandler);

}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isRead}</td>
        <td>
        <button class="read-book" data-id="${book.id}">Mark As Read</button>
        <button class="delete-book" data-id="${book.id}">Delete</button>
        </td>
      </tr>
     
    `);
  }
}

// Handler for clicks on Delete button
function deleteBookHandler() {
  // call AJAX to DELETE song;
  deleteBook($(this).data("id"))
}

function readBookHandler() {
  readBook($(this).data("id"),"");
}


// DELETE AJAX call for deleting a book
function deleteBook(bookId) {
  $.ajax({
      method: 'DELETE',
      url: `/books/${bookId}`,
  })
  .then( function (response) {
      // Refresh the book list
      refreshBooks();
  })
  .catch( function(error) {
      alert('Error on deleting book.', error);
  });
}

function readBook(readId){
    $.ajax({
      method: 'PUT',
      url: `/books/${readId}`,
      data: readId
    })
    .then( function(response) {
      refreshBooks();
    })
    .catch( function(error) {
      alert('Error on vote on song', error);
    })
  }

