let Book = require('../models/book');
let Author = require('../models/author');
let BookInstance = require('../models/bookinstance');
let Genre = require('../models/genre');
let async = require('async');
let {body, validationResult} = require('express-validator');

exports.index = function (req, res) {
    async.parallel({
        book_count: function (callback) {
            Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        book_instance_count: function (callback) {
            BookInstance.countDocuments({}, callback);
        },
        book_instance_available_count: function (callback) {
            BookInstance.countDocuments({status: 'Available'}, callback);
        },
        author_count: function (callback) {
            Author.countDocuments({}, callback);
        },
        genre_count: function (callback) {
            Genre.countDocuments({}, callback);
        }
    }, function (err, results) {
        res.render('index', {title: 'Local Library Home', error: err, data: results});
        //    console.log(results);
    });

};

// Display list of all books.
exports.book_list = function (req, res, next) {

    Book.find({}, 'title author') //just select title and author field
        // replace the author(ID) by real author object has the same ID - like JOIN in SQL
        .populate('author')
        .exec((err, list_books) => {
            if (err) {
                return next(err);
            }
            res.render('book_list', {title: 'Book List', book_list: list_books});
            // console.log(list_books);
        })
};

// Display detail page for a specific book.
exports.book_detail = function (req, res, next) {
    async.parallel({
        book: function (callback) {
            Book.findById(req.params.id)
                .populate('author')
                .populate('genre')
                .exec(callback);
        },
        book_instance: function (callback) {
            //-- BookInstance có 1 field là book = book._id (FK)
            BookInstance.find({'book': req.params.id})
                .exec(callback);
        }
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        if (results.book == null) { // No results.
            let err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('book_detail', {
            title: results.book.title,
            book: results.book,
            book_instances: results.book_instance
        });
    });
};

// Display book create form on GET.
exports.book_create_get = function (req, res, next) {
    // get all authors and genres, for adding with book
    async.parallel({
        authors: function (callback) {
            Author.find().exec(callback);
        },
        genres: function (callback) {
            Genre.find().exec(callback);
        }
    }, function (err, results) {
        if (err) return next(err);
        res.render('book_form', {title: 'Create Book', authors: results.authors, genres: results.genres})
    })
};

// Handle book create on POST.
// array of middleware functions
exports.book_create_post = [
    // convert the genre to an array
    function (req, res, next) {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === 'undefined')
                req.body.genre = [];
            else
                req.body.genre = new Array(req.body.genre);
        }
        next();
    },
    // validate and sanitize fields
    // use withMessage()
    body('title').trim().isLength({min: 1}).withMessage('Title must not be empty').escape(),
    // not use withMessage()
    body('author', 'Author must not be empty.').trim().isLength({min: 1}).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({min: 1}).escape(),
    body('isbn', 'ISBN must not be empty').trim().isLength({min: 1}).escape(),
    // ' * ' -> "sanitise every item below key genre"
    body('genre.*').escape(),

    // process req after validation and sanitization
    function (req, res, next) {
        const errors = validationResult(req);
        let book = new Book({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre
        });
        if (!errors.isEmpty()) {
            // errors occur -> render form again with sanitized values
            async.parallel({
                authors: function (callback) {
                    Author.find().exec(callback);
                },
                genres: function (callback) {
                    Genre.find().exec(callback);
                }
            }, function (err, results) {
                if (err) return next(err);

                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked = 'true';
                    }
                }
                res.render('book_form', {
                    title: 'Create book', authors: results.authors
                    , genres: results.genres, book: book, errors: errors.array()
                })
            });
        } else {
            book.save(function (err) {
                res.redirect(book.url);
            })
        }
    }

]
// Display book delete form on GET.
exports.book_delete_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function (req, res, next) {
    async.parallel({
        book: function (callback) {
            Book.findById(req.params.id)
                .populate('author')
                .populate('genre')
                .exec(callback);
        },
        authors: function (callback) {
            Author.find().exec(callback);
        },
        genres: function (callback) {
            Genre.find().exec(callback);
        }
    }, function (err, results) {
        if (err) next(err);
        if (results.book == null) {
            let err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        for (let i = 0; i < results.genres.length; i++) {
            for (let j = 0; j < results.book.genre.length; j++) {
                if (results.genres[i]._id.toString() === results.book.genre[j]._id.toString()){
                    results.genres[i].checked = 'true';
                    // results.genres[i].check = 'hello'
                }
            }
        }
        res.render('book_form', { title: 'Update Book', authors: results.authors, genres: results.genres, book: results.book })
    });

};

// Handle book update on POST.
exports.book_update_post = [
    //-- Convert the genre to an array
    function (req, res, next) {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === 'undefined')
                req.body.genre = [];
            else
                req.body.genre = new Array(req.body.genre);
        }
        next();
    },
    // validate and sanitize fields
    // use withMessage()
    body('title').trim().isLength({min: 1}).withMessage('Title must not be empty').escape(),
    // not use withMessage()
    body('author', 'Author must not be empty.').trim().isLength({min: 1}).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({min: 1}).escape(),
    body('isbn', 'ISBN must not be empty').trim().isLength({min: 1}).escape(),
    // ' * ' -> "sanitise every item below key genre"
    body('genre.*').escape(),

    // process req after validation and sanitization
    function (req, res, next) {
        const errors = validationResult(req);

        let book = new Book({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre
        });
        if (!errors.isEmpty()) {
            // errors occur -> render form again with sanitized values
            async.parallel({
                authors: function (callback) {
                    Author.find().exec(callback);
                },
                genres: function (callback) {
                    Genre.find().exec(callback);
                }
            }, function (err, results) {
                if (err) return next(err);

                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked = 'true';
                    }
                }
                res.render('book_form', {
                    title: 'Update book', authors: results.authors
                    , genres: results.genres, book: book, errors: errors.array()
                })
            });
        } else {
            book.save(function (err) {
                res.redirect(book.url);
            })
        }
    }

]