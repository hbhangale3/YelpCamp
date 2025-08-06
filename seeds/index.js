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
        const price = Math.floor(Math.random()*40)+10;
        const camp = new Campground({
            author:'688fa438aca5b1c24f2c07f4',
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry:{
                type: "Point",
                coordinates: [-113.1331, 47.0202]
            },
            image: [
                {
                  url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754452246/YelpCamp/erppvtqyqxp9uz4dpreo.jpg',
                  filename: 'YelpCamp/erppvtqyqxp9uz4dpreo',
                 
                },
                {
                  url: 'https://res.cloudinary.com/dyr7igtpp/image/upload/v1754452250/YelpCamp/kpkgpccgevuqckusos55.jpg',
                  filename: 'YelpCamp/kpkgpccgevuqckusos55',
                }
              ],
            price: price,
            description: " Pitch your tent or park your RV at this tranquil riverside campground, where the gentle rush of the water provides a soothing soundtrack to your outdoor adventure. Enjoy direct access to fishing and kayaking, with well-maintained, spacious sites that offer a blend of shade and sun. Fire rings and picnic tables are provided for enjoying meals outdoors, and you'll find composting toilets and potable water within easy walking distance. The camp store provides necessities and firewood, and you'll be close enough to enjoy nearby hiking trails." 
        });

        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});
