const Campground = require('../models/campground');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
const { cloudinary } = require('../cloudinary'); 


module.exports.index = async (req,res)=>{
    // const camp = await Campground.find({});
    // //console.log(camp);
    // res.render('home', {camp});
    
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = 20;
    const skip = (page - 1) * limit;

    const totalCampgrounds = await Campground.countDocuments({});
    const totalPages = Math.ceil(totalCampgrounds / limit);

    if (page > totalPages && totalPages !== 0) {
        return res.redirect(`/campground?page=${totalPages}`);
    }

    const camp = await Campground.find({})
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit);

    res.render('home', {
        camp,
        currentPage: page,
        totalPages
    });
}

module.exports.renderNewForm = (req,res)=>{
    res.render('new');
}

module.exports.showCampground = async (req,res)=>{
    //const {id} = req.params;
    const campground = await Campground.findById(req.params.id).populate({
        path: 'review',
        populate:{
            path: 'author'
        }      
    }).populate('author');
    if(!campground){
        req.flash('error','Cannot find the campground');
        return res.redirect('/campground');
    }
    res.render('show',{campground
        // messages: req.flash('success')
    });
}

module.exports.renderEditCampground = async (req,res)=>{
    //const {id} = req.params;
    const camp = await Campground.findById(req.params.id);

    if(!camp){
        req.flash('error','Cannot find the campground');
        return res.redirect('/campground');
    }
    if(!req.user._id.equals(camp.author)){
        req.flash('error','You do not have the permission to perform the operation!');
        return res.redirect(`/campground/${camp._id}`);
    }
    res.render('edit', {camp});
    
}

module.exports.editCampground = async (req,res)=>{


    const camp = await Campground.findById(req.params.id);
    //console.log(req.body);

    const geoData = await maptilerClient.geocoding.forward(req.body.location, { limit: 1 });
    if (!geoData.features?.length) {
        req.flash('error', 'Could not geocode that location. Please try again and enter a valid location.');
        return res.redirect(`/campgrounds/${id}/edit`);
    }


    camp.geometry = geoData.features[0].geometry;
    campground.location = geoData.features[0].place_name;

    const images = req.body.deleteImages;
    camp.title = req.body.title;
    camp.location= req.body.location;
    camp.price=req.body.price,
    camp.description=req.body.description

    const image_data = req.files.map(file=>{
        return {
            url: file.path,
            filename: file.filename
        };
    });
    camp.image.push(...image_data);
    if (req.body.deleteImages && req.body.deleteImages.length > 0) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename); // delete from Cloudinary
        }

        // 2. Remove selected images from Mongoose model
        camp.image = camp.image.filter(img => !req.body.deleteImages.includes(img.filename));
    }

    await camp.save();
    req.flash('success', 'Camp Information Updated Successfully')
    res.redirect(`/campground/${camp._id}`);
}

module.exports.newCampground = async(req,res, next)=>{
    
    const geoData = await maptilerClient.geocoding.forward(req.body.location, { limit: 1 });
    //res.send(coordinates);
    if (!geoData.features?.length) {
        req.flash('error', 'Could not geocode that location. Please try again and enter a valid location.');
        return res.redirect('/campgrounds/new');
    }

    const campground = new Campground({
        title: req.body.title,
        location: req.body.location,
        price: req.body.price,
        description: req.body.description
    });
    campground.geometry = geoData.features[0].geometry;
    campground.location = geoData.features[0].place_name;
    const image_data = req.files.map(file=>{
        return {
            url: file.path,
            filename: file.filename
        };
    });
    campground.image = image_data;
    campground.author = req.user._id;
    await campground.save();

    req.flash('success', 'New Camp Created Successfully')
    res.redirect(`/campground/${campground._id}`);
}

module.exports.deleteCampground = async(req,res)=>{
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Camp Deleted Successfully')
    res.redirect('/campground');
    
}