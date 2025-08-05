const User = require('../models/user');


module.exports.renderRegister = (req,res)=>{
    res.render('users/register');
}

module.exports.userRegistration = async(req,res)=>{
    //res.send(req.body);
    try{
        const {email, username, password} = req.body;
    const newUser = new User({
        username: username,
        email: email
    })
    const registeredUser= await User.register(newUser, password);

    req.login(registeredUser, (err)=>{
        if(err) return next(err);
        req.flash( 'success',`Registration Successful, Welcome ${username}`);
    res.redirect('/campground');
    })
    
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
    
    
}

module.exports.loginRender = (req,res)=>{
    res.render('users/login');
}

module.exports.loginOps = (req,res)=>{
    req.flash('success', `Welcome to Yelp Camp ${req.body.username}`);
    console.log(res.locals.returnTo);
    const redirectUrl = res.locals.returnTo || '/campground';
    res.redirect(redirectUrl);
    }

module.exports.logoutOps = (req,res)=>{
    req.logOut(function (err){
        if(err){
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campground');
    });
}