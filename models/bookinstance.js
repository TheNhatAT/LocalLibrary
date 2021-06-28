let mongoose = require('mongoose');
// import Datetime class from luxon
const luxon = require("luxon");


let Schema = mongoose.Schema;
let BookInstanceSchema = new Schema(
    {
        book: { type: Schema.Types.ObjectId, ref: 'Book', required: true }, //reference to the associated book
        imprint: {type: String, required: true},
        //== enum limit the input in a set
        status: {type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'},
        due_back: {type: Date, default: Date.now}
    }
);

// Virtual for bookinstance's URL
BookInstanceSchema
    .virtual('url')
    .get(function () {return '/catalog/bookinstance/' + this._id;});

BookInstanceSchema
    .virtual('due_back_formatted')
    .get(function () {
        return luxon.DateTime.fromJSDate(this.due_back).toLocaleString(luxon.DateTime.DATE_MED);
    });

//Export model
module.exports = mongoose.model('BookInstance', BookInstanceSchema);