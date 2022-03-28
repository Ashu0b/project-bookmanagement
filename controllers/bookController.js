const bookModel = require('../models/bookModel');
const { findOne } = require('../models/userModel');
const userModel = require('../models/userModel');
const validator = require('../utils/validator');


const createBook = async (req,res) => {
    try {

    let requestBody = req.body;
    if(Object.keys(requestBody).length === 0){
        return res.status(400).json({status:false, msg:`Invalid Request. Please input data in the body`});
    }

    const {title, excerpt, userId, ISBN, category, subcategory, releasedAt} = requestBody;

    if (!requestBody.title){
        return res.status(400).json({status:false, msg:`title is mandatory field!`});
    }
    if(!validator.isValidString(title)){
       return res.status(400).json({status:false, msg:`title must be present!`});
    }
    const isTitleAlreadyUsed = await bookModel.findOne({ title:title });
    if (isTitleAlreadyUsed) {
        return res.status(400).send({ status: false, message: `${title} is already exists!`});
    }
    if (!requestBody.excerpt){
        return res.status(400).json({status:false, msg:`excerpt is mandatory field!`});
    }
    
    if(!validator.isValidString(excerpt)){
        return res.status(400).json({status:false, msg:`excerpt is mandatory field!`});
    }
    if(!requestBody.userId){
        return res.status(400).json({status:false, msg:`userID is mandatory field!`});
    }

    if(!validator.isValidObjectId(userId)){
        return res.status(400).json({status:false, msg:`userID is mandatory field!`});
    }

    if(!validator.isValidObjectId(userId)){
        return res.status(400).json({status:false, msg:`${userId} is not valid User ID!`});
    }
    const findUser = await userModel.findById(userId);
        if(!findUser){
            return res.status(404).json({status:false, msg:`${userId} is not present in DB!`})
        }
    

    if(!requestBody.ISBN){
        return res.status(400).json({status:false, msg:`ISBN is mandatory field!`});
    }
    if(!validator.isValidString(ISBN)){
        return res.status(400).json({status:false, msg:`ISBN is mandatory field!`});
    }
    if(!validator.isValidISBN(ISBN)){
        return res.status(400).json({status:false, msg:`Provide valid 13-digit ISBN!`});
    }
    const isISBNAlreadyUsed = await bookModel.findOne({ ISBN:ISBN});
    if (isISBNAlreadyUsed) {
        return res.status(400).send({ status: false, message: `${ISBN} is already registered`});
    }

    if(!requestBody.category){
        return res.status(400).json({status:false, msg:`category is mandatory field!`});
    }
    if(!validator.isValidString(category)){
        return res.status(400).json({status:false, msg:`category is mandatory field!`});
    }
    if(!requestBody.subcategory){
        return res.status(400).json({status:false, msg:`subcategory is mandatory field!`});
    }
    if(!validator.isValidString(subcategory)){
        return res.status(400).json({status:false, msg:`subcategory is mandatory field!`});
    }
    if(!requestBody.releasedAt){
        return res.status(400).json({status:false, msg:`Release Date is missing!`});
    }
    if(!validator.isValidString(releasedAt)){
        return res.status(400).json({status:false, msg:`Release Date is mandatory field!`});
    }

    if(!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(releasedAt)){
        return res.status(400).json({status:false, msg:`Invalid Date format!`});
    }
    

    const books = await bookModel.create(requestBody);
    return res.status(201).json({status:true, msg:`Book created successfully!`, data:books});

        
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }

}



// const getBooks = async (req,res) => {
//     try {

//         let filterQuery = { isDeleted: false};
//         let queryParams = req.query;
//         const { userId, category, subcategory } = queryParams;

//         if(!validator.isValidString(userId)){
//             return res.status(400).json({status:false, msg:`userID is mandatory field!`});
//         }
//         if(validator.isValidObjectId(userId)){
//             return res.status(400).json({status:false, msg:`Invalid User ID!`});
//         }
//         if(!validator.isValidString(category)){
//             return res.status(400).json({status:false, msg:`category can't be empty!`});
//         }
//         if(!validator.isValidString(subcategory)){
//             return res.status(400).json({status:false, msg:`subcategory can't be empty!`});
//         }


        
//     } catch (error) {
//         res.status(500).json({ status: false, error: error.message });
//     }

// }

const getBooksById = async (req,res) => {
    try {

    
        let {bookId:_id} = req.params;
        const bookData = await bookModel.findById(_id);
       
        if(!bookData){
            return res.status(404).json({status:false, msg:`${_id} is not present in DB!`})
        }
        res.status(200).json({ status: true, data:bookData });

    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
}




module.exports = {
    createBook,
    //getBooks
    getBooksById
}



