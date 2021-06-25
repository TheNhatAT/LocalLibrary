let mongoose = require('mongoose');
const {DateTime} = require("luxon");

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

//== error ???
AuthorSchema
    .virtual('name')
    .get(function () {
        return AuthorSchema.family_name + ', ' + AuthorSchema.first_name});

//== virtual for author's lifespan
AuthorSchema
    .virtual('lifespan')
    .get(function () {
        return this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : '';
        // (AuthorSchema.date_of_death.getYear() - AuthorSchema.date_of_birth.getYear()).toString();
    });

// Virtual for author's URL
AuthorSchema
    .virtual('url')
    .get(function () {
        return '/catalog/author/' + this._id;
    });




// Export model
module.exports = mongoose.model('Author', AuthorSchema);