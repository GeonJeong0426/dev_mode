const express = require('express');
const cors = require('cors');
const app = express();
let path = require('path');
let sdk = require('./sdk');

const PORT = 8001;
const HOST = '0.0.0.0';

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/init', function (req, res) {
   let a = req.query.a;
   let args = [a];
   sdk.send(false, 'init', args, res);
});

app.get('/recommender', function (req, res) {
   let me = req.query.me;
   let recommender = req.query.recommender;
   let args = [me, recommender];
   sdk.send(false, 'recommender', args, res);
});

app.get('/delete', function (req, res) {
   let name = req.query.name;
   let args = [name];
   sdk.send(false, 'delete', args, res);
});

app.get('/gift', function (req, res) {
   let sender = req.query.sender;
   let receiver = req.query.receiver;
   let amount = req.query.amount;
   let args = [sender, receiver, amount];
   sdk.send(false, 'gift', args, res);
});

app.get('/payment', function (req, res) {
   let user = req.query.user;
   let amount = req.query.amount;
   let pointsToUse = req.query.pointsToUse;
   let args = [user, amount, pointsToUse];
   sdk.send(false, 'payment', args, res);
});

app.get('/lotto', function (req, res) {
   let user = req.query.user;
   let args = [user];
   try {
       sdk.send(false, 'lotto', args, res);
   } catch (error) {
       res.status(500).send('Failed to invoke chaincode: ' + error.message);
   }
});

app.get('/drawLotto', function (req, res) {
    sdk.send(false, 'drawLotto', [], res);
});

app.get('/queryAll', function (req, res) {
   sdk.send(false, 'query', [], res);
});

app.use(express.static(path.join(__dirname, '../client')));

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
