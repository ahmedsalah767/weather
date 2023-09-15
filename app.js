const express = require('express');

const app = express();
const path = require('path')
const axios = require('axios')
const bodyParser = require('body-parser')
app.use(express.json({limit: '10kb'}))

app.set('views', path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname, 'public')))

/*
app.get('/', async (req,res)=>{
res.render('index')


})
*/

app.get('/', async (req,res)=>{
    try {
        if (!req.query.city) return res.render('index', {night:false})
        const resp = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${req.query.city}&units=metric&appid=96e56d95a497dbf34322aa9d765c336f`);
        const weather = resp.data.weather[0].description;
        const temp = resp.data.main.temp
        const city= req.query.city
        const code= resp.data.sys.country
        const gmt =resp.data.timezone / 3600
        const now = new Date();
        const hours = now.getUTCHours();
        const minutes = now.getUTCMinutes();
        const time = `${hours+gmt}:${minutes}`;
        let night = false
        if(hours+gmt>=19 || hours+gmt<=6) night = true
        //const now = new Date().toLocaleTimeString('en-US', { timeZone: city });
        console.log(weather, temp, night);
        res.render('index', { weather, temp, city, code,time,night });
    }
    catch (err) {
        console.log(err);
        res.render('index', { error:'City not found' });

    }
    })




//status, in each status I want to change the background, we can add special class in each case
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')





app.get('/*', async (req,res) =>{
        res.status(404).json({
            message: 'Error not found'
        })
    })






module.exports = app