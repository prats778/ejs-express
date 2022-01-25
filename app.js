const express = require('express');
const path = require('path');
const app = express();
var bodyParser = require("body-parser"); 
const ejsLint = require('ejs-lint');
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

const http= require('http').Server(app);
const io = require("socket.io")(http,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true        
    }
});

io.on('connection', socket => {
    console.log('Connected...')
    socket.on('message', (msg) => {
        console.log("msg received on server side",msg);
        // let str="i received ur msg";
        // socket.emit('receive', str);
    })
})  


app.use('/public',express.static(path.join(__dirname,'static')));
app.set('view engine','ejs');
User={
   user:'Prats',
   subjects:['Maths','Phys'],
   time:[4,4]
};

Subjects={
    Maths:[],
    Phys:[]
};

http.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });

///super helpful
app.use(( err, req, res, next ) => {
    res.locals.error = err;
    if (err.status >= 100 && err.status < 600)
      res.status(err.status);
    else
      res.status(500);
    res.render('error');
});
////

app.get('/',(req,res)=>{
    res.render('index',{data: {
       user:User.user,
       subjects:User.subjects,
       allocate:User.time,
       schedule:Subjects         
    }});

});

app.get('/schedule',(req,res)=>{
    res.render('schedule',{data: {
           user:User.user,
           subjects:User.subjects,
           allocate:User.time,
           schedule:Subjects         
        }});
});

app.post('/select',(req,res)=>{
    console.log("selected: ",req.body);
    res.render('schedule',{data: {
        user:User.user,
        subjects:User.subjects,
        selected:req.body.name,
        schedule:Subjects         
     }});
});

app.post('/set_schedule',(req,res)=>{
//    console.log(req.body); 
   let i=0;
   for(let key in req.body){
        let timing=req.body[key];
        key=key.split("-");
        let subject=key[0];
        let day=key[1];
        let str="";
        str+=(day+','+timing);
        Subjects[subject][i]=str;
        console.log(subject," ",Subjects[subject][i]);
        i++;
   }

   console.log("SUBJECTS SCHEDULE NOW: ",Subjects);
    // for(let i=0;i<Subjects.length;i++)
    //     for(let j=0;j<Subjects)
//    res.send("done");
   res.render("index",{data:{
        user:User.user,
        subjects:User.subjects,
        allocate:User.time,
        schedule:Subjects  
   }});

});

app.get('/:userQuery',(req,res)=>{
    res.render('index',{data : {userQuery: req.params.userQuery,
                               searchResults : ['book1','book2','book3'],
                               loggedIn : true,
                               username : 'lkjslkjdf'}});
});

// Socket 