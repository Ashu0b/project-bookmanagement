const bookModel = require('../models/bookModel');
const { findOne } = require('../models/userModel');
const userModel = require('../models/userModel');
const reviewModel = require('../models/reviewModel');
const validator = require('../utils/validator');
const jwt = require('jsonwebtoken');


//create book (POST)
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


//get books(Query params/filters)
const getBooks = async (req,res) => {
    try {
        let queryFilter = req.query;
        queryFilter.isDeleted = false;

        const books = await bookModel.find(queryFilter).select({_id:1,title:1,excerpt:1, userId:1, category:1, releasedAt:1});
        if(!(books.length > 0)){
            return res.status(404).json({status:false, msg:`No Book found with matching filters!`})
        }
        const sortedBooks = books.sort((a,b) => a.title.localeCompare(b.title));
        res.status(200).json({status:true, data:sortedBooks});

    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }

}

//get books (by ID/path params)
const getBooksById = async (req,res) => {
    try {

    
        let {bookId:_id} = req.params;
        if(!validator.isValidObjectId(_id)){
            return res.status(400).json({status:false, msg:`Invalid ID!`})
           }
        const bookData = await bookModel.findById(_id);
       
        if(!bookData){
            return res.status(404).json({status:false, msg:`${_id} is not present in DB!`})
        }
        
        const bookId = bookData._id 
        const reviewsData = await reviewModel.find({bookId: bookId, isDeleted:false});
        
        
        
        const countOfReviews = reviewsData.length;
    
        
        
        let finalData = {bookData,reviewsData}
        bookData.reviews = countOfReviews;
        res.status(200).json({ status: true, data:finalData});

    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
}

const updateBookById = async (req, res) => {
    try {
        let {bookId: _id} = req.params;
        let requestBody = req.body;
        const {ISBN, title, releasedAt} = requestBody;
        
        if(!validator.isValidObjectId(_id)){
            return res.status(400).json({status:false, msg:`Invalid Book ID!`})
        }
    
        const checkID = await bookModel.findById(_id);
       
        if(!checkID){
            return res.status(404).json({status:false, msg:`${_id} is not present in DB!`})
        }
        const isISBNAlreadyUsed = await bookModel.findOne({ ISBN:ISBN });
        if (isISBNAlreadyUsed) {
        return res.status(400).send({ status: false, message: `${ISBN} already exists!`});
        }
        if(!validator.isValidISBN(ISBN)){
            return res.status(400).json({status:false, msg:`Provide valid 13-digit ISBN!`});
        }
        if(!title){
            return res.status(400).json({status:false, msg:`Give a valid title for updation!`});
        }
        if(!validator.isValidString(title)){
            return res.status(400).json({status:false, msg:`Please provide a valid title!`});
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
        if(!requestBody.title){
            return res.status(400).json({status:false, msg:`title is a mandatory field!`});
        }
        const isTitleAlreadyUsed = await bookModel.findOne({ title:title });
        if (isTitleAlreadyUsed) {
        return res.status(400).send({ status: false, message: `${title} already exists! Give a Unique title...`});
        }
        const idAlreadyDeleted = await bookModel.findOne({_id:_id});
        if(idAlreadyDeleted.isDeleted === true){
            return res.status(404).json({status:false, msg:`Book Not Found or Deleted!`});
        }

        let token = req.headers["x-api-key"];
        let decodedToken = jwt.verify(token, "thorium@group23");

        let authorIdFromToken = req.query.userId;
        if(!authorIdFromToken){
            return res.status(400).json({status:false, msg:`User ID Query not present!`});
        }
        
        let userLoggedIn = decodedToken.userId;
        
        if(authorIdFromToken != userLoggedIn){
            return res.status(401).json({status:false, msg:`User not authorised to perform this action!`});
        }
        
        

        const newData = await bookModel.findByIdAndUpdate({_id},requestBody, {new:true});
        res.status(201).json({status:true, msg:`Updated Successfully`, data:newData});


    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }

}

const deleteById = async (req,res)=>{
    try {
       let {bookId: _id} = req.params;
       if(!validator.isValidObjectId(_id)){
        return res.status(400).json({status:false, msg:`Invalid Book ID!`})
       }
       const checkID = await bookModel.findById(_id);
       
       
        if(!checkID){
            return res.status(404).json({status:false, msg:`${_id} is not present in DB!`})
        }
        
    
        const idAlreadyDeleted = await bookModel.findOne({_id:_id});
        if(idAlreadyDeleted.isDeleted === true){
            return res.status(400).json({status:false, msg:`Book already deleted!`});
        }

        let token = req.headers["x-api-key"];
        let decodedToken = jwt.verify(token, "thorium@group23");

        let userIdFromToken = req.query.userId;
        if(!userIdFromToken){
            return res.status(400).json({status:false, msg:`User ID Query not present!`});
        }
        
        let userLoggedIn = decodedToken.userId;
       
        
       
        if(userIdFromToken != userLoggedIn){
            return res.status(401).json({status:false, msg:`User not authorised to perform this action!`});
        }
        

        if(checkID.userId.toString() !== req.query.userId){
            console.log(checkID.userId.toString(), req.query.userId );
            return res.status(401).json({status:false, msg:`User not authorised to delete this book!`});
        } 
        

       const bookData = await bookModel.findByIdAndUpdate({_id},{isDeleted:true},{new:true});

       res.status(200).json({ status: true, data:bookData});

    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
}




module.exports = {
    createBook,
    getBooks,
    getBooksById,
    updateBookById,
    deleteById
    
}



