const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");
const validator = require("../utils/validator");

//Reviews
const createReview = async (req, res) => {
  try {
    let requestBody = req.body;
    if (Object.keys(requestBody).length === 0) {
      return res
        .status(400)
        .json({
          status: false,
          msg: `Invalid Request. Please input data in the body`,
        });
    }
    const { bookId, rating } = requestBody;
    let { bookId: _id } = req.params;

    if (!validator.isValidObjectId(_id)) {
      return res.status(400).json({ status: false, msg: `Invalid ID!` });
    }
    const checkID = await bookModel.findById(_id);

    if (!checkID) {
      return res
        .status(404)
        .json({ status: false, msg: `${_id} is not present in DB!` });
    }
    const idAlreadyDeleted = await bookModel.findOne({ _id: _id });
    if (idAlreadyDeleted.isDeleted === true) {
      return res
        .status(400)
        .json({ status: false, msg: `ID already deleted!` });
    }
    if (!requestBody.bookId) {
      return res
        .status(400)
        .json({ status: false, msg: `Book ID is mandatory!` });
    }
    if (!validator.isValidObjectId(bookId)) {
      return res.status(400).json({ status: false, msg: `Invalid Book ID!` });
    }
    if (!requestBody.rating) {
      return res
        .status(400)
        .json({ status: false, msg: `Rating is mandatory field!` });
    }
    if (!validator.isValidRating(rating)) {
      return res
        .status(400)
        .json({ status: false, msg: `Invalid! Please input valid rating.` });
    }

  
    const reviewData = await reviewModel.create(requestBody);
    res
      .status(201)
      .json({
        status: true,
        msg: `Review created Successfully!`,
        data: reviewData,
      });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    let bookId = req.params.bookId;
    let reviewId = req.params.reviewId;
    let requestBody = req.body;

    const { review, rating, reviewedBy } = requestBody;

    if (!validator.isValidObjectId(bookId)) {
      return res.status(400).json({ status: false, msg: `Invalid Book ID!` });
    }
    const checkID = await bookModel.findById(bookId);

    if (!checkID) {
      return res
        .status(404)
        .json({ status: false, msg: `${bookId} is not present in DB!` });
    }
    const idAlreadyDeleted = await bookModel.findOne({ _id: bookId });
    if (idAlreadyDeleted.isDeleted === true) {
      return res
        .status(400)
        .json({ status: false, msg: `ID already deleted!` });
    }

    if (!validator.isValidObjectId(reviewId)) {
      return res.status(400).json({ status: false, msg: `Invalid Review ID!` });
    }
    

    const reviewIdAlreadyDeleted = await reviewModel.findOne({ _id: reviewId });
    if (reviewIdAlreadyDeleted.isDeleted === true) {
      return res
        .status(400)
        .json({ status: false, msg: `ID already deleted!` });
    }

    if (!validator.isValidString(review)) {
      return res
        .status(400)
        .json({ status: false, msg: `Invalid review format!` });
    }

    if (!validator.isValidNumber(rating)) {
      return res
        .status(400)
        .json({ status: false, msg: `Invalid Rating Format!` });
    }

    if (!validator.isValidRating(rating)) {
      return res.status(400).json({ status: false, msg: `Invalid rating!` });
    }

    if (!validator.isValidString(reviewedBy)) {
      return res
        .status(400)
        .json({ status: false, msg: `Reviewer name is mandatory!` });
    }

    

    const newData = await reviewModel.findByIdAndUpdate(
      { _id: reviewId },
      requestBody,
      { new: true }
    );
    res
      .status(201)
      .json({
        status: true,
        msg: `Review Updated Successfully`,
        data: newData,
      });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

const deleteReviewById = async (req, res) => {
  try {
    let bookId = req.params.bookId;
    let reviewId = req.params.reviewId;
    if (!validator.isValidObjectId(bookId)) {
      return res.status(400).json({ status: false, msg: `Invalid Book ID!` });
    }
    const checkID = await bookModel.findById(bookId);

    if (!checkID) {
      return res
        .status(404)
        .json({ status: false, msg: `${bookId} is not present in DB!` });
    }
    const idAlreadyDeleted = await bookModel.findOne({ _id: bookId });
    if (idAlreadyDeleted.isDeleted === true) {
      return res
        .status(400)
        .json({ status: false, msg: `ID already deleted!` });
    }

    if (!validator.isValidObjectId(reviewId)) {
      return res.status(400).json({ status: false, msg: `Invalid Review ID!` });
    }
    const checkReviewID = await reviewModel.findById(reviewId);

    if (!checkReviewID) {
      return res
        .status(404)
        .json({ status: false, msg: `${reviewId} is not present in DB!` });
    }
    const reviewIdAlreadyDeleted = await reviewModel.findOne({ _id: reviewId });
    if (reviewIdAlreadyDeleted.isDeleted === true) {
      return res
        .status(400)
        .json({
          status: false,
          msg: `Review with this ID is already deleted!`,
        });
    }

  

    const reviewData = await reviewModel.findByIdAndUpdate(
      { _id: reviewId },
      { isDeleted: true },
      { new: true }
    );

    res.status(200).json({ status: true, data: reviewData });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

module.exports = {
  createReview,
  updateReview,
  deleteReviewById,
};
