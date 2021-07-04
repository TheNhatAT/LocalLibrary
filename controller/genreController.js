let Genre = require('../models/genre');
let Book = require('../models/book');
let async = require('async');
//-- Destructuring
let {body, validationResult } = require('express-validator');

// Display list of all Genre.
exports.genre_list = function(req, res, next) {
    Genre.find()
        .sort([['name', 'ascending']])
        .exec(function (err, list_genres){
            if (err) next(err);
            res.render('genre_list', { title: 'Genre List', genre_list: list_genres});
        })
};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {
    async.parallel({
        genre: function (callback) {
            Genre.findById(req.params.id)
                .exec(callback);
        },
        genre_books: function(callback) {
            Book.find({ 'genre': req.params.id })
                .exec(callback);
        },
    }, function (err, results) {
        if (err) return next(err);
        if (results.genre == null) {
            let err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }

        //-- successful
        res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books});
    });
};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res, next) {
    res.render('genre_form', {title: 'Create Genre'});
};

// Handle Genre create on POST.
exports.genre_create_post = [
    // validate and sanitize the name field
    body('name', 'Genre name characters must be more than 3').trim().isLength({min : 3})
        .escape(), // make html code remove
    function (req, res, next) {
        // errors from request
        const errors = validationResult(req);

        // create a genre obj with escaped and trimmed data
        let genre = new Genre(
            {name: req.body.name}
            );
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
            return;
        }
        else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            Genre.findOne({ 'name': req.body.name })
                .exec( function(err, found_genre) {
                    if (err) { return next(err); }

                    if (found_genre) {
                        // Genre exists, redirect to its detail page.
                        res.redirect(found_genre.url);
                    }
                    else {
                        genre.save(function (err) {
                            if (err) { return next(err); }
                            // Genre saved. Redirect to genre detail page.
                            res.redirect(genre.url);
                        });

                    }
                });
        }
    }

];

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res, next) {
    async.parallel({
        books: function (callback){
            Book.find({'genre': req.params.id})
                .exec(callback);
        },
        genre: function (callback) {
            Genre.findById(req.params.id)
                .exec(callback);
        }
    }, function (err, results) {
        if (err) next(err);
        if (results.genre == null) {
            res.redirect('/catalog/genres');
        }
        res.render('genre_delete', {
            title: 'Delete Genre',
            genre: results.genre,
            books: results.books
        });
    });
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res, next) {
    async.parallel({
        books: function (callback){
            Book.find({'genre': req.params.id})
                .exec(callback);
        },
        genre: function (callback) {
            Genre.findById(req.params.id)
                .exec(callback);
        }
    }, function (err, results) {
        if (err) next(err);
        if (results.books.length > 0) {
            res.render('genre_delete', {
                title: 'Delete Genre',
                genre: results.genre,
                books: results.books
            });
        }
        else {
            Genre.deleteOne({'_id': req.body.genreid}, function (err) {
                next(err);
            });
            res.redirect('/catalog/genres');
        }
    });
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res, next) {
    Genre.findById(req.params.id)
        .exec(function (err, genre) {
            if (err) next(err);
            if (genre == null) {
                let error = new Error('Genre not found');
                error.status = 404;
                return next(error);
            }
            res.render('genre_form', {
                title: 'Update Genre',
                genre: genre
            })
        });
};

// Handle Genre update on POST.
exports.genre_update_post = [
    // validate and sanitize the name field
    body('name', 'Genre name characters must be more than 3').trim().isLength({min : 3})
        .escape(), // make html code remove
    function (req, res, next) {
        // errors from request
        const errors = validationResult(req);

        // create a genre obj with escaped and trimmed data
        let genre = new Genre(
            {
                _id: req.params.id,
                name: req.body.name
            }
        );
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
            return;
        }
        else {
            Genre.findOneAndUpdate({'_id': req.params.id}, genre, {}, function (err, newGenre) {
                if (err) next(err);
                res.redirect(newGenre.url);
            });
        }
    }
]