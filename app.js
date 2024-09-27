const express = require('express')
const bodyParser = require("body-parser")
const fs = require('fs')
const app = express()
const PORT = 5000
const path = require('path')

//Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs')

const getEvents = () => {
    const data = fs.readFileSync('./db/data.js', 'utf8');
    return data
};

// Function to save events back to the JSON file
const saveEvents = (events) => {
    fs.writeFileSync('./data/events.json', JSON.stringify(events, null, 2));
};

app.get('/', (req,res) =>{
    res.render('pages/search')
})

app.listen(PORT, ()=>{
    console.log(`Server is on port ${PORT}`)
})