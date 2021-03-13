require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require("mongoose")
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
const dns = require("dns")
const validator = require("validator")

const urlSchema = new mongoose.Schema({
  original_url : {
    type: String,
    validate(value) {
      if(!validator.isURL(value , {protocols: ['http','https'], require_protocol: true, require_valid_protocol: true})) {
        throw new Error("invalid url")
      }
    },
    required : true
  }, 
  short_url : {
    type: Number,
    unique: true
  }
})

const url = mongoose.model('Url' , urlSchema)

// Basic Configuration
const port = process.env.PORT || 3000;

mongoose.connect("mongodb+srv://OmarAbuRish:hbxLRLCbKARXZSvZ@cluster0.2ywuh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })

app.use(cors());

app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl/new" , async (req,res) => {
  try {
    console.log(req.body)

    // dns.lookup(req.body.url , (err, address, family) => {
    //   if(err) {
    //       console.log(err)
    //   }
    // });
    const newUrl = new url({
      original_url : req.body.url,
      short_url : Math.floor(Math.random() * 1000000) + 1
    })

    await newUrl.save()
    res.send(newUrl)
  } catch(e) {
      res.send({error: "Invalid URL"})
  }
})

app.get("/api/shorturl/:urlNumber", async (req, res) => {
  try {
    const foundUrl = await url.findOne({short_url : req.params.urlNumber})

    res.writeHead(302, {'Location': foundUrl.original_url});
    res.end();
  } catch(e) {
    res.status(404).send()
  }
})
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
