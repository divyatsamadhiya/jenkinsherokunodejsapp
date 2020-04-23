const express = require('express'); 
//importing express module after installing it using npm install --save express.

const session = require('express-session'); //module used to provide access to limited users.

const PORT = process.env.PORT || 5000

const app = express(); //call express because it is a function.

app.use(session({ //connecting module(express with express-session module) 
    secret:'2C44-4D44-WppQ38S',  //hardcore secret key we given manually, otherwise it is developed by certain application. 
    resave:true,   //if we assign it to false then cookie will not generate new id after logging out when we inspect on browser(inspect->application->).
    saveUninitialized:true  //same as above.
}))

const auth= (req,res,next)=>{

    if(req.session && req.session.user==='user' && req.session.admin)
        return next();
    else
        res.sendStatus(401);
}
//http://localhost:port/login?username=user&password=pass  
//for creating username and password for accesing order url because we connected order to login using auth.
app.get('/login',(req,res)=>{
    if(!req.query.username || !req.query.password)
        res.send('login failed')
    else if(req.query.username === 'user' && req.query.password === 'pass'){ //user can access these urls only we they provide correct username and password.
        req.session.user= 'user'; //sesseion username is user
        req.session.admin=true;  //only admin can access the session by giving correct credentials.
        res.send('login successfull')
    }
    else
        res.send('login failed');
})

//http://localhost:port/
app.get('/',(req,res)=>{  //getting request from client through url having / in the end of url.
    res.send('welcome to heroku express app');  //sending response
});

//http://localhost:port/index/
app.get('/index',(req,res)=>{  //getting request from client having /index in the end of link.
    res.sendFile(__dirname+'/index.html'); 
    //__dirname is a constant will search for index.html in the current directory(expressjs).
});

//http://localhost:port/order?id=1/  query parameter
app.get('/order',auth,(req,res)=>{  
    res.send('order details requested for '+req.query.id);  
});

//http://localhost:port/order/1/ordername/  path parameter
app.get('/order/:id/:name',auth,(req,res)=>{  
    res.send('order details requested for '+req.params.id +' ' + req.params.name);     
});

//http://localhost:port/logout  will logout of the session and order url cannot be accessed again until we login again
app.get('/logout',(req,res)=>{
    req.session.destroy();  //to destroy the session so that noone can access it again without login again.
    res.send('logged out succesfully')
    })

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
    
