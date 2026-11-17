/**
 * @file        app.js
 * @author      Mohamad Akl
 * @date        22/10/2026
 * @description Handles user interfaction on the page. It connects buttons and forms to actions such as add, update, delete, search and sort.
 */

const movieList = new MovieList();

// Create movie objects and add them to the movieList.
movieList.addMovie(new Movie(1, 'The Godfather', 1972, 9.2));
movieList.addMovie(new Movie(3, 'Gladiator', 2000, 8.5));
movieList.addMovie(new Movie(10, 'The Sixth Sense', 1999, 8.2));
movieList.addMovie(new Movie(7, 'Titanic', 1997, 8.0));
movieList.addMovie(new Movie(8, 'The Matrix', 1999, 8.7));
movieList.addMovie(new Movie(5, 'The Dark Knight', 2008, 9.1));
movieList.addMovie(new Movie(2, 'The Hurricane', 1999, 7.6));
movieList.addMovie(new Movie(9, 'Braveheart', 1995, 8.3));
movieList.addMovie(new Movie(4, '300', 2006, 7.6));
movieList.addMovie(new Movie(6, 'Troy', 2004, 7.3));

// Now that the movieList contains movies, display them in table format.
const tbody = document.querySelector('tbody');

function createMovieRow(movie) {
  let tr = document.createElement('tr');

  let tdId = document.createElement('td');
  tdId.textContent = movie.id;

  let tdTitle = document.createElement('td');
  tdTitle.textContent = movie.title;

  let tdYear = document.createElement('td');
  tdYear.textContent = movie.year;

  let tdRating = document.createElement('td');
  tdRating.textContent = movie.rating;

  tr.appendChild(tdId);
  tr.appendChild(tdTitle);
  tr.appendChild(tdYear);
  tr.appendChild(tdRating);

  tbody.appendChild(tr);
}

function displayMovieList(moviesToDisplay) {
  for (let i = 0; i < moviesToDisplay.length; i++) {
    createMovieRow(moviesToDisplay[i]);
  }
}

displayMovieList(movieList.movies);

function removeElements() {
  let tbody = document.querySelector('tbody');
  const rowElements = tbody.getElementsByTagName('tr');
  const len = rowElements.length - 1;
  for (let i = len; i >= 0; i--) {
    tbody.removeChild(rowElements[i]);
  }
}

function refresh() {
  removeElements();
  displayMovieList(movieList.movies);
}

//***************************************************************************** */
// Event Listeners
// Event listeners for search and sort

// Event listener for SearchByID Button
document.getElementById('searchByIdBtn').addEventListener('click', function () {
  const formElement = document.getElementById('form-list-control');

  let searchIdString = formElement['searchById'].value;
  let shortList;
  if (searchIdString === '') {
    shortList = movieList.movies;
  } else {
    const searchId = Number(searchIdString);
    shortList = movieList.searchById(searchId);
  }

  removeElements();
  displayMovieList(shortList);
});

// Event listener for SearchByTitle Button
document.getElementById('searchByTitleBtn').addEventListener('click', function () {
  const formElement = document.getElementById('form-list-control');
  let searchTitle = formElement['searchByTitle'].value;
  let shortList = movieList.searchByTitle(searchTitle);

  removeElements();
  displayMovieList(shortList);
});

//Event Listener for Sort Title A-Z Button
document.getElementById('sortA2ZBtn').addEventListener('click', function () {
  movieList.sortA2Z();
  refresh();
});

//Event Listener for Sort Title Z-A Button
document.getElementById('sortZ2ABtn').addEventListener('click', function () {
  movieList.sortZ2A();
  refresh();
});

//Event Listener for Sort By Rating Button
document.getElementById('sortByRatingBtn').addEventListener('click', function () {
  movieList.sortByRating();
  refresh();
});

// Event Listener for the Refresh Button
document.getElementById('refreshBtn').addEventListener('click', function () {
  refresh();
  const formElements = document.getElementById('form-list-control').elements;
  formElements.searchById.value = '';
  formElements.searchByTitle.value = '';
});

//=================================================================================================

// Event Listeners for add, update and delete

// The following colour codes are used for the status messages:
// Movie Id       - Orange    : #FFA500, DarkBlue: #00008B
// Input validity - Red       : #FF0000, White   : #FFFFFF
// Success        - Chartreuse: #7FFF00, Black   : #000000

// For the Add a New Movie form, there are two event listeners:
// One that listens to changes in the Movie Id input field to validate the entered id.
// One that listens to clicks on the Submit Button

// Event Listener for the Movie Id field of the Add a New Movie form
// This event listener validates the entered id of the new movie to avoid duplicate ids
document.getElementById('addMovieId').addEventListener('change', function () {
  clearMessage('msgAdd');

  const idValue = document.getElementById('addMovieId').value;
  const addMovieId = Number(idValue);
  const idIsValid = addMovieId > 0 && Number.isInteger(addMovieId);

  if (!idIsValid) {
    showMessage('msgAdd', 'Invalid Id, must be a positive integer', 'red', 'white');
    return;
  }

  if (movieList.idExists(addMovieId)) {
    showMessage('msgAdd', 'Movie Id already exists. Enter a different Id.', 'Orange', 'darkblue');
  }
});

// Event Listener for the Submit button of the Add a New Movie form
// This event listener reads the data in the form input fields, validates them before adding the new movie to the movie list
document.getElementById('addSubmit').addEventListener('click', function () {
  const formElements = document.getElementById('form-add').elements;
  const movieId = Number(formElements['movieId'].value);
  const title = formElements['title'].value;
  const year = Number(formElements['year'].value);
  const rating = Number(formElements['rating'].value);

  const idIsValid = movieId > 0 && Number.isInteger(movieId);
  const titleIsValid = /^[a-z0-9\s]+$/i.test(title);
  const yearIsValid = year > 0 && Number.isInteger(year);
  const ratingIsValid = Number.isFinite(rating) && rating >= 1 && rating <= 10;

  if (!idIsValid) {
    showMessage(
      'msgAdd',
      'Movie Not Added! Invalid Id, must be a positive integer',
      'red',
      'white'
    );
    return;
  }

  if (movieList.idExists(movieId)) {
    showMessage('msgAdd', 'Movie Not Added! Invalid Id, must be unique', 'red', 'white');
    return;
  }

  if (!titleIsValid) {
    showMessage(
      'msgAdd',
      'Movie Not Added! Invalid title, must be alphanumeric with spaces only',
      'red',
      'white'
    );
    return;
  }

  if (!yearIsValid) {
    showMessage(
      'msgAdd',
      'Movie Not Added! Invalid year, must be a positive integer',
      'red',
      'white'
    );
    return;
  }

  if (!ratingIsValid) {
    showMessage(
      'msgAdd',
      'Movie Not Added! Invalid rating, must be a number between 1 and 10',
      'red',
      'white'
    );
    return;
  }

  // Update the movieList wit the new movie
  movieList.addMovie(new Movie(movieId, title, year, rating));
  refresh();

  // Show success message
  showMessage('msgAdd', 'Movie Added', 'chartreuse', 'black');

  // Clear the input fields
  clearForm('form-add');
});

// =====================================================================================================

// For the Update a Movie form, there are two event listeners:
// One that listens to changes in the Movie Id input field to validate the entered id and populate
// the related movie details in the respective form fields
// One that listens to clicks on the Submit Button

// Event listener for the Movie Id field of the Update a Movie form.
// This event listeners validates the entered Movie Id, and then populates the movie details
// related to the validated id in the repective form fields.
document.getElementById('upMovieId').addEventListener('change', function () {
  clearMessage('msgUpdate');

  const idValue = document.getElementById('upMovieId').value;
  const upMovieId = Number(idValue);
  const idIsValid = upMovieId > 0 && Number.isInteger(upMovieId);

  if (!idIsValid) {
    showMessage('msgUpdate', 'Invalid Id, must be a positive integer', 'red', 'white');
    return;
  }

  if (!movieList.idExists(upMovieId)) {
    showMessage('msgUpdate', 'No movie found with this Id', 'Orange', 'darkblue');
    formElements = document.getElementById('form-update').elements;
    formElements.title.value = '';
    formElements.year.value = '';
    formElements.rating.value = '';
    return;
  }

  const title = document.getElementById('upTitle');
  const year = document.getElementById('upYear');
  const rating = document.getElementById('upRating');

  const movie = movieList.searchById(upMovieId)[0];
  title.value = movie.title;
  year.value = movie.year;
  rating.value = movie.rating;
});

// Event Listener for the Submit Button of the Update a Movie form
document.getElementById('updateSubmit').addEventListener('click', function () {
  const formElements = document.getElementById('form-update').elements;

  const movieId = Number(formElements['movieId'].value);
  const title = formElements['title'].value;
  const year = Number(formElements['year'].value);
  const rating = Number(formElements['rating'].value);

  const idIsValid = movieId > 0 && Number.isInteger(movieId);
  const titleIsValid = /^[a-z0-9\s]+$/i.test(title);
  const yearIsValid = year > 0 && Number.isInteger(year);
  const ratingIsValid = Number.isFinite(rating) && rating >= 1 && rating <= 10;

  if (!idIsValid) {
    showMessage(
      'msgUpdate',
      'No movie updated! Enter a valid Movie Id to continue.',
      'red',
      'white'
    );
    return;
  }

  if (!movieList.idExists(movieId)) {
    showMessage('msgUpdate', 'No such movie id exists', 'red', 'white');
    formElements.movieId.value = '';
    return;
  }

  if (!titleIsValid) {
    showMessage(
      'msgUpdate',
      'Movie Not Updated! Invalid title, must be alphanumeric with spaces only',
      'red',
      'white'
    );
    return;
  }

  if (!yearIsValid) {
    showMessage('msgUpdate', 'Movie Not Updated! Invalid year, must be an integer', 'red', 'white');
    return;
  }

  if (!ratingIsValid) {
    showMessage(
      'msgUpdate',
      'Movie Not Updated! Invalid rating, must be a number between 1 and 10',
      'red',
      'white'
    );
    return;
  }

  // Update the movie details with the changes made
  movieList.updateMovie(movieId, title, year, rating);
  refresh();

  // Show success message
  showMessage('msgUpdate', 'Movie Updated', 'chartreuse', 'black');

  // Clear the input fields
  clearForm('form-update');
});

// =====================================================================================================

// For the Delete a Movie form, there is one event listener that listens to the clicks on the Submit button.

document.getElementById('deleteSubmit').addEventListener('click', function () {
  const movieId = Number(document.getElementById('delMovieId').value);
  const idIsValid = movieId > 0 && Number.isInteger(movieId);

  if (!idIsValid) {
    showMessage('msgDelete', 'Invalid Id, must be a positive integer', 'red', 'white');
    return;
  }

  const movie = movieList.searchById(movieId)[0];

  if (!movieList.idExists(movieId)) {
    showMessage('msgDelete', 'No such movie id exists', 'Orange', 'darkblue');
    return;
  }

  const confirmed = window.confirm(`Do you want to delete movie "${movie.title}"?`);

  if (!confirmed) {
    showMessage('msgDelete', 'Delete Cancelled', 'Orange', 'darkblue');
    clearForm('form-delete');
    return;
  }

  movieList.deleteMovie(movieId);
  refresh();
  showMessage('msgDelete', 'Movie Deleted', 'chartreuse', 'black');
  clearForm('form-delete');
});

//==============================================================================================================

// Event listeners for tabs
document.getElementById('addTab').addEventListener('click', function (event) {
  clearForm('form-add');
  openForm(event, 'Add');
  clearMessage('msgAdd');
});
document.getElementById('updateTab').addEventListener('click', function (event) {
  clearForm('form-update');
  openForm(event, 'Update');
  clearMessage('msgUpdate');
});
document.getElementById('deleteTab').addEventListener('click', function (event) {
  clearForm('form-delete');
  openForm(event, 'Delete');
  clearMessage('msgDelete');
});

// This is used to select the Add a New Movie tab when the page loads
document.getElementById('addTab').click();

// This function is used to show the active form when the user clicks the related button.
// It is called by the tabs event listeners
/**
 * @function openForm
 * @param {object} evt - the event object.
 * @param {string} action - The name of the action being used.
 */

function openForm(evt, action) {
  // declare variables
  let i, tabContent, tabLinks;

  // Get All elements that have the classname of tabcontent.
  tabContent = document.getElementsByClassName('tabcontent');
  for (i = 0; i < tabContent.length; i++) {
    // Set display to none for all elements(with tabcontent);
    tabContent[i].style.display = 'none';
  }
  // Get All elements with the class name of tablinks and remove the class of active.
  tabLinks = document.getElementsByClassName('tablinks');
  for (i = 0; i < tabLinks.length; i++) {
    tabLinks[i].className = tabLinks[i].className.replace('active', '');
  }

  // Show the current tab, and add the active class to the button that opened the tab.
  document.getElementById(action).style.display = 'block';
  evt.currentTarget.className += ' active';
}

//===========================================================================================================

// This function is used to show status messages to the user when Adding,Updating or Deleting a movie
/**
 * @function showMessage
 * @param {string} elementId - the id of the message box element
 * @param {string} message - the message to display
 * @param {string} colour - the colour of the message box background
 * @param {string} text - the colour of the text in the message box
 */
function showMessage(elementId, message, backgroundColour, textColour) {
  const msg = document.getElementById(elementId);

  msg.style.display = 'block';
  msg.textContent = message;
  msg.style.backgroundColor = backgroundColour;
  msg.style.color = textColour;
}

// This function clears the input fields of the form
/**
 * @function clearForm
 * @param {string} formId - the id of the form
 */
function clearForm(formId) {
  document.getElementById(formId).reset();
}

// This function is used to clear status messages shown to the user when Adding,Updating or Deleting a movie
/**
 * @function clearMessage
 * @param {string} elementId - the id of the message box element
 */

function clearMessage(elementId) {
  const msg = document.getElementById(elementId);

  msg.textContent = '';
  msg.style.backgroundColor = '';
  msg.style.color = '';
}
