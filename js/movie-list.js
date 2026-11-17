/**
 * @file        movie-list.js
 * @author      Mohamad Akl
 * @date        22/10/2026
 * @description manages the collection of movies and provides methods to add, update, delete, search, and sort them
 */

class MovieList {
  constructor() {
    this.movies = [];
  }

  addMovie(movie) {
    this.movies.push(movie);
  }

  deleteMovie(id) {
    let newList = [];

    for (let i = 0; i < this.movies.length; i++) {
      if (this.movies[i].id !== id) {
        newList.push(this.movies[i]);
      }
    }

    this.movies = newList;
  }

  updateMovie(id, title, year, rating) {
    for (let i = 0; i < this.movies.length; i++) {
      if (this.movies[i].id === id) {
        this.movies[i].title = title;
        this.movies[i].year = year;
        this.movies[i].rating = rating;
        break;
      }
    }
  }

  idExists(id) {
    return this.searchById(id).length > 0;
  }

  searchById(searchId) {
    let shortList = [];

    for (let movie of this.movies) {
      if (movie.id === searchId) {
        shortList.push(movie);
        break;
      }
    }
    return shortList;
  }

  searchByTitle(searchTitle) {
    let shortList = [];
    for (let movie of this.movies) {
      if (movie.title.toLowerCase().includes(searchTitle.toLowerCase())) {
        shortList.push(movie);
      }
    }
    return shortList;
  }

  // Sort
  // Sort A - Z
  // Compare 2 values, A will go before B
  // Sort in ascending order
  sortA2Z() {
    this.movies.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
  }

  // Sort Z - A
  // Sort in decending order
  sortZ2A() {
    this.movies.sort(function (a, b) {
      return b.title.localeCompare(a.title);
    });
  }

  // Sort by Rating in descending order
  sortByRating() {
    this.movies.sort(function (a, b) {
      return b.rating - a.rating;
    });
  }

  //************************************************************************************************/
}
