const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(()=>{
    console.log("Mongo Connection Open");
})
.catch((err)=>{
    console.log("Oh No Mongo error");
    console.log(err);
})


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));


//home page
app.get('/', (req,res)=>{
    res.render('home');
})

app.get('/makecampground', async (req,res)=>{
    const camp = new Campground({
        title:'My Backyard',
        price:'35.99',
    })
    await camp.save();
    res.send(camp);
})
app.listen(3000, ()=>{
    console.log('Server listening on 3000');
})