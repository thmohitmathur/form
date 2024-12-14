import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import nodemailer from "nodemailer";
// avxo ujcq gncx sezj

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Duniya",
    password: "g1234",
    port: 5432,

})
db.connect();
const app = express();
const port = 5000;

const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: 'mohit.dkv@gmail.com',
        pass: 'avxo ujcq gncx sezj',
    },
    secure: true,
});

function sendMailto(rec){
    transporter.sendMail(
        {
        from: "mohit.dkv@gmail.com",
        to: rec,
        subject: "Your registraiton has been completed",
        text: "Now you are a proudfull member of the website",
    
    },  function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }

); 
}

var l = 1;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal"
  ];

app.get("/" , (req, res)=>{
    if(l = 0){
        res.render("home.ejs", {login: "login"})
    } else{
        res.render("home.ejs");

    }
})

app.get("/login", (req, res)=> {
    res.render("login.ejs")
})

app.post("/loginS", async (req, res) => {

    try{
        const mail = req.body.email;
        const mpass = req.body.pass;

        const result =  await db.query("SELECT (email, password) FROM user_information WHERE (email, password) = ($1,$2) ", [mail, mpass])

        if(result.rows.length === 0){
            res.send('Invalid email or password');
        } else{
            l = 0;
            res.redirect("/");
        }

    } catch(err){
        console.log(err);
        res.send('Error Loggin In');
    }

})

app.get("/signup", (req, res)=> {
    
    res.render("signup.ejs", {states: states})
})

app.post("/add", async (req, res) => {

    try{
        const fullName = req.body.fullN;
        const mail = req.body.email;
        const mnum = req.body.number;
        const mpass = req.body.pass;
        const gender = req.body.gen;
        const addr = req.body.adress;
        const mcity = req.body.city;
        const mstate = req.body.state;
        const mzip = req.body.zip;
        sendMailto(mail);
        await db.query(" INSERT INTO user_information (full_name, email, phone_number, password, gender, address, city, state, zip_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING * ", [fullName, mail, mnum, mpass, gender, addr, mcity, mstate, mzip])
        res.redirect("/login");
    } catch(err){
        console.log(err);
    }
});

app.get("/delete", (req, res)=> {
    res.render("delete.ejs");
})

app.post("/deleteS", async (req, res) => {

    try{
        const mail = req.body.mail;
        const mpass = req.body.pass;
    
        await db.query("DELETE FROM user_information WHERE (email, password) = ($1, $2)", [mail, mpass]);
        l = 1;
        res.redirect("/");
    } catch(err){
        console.log(err);
    }
  
})

app.listen(port, () => {
    console.log(`port is listening on ${port}.....`);
})
