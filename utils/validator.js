const mongoose = require('mongoose');

const isValidObjectId = function(objectId){
    return mongoose.Types.ObjectId.isValid(objectId);
}

const isValidString = function(value){
    if(typeof value === 'string' && value.trim().length === 0) return false;
    return true;
}

const isValidTitle = function (title) {
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1;
  };

const isValidPassword = function (password){
    if(password.length <= 15 && password.length >= 8){
        return false;
    }

}  
const isValidISBN = function(ISBN){
    if(ISBN.length === 13)
    return true;
}


module.exports = {
    
    isValidObjectId,
    isValidString,
    isValidTitle,
    isValidPassword,
    isValidISBN
    
    
}