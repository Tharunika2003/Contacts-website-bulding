const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');

var serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
// const path = require("path");
var express = require('express')  
var app = express()  
app.set('view engine', 'ejs');
// app.use(express.static('public'));
// app.use('/css',express.static(__dirname+'public/css'))
app.get('/Home', (req, res) => {   
    res.render("Home") 
    // res.sendFile(__dirname+"/home.html") 
});
app.get('/signup', (req, res) => {  
    res.render("signup");
});
app.get('/login', (req, res) => {  
    res.render("login");
});
app.get('/newContact', (req, res) => {  
    res.render("newContact");
});
app.get('/logoutHome', (req, res)=> {
    res.render("logoutHome");
});

app.get('/contacts', (req, res) => {
    var a =[]  
    
    db.collection("contactsData").get().then((docs)=>{
           
            docs.forEach((doc) => {
                  a.push(doc.data())
            });
        })
        .then(()=>{
          console.log(a)
        res.render("contacts", {a:a})
      });
});
app.get('/signupSubmit', function (req, res) {  
        const name = req.query.name;
        const email = req.query.email;
        const password = req.query.password;
        db.collection("contactsSignUp").add({
            name: name ,
            email: email,
            password: password,
        })
        .then(()=>{
        
            res.render("login")
        });
});
app.get('/loginSubmit', function (req, res) {  
        const email = req.query.em;
        const password = req.query.pwd;
        db.collection("contactsSignUp")
            .where("email", "==", email)
            .where("password", "==", password)
            .get()
             .then((docs) => {
                if(docs.size>0){
                    res.render('loginHome.ejs');
                }
                else{
                    res.send("login failed")
                }
            });
}); 
app.get('/contactSubmit', function (req, res) {  
    const name = req.query.name;
    const email = req.query.email;
    const phone = req.query.phone;
    db.collection("contactsData").add({
        name: name,
        email: email,
        phone: phone,
    })
    .then(()=>{
       res.send("contact added sucessfully")
        // res.render('contacts.ejs');
    });
}); 
app.listen(3000, function () {  
console.log('Example app listening on port 3000!')  
});