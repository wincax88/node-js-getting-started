const cool = require('cool-ascii-faces');
const express = require('express')
const path = require('path')
const formData = require('express-form-data');
const cors = require('cors')
// import {recognizeDocument} from './ocr-general-multi-node'

const ocr = require('./ocr-general-multi-node')

const recognizeDocument = ocr.recognizeDocument
console.log(ocr.recognizeDocument);

const PORT = process.env.PORT || 5000

express()
  .use(cors())
  .use(express.static(path.join(__dirname, 'public')))
  .use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  })
  .use(formData.parse())
  .use(express.json()) // for parsing application/json
  .use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .get('/times', (req, res) => res.send(showTimes()))
  .post('/recognize', (req, res) => {
    // console.log('req -> ', req.body);
    recognizeDocument(req.body.image, req.body.timestamp)
    .then(data => {
      res.send(data)
    })
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  showTimes = () => {
    let result = '';
    const times = process.env.TIMES || 5;
    for (i = 0; i < times; i++) {
      result += i + ' ';
    }
    return result;
  }
