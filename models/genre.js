let mongoose = require('mongoose');
let  Schema = mongoose.Schema;

let  GenreSchema = new Schema(
    {
        name: {type: String, minlength: 3, maxlength: 100}
    }
);

//== virtual for genre URL
GenreSchema
    .virtual('url')
    .get(() => { return '/catalog/genre/' + GenreSchema._id;});

//== export model
module.exports = mongoose.model('Genre', GenreSchema)

