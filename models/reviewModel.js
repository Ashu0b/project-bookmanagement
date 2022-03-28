const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const reviewSchema = new mongoose.Schema({
    bookId: {type:ObjectId, required:true, ref:'Books'},
  reviewedBy: {type:String, required:true, default:'Guest', trim:true },
  reviewedAt: {type:String, required:true, trim:true, match:/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/},
  rating: {type:Number, required:true, min:1, max:5},
  review: {type: String, trim:true},
  isDeleted: {type:Boolean, default: false}
}, {timestamps:true})

module.exports = mongoose.model('Reviews', reviewSchema);
