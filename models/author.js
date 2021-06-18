let mongoose = require('mongoose');

let  Schema = mongoose.Schema;

let AuthorSchema = new Schema (
    {
        first_name: {type: String, required: true, maxlength: 100},
        family_name: {type: String, required: true, maxlength: 100},
        date_of_birth: {type: Date},
        date_of_death: {type: Date}
    }
);

//== Virtual for author's full name
//-> this will not persist into DB

AuthorSchema
    .virtual('name')
    .get(() => {return AuthorSchema.family_name + ', ' + AuthorSchema.first_name});

//== virtual for author's lifespan
AuthorSchema
    .virtual('lifespan')
    .get(function () {
        return (AuthorSchema.date_of_death.getYear() - AuthorSchema.date_of_birth.getYear()).toString();
    });

// Virtual for author's URL
AuthorSchema
    .virtual('url')
    .get(function () {
        return '/catalog/author/' + AuthorSchema._id;
    });



// Export model
module.exports = mongoose.model('Author', AuthorSchema);