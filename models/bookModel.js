const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const bookSchema = new mongoose.Schema({
    title :{type:String, required:true, trim:true, unique:true},
    excerpt : {type: String, required:true, trim:true},
    userId : {type:ObjectId, ref:'Users', required:true},
    ISBN : {type:String, required:true, unique:true, trim:true, minlength:13, maxlength:13},
    category : {type:String, trim:true, required:true},
    subcategory : {type:String, trim:true, required:true},
    reviews : {type:Number, default:0},
    deletedAt : {type:Date},
    isDeleted : {type:Boolean, default:false},
    releasedAt : {type:String, required:true, trim:true, match:/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/}

}, {timestamps:true})

module.exports = mongoose.model('Books', bookSchema);

