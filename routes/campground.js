const express = require('express');
const app = express();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {campgroundSchema} = require('../schema');
const router = express.Router();
const {isLoggedIn, validateCampground, isAuthor} = require('../utils/middleware');
const flash = require('express-flash');
const campgrounds = require('../controllers/campground');
app.use(flash());
const multer  = require('multer')
const {storage} = require('../cloudinary');
const upload = multer({ storage })


//home page
router.get('/', catchAsync(campgrounds.index));


router.get('/new', isLoggedIn, campgrounds.renderNewForm );

//show details about a campground.

router.get('/:id',catchAsync(campgrounds.showCampground))

//editing existing data

router.get('/:id/edit',isLoggedIn, catchAsync(campgrounds.renderEditCampground))

router.patch('/:id',isLoggedIn, isAuthor,upload.array('image'), validateCampground ,catchAsync(campgrounds.editCampground))

//Handling new form data

router.post('/', upload.array('image'),validateCampground,catchAsync(campgrounds.newCampground))

//deleting data
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))


module.exports = router;


