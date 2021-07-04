let Author = require('../models/author');
let async = require('async');
let Book = require('../models/book');
let {body, validationResult} = require('express-validator');

//== display list of all Authors
exports.author_list = function (req, res, next) {
    Author.find()
        .sort([['family_name', 'ascending']])
        .exec(function (err, list_authors) {
            if (err) return next(err);
            res.render('author_list', {title: 'Author List', author_list: list_authors});
        })
}

//== display detail page for a specific Author
exports.author_detail = function (req, res, next) {
    async.parallel({
        author: function (callback) {
            Author.findById(req.params.id)
                .exec(callback);
        },
        authors_books: function (callback) {
            Book.find({'author': req.params.id}, 'title summary')
                .exec(callback);
        }
    }, function (err, results) {
        if (err) return next(err);
        if (results.author == null) {
            let err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        //-- success
        res.render('author_detail', {
            title: 'Author Detail',
            author: results.author,
            author_books: results.authors_books
        })
    });
}

//== display author create form on GET
exports.author_create_get = function (req, res) {
    res.render('author_form', {title: 'Create Author'});
}

//== handle Author create on POST
exports.author_create_post = [
    // validate and sanitize fields
    body('first_name').trim().isLength({min: 1}).escape().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').trim().isLength({min: 1}).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({checkFalsy: true}).isISO8601().toDate(),
    body('date_of_death', 'Invalid date of death').optional({checkFalsy: true}).isISO8601().toDate(),

    function (req, res, next) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('author_form', {title: 'Create Author', author: req.body, errors: errors.array()});
        } else {
            let author = new Author(
                {
                    first_name: req.body.first_name,
                    family_name: req.body.family_name,
                    date_of_birth: req.body.date_of_birth,
                    date_of_death: req.body.date_of_death
                }
            );
            author.save(function (err) {
                if (err) return next(err);
                res.redirect(author.url);
            })

        }
    }
]

// Display Author delete form on GET.
exports.author_delete_get = function (req, res, next) {
    async.parallel({
            author: function (callback) {
                Author.findById(req.params.id).exec(callback);
            },
            author_books: function (callback) {
                Book.find({'author': req.params.id}).exec(callback);
            }
        }
        , function (err, results) {
            if (err) return next(err);
            if (results.author == null) {
                res.redirect('/catalog/authors');
            }
            res.render('author_delete', {
                title: 'Delete Author',
                author: results.author,
                author_books: results.author_books
            })
        }
    );
}

// Handle Author delete on POST.
exports.author_delete_post = function (req, res, next) {
    async.parallel({
        author: function (callback) {
            Author.findById(req.params.id).exec(callback);
        },
        author_books: function (callback) {
            Book.find({'author': req.params.id}).exec(callback);
        }
    }, function (err, results) {
        if (err) next(err);
        if (results.author_books.length > 0) {
            res.render('author_delete', { title: 'Delete Author',
                author: results.author, author_books: results.authors_books } );
        }
        else {
            Author.deleteOne({'_id': req.body.authorid}, function (err) {
                next(err);
            });
            res.redirect('/catalog/authors');
        }
    });
};

// Display Author update form on GET.
exports.author_update_get = function (req, res, next) {
    Author.findById(req.params.id)
        .exec(function (err, author) {
            if (err) next(err);
            if (author == null) {
                let err = new Error('Book not found');
                err.status = 404;
                return next(err);
            }
            res.render('author_form', {title: 'Update author', author: author});
        })
};

// Handle Author update on POST.
exports.author_update_post = [
    body('date_of_birth').optional({checkFalsy: true}).isDate().withMessage('Birth of author must be a date'),
    body('date_of_death').custom((deathDay, {req}) => {
        if (deathDay < req.body.date_of_birth)
            return Promise.reject('Date of death must be after date of birth')
    }).optional({checkFalsy: true}).isDate().withMessage('Death of author must be a date'),
        // .isAfter().withMessage('Date of death must be after date of birth'),
    body('first_name').trim().isLength({min: 3}).withMessage('Author first name must not be empty'),
    body('family_name').trim().isLength({min: 3}).withMessage('Author family name must not be empty'),
   // process req after validation and sanitization
   function (req, res, next) {
       const errors = validationResult(req);

       let author = new Author(
       {
           _id: req.params.id,
           first_name: req.body.first_name,
           family_name: req.body.family_name,
           date_of_birth: req.body.date_of_birth,
           date_of_death: req.body.date_of_death
       }
       );
       if(!errors.isEmpty()) {
           Author.findOne({'_id': req.params.id})
               .exec(function (err, author) {
                   if (err) next(err);
                   if (author == null) {
                       let err = new Error('Book not found');
                       err.status = 404;
                       return next(err);
                   }
                   res.render('author_form',
                       {title: 'Update author', author: author, errors: errors.array()});
               });
       }
       else {
           // console.log(author);
           Author.findOneAndUpdate({'_id': req.params.id}, author, {}, function (err, newAuthor) {
               if (err) return next(err);
               res.redirect(newAuthor.url);
           });
       }
   }
]