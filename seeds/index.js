const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelpers');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(()=>{
    console.log("Mongo Connection Open");
})
.catch((err)=>{
    console.log("Oh No Mongo error");
    console.log(err);
})


//function to randomly select a descriptor and place from the array

const sample = (arr)=>{
    return arr[Math.floor(Math.random()*arr.length)];
}
//create a function which deletes all the old entries and creates new one

const seedDB = async() =>{
    await Campground.deleteMany({});
    
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const camp = new Campground({
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        });

        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});
