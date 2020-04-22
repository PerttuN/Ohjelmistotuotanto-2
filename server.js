'use strict'

var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

const session = require('express-session');

var app = express();
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'varastokirjanpito'
});

app.use(bodyParser.urlencoded({ extended: true }))


const{
    PORT = 3000,
    session_name = 'sid',
    session_secret = 'jotakin'
} = process.env

//Tässä tehdään sessio
app.use(session({
    name: session_name,
    saveUninitialized: false,
    resave: false,
    secret: session_secret,
    cookie: {
        sameSite: true
    }
}))

//Tässä luodaan käyttäjät
const users = [
    {id: 1, name: 'Opettaja', password: 'Opettaja123'},
    {id: 2, name: 'Opiskelija', password: 'Opiskelija123'}
]

app.use(express.json())

//Vie takaisin kirjautumissivulle
const redirectLogin = (req, res, next) => {
    if(!req.session.userid){
        res.redirect('/login')
    }else{
        next()
    }
}

//Vie takaisin kotisivulle
const redirectHome = (req, res, next) => {
    if(req.session.userid){
        res.redirect('/home')
    }else{
        next()
    }
}

//Avaa kirjautumissivun, kun avaa localhost:3000
app.get('/', (req, res) => {
    const{userid} = req.session

    res.sendFile('kirjautuminen.html', {root: __dirname})
})

//Tässä on sivu, jossa kysyy kirjautumista
app.get('/login', redirectHome, (req, res) => {

    res.sendFile('login.html', {root: __dirname})
})

//Kirjautuu sisään käyttäjällä
app.post('/login', redirectHome, (req, res) => {
    const{name, password} = req.body
    
    if(name && password){
        const user = users.find(
            user => user.name === name && user.password === password
        )

        if(user){
            req.session.userid = user.id
            return res.redirect('/home')
        }
    }

    res.redirect('/login')
})

//Kirjautuu ulos käyttäjällä
app.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if(err){
            return res.redirect('/home')
        }

        res.clearCookie(session_name)
        res.redirect('/')
    })
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type');
    next();
});

//Käynnistää sivun, jossa on kaikki toiminnot
app.get('/home', redirectLogin, (req, res) => {
    res.sendFile('kayttoliittyma.html', {root: __dirname})
})

//Käynnistää sivun, jossa on kaikki toiminnot
app.get('/budjetinhallinta', redirectLogin, (req, res) => {
    res.sendFile('budjetinhallinta.html', {root: __dirname})
})

app.get('/tilaukset', redirectLogin, (req, res) => {
    res.sendFile('tilaukset.html', {root: __dirname})
})

// Hae tuotteet melalahti
    app.get("/api/varasto_melalahti/haku", (req, res, next) => {
    var nimi = req.query.nimi || '';
    var sijainti = req.query.sijainti_ID || '';
    var kysely = 'SELECT ID, nimi, maara, yksikkotyyppi_ID, yksikkohinta, saldo, sijainti_ID, kommentit FROM varasto_melalahti WHERE nimi LIKE ' + con.escape('%' + nimi + '%') + ' AND sijainti_ID LIKE ' + con.escape(sijainti + '%');
    
    con.query(kysely, function (err, result, fields) {
        if (err) {
            console.log('Virhe haettaessa dataa tuote-taulusta, syy: ' + err);
            res.status(500).json({ 'status': 'not ok', 'status_text': err.sqlMessage });
        } else {
            console.log(JSON.stringify(result));
            res.status(200).json(result);
        }
    });
});

// Hae tuotteet riistavesi
app.get("/api/varasto_riistavesi/haku", (req, res, next) => {
    var nimi = req.query.nimi || '';
    var sijainti = req.query.sijainti_ID || '';

    var kysely = 'SELECT ID, nimi, maara, yksikkotyyppi_ID, yksikkohinta, saldo, sijainti_ID, kommentit FROM varasto_riistavesi WHERE nimi LIKE ' + con.escape('%' + nimi + '%') + ' AND sijainti_ID LIKE ' + con.escape(sijainti + '%');
     // kysely + ' SELECT varasto_riistavesi.yksikkotyyppi_ID, yksikkotyyppi.nimi FROM varasto_riistavesi INNER JOIN yksikkotyyppi ON varasto_riistavesi.yksikkotyyppi_ID = yksikkotyyppi.ID';

    con.query(kysely, function (err, result, fields) {
        if (err) {
            console.log('Virhe haettaessa dataa tuote-taulusta, syy: ' + err);
            res.status(500).json({ 'status': 'not ok', 'status_text': err.sqlMessage });
        } else {
            console.log(JSON.stringify(result));
            res.status(200).json(result);
        }
    });
});


// Yksikkötyypin haku
app.get("/api/varastokirjanpito/yksikkotyyppi", (req, res, next) => {
    con.query('SELECT ID, nimi FROM yksikkotyyppi', function (err, result, fields) {
        if (err) {
            console.log('Virhe haettaessa dataa yksikkotyyppi-taulusta, syy: ' + err);
            res.status(500).json({ 'status': 'not ok', 'status_text': err.sqlMessage });
        } else {
            console.log(JSON.stringify(result));
            res.status(200).json(result);
        }
    });
});

// Sijainti haku
app.get("/api/varastokirjanpito/sijainti", (req, res, next) => {
    con.query('SELECT ID, nimi FROM sijainti', function (err, result, fields) {
        if (err) {
            console.log('Virhe haettaessa dataa sijainti-taulusta, syy: ' + err);
            res.status(500).json({ 'status': 'not ok', 'status_text': err.sqlMessage });
        } else {
            console.log(JSON.stringify(result));
            res.status(200).json(result);
        }
    });
});

// Poista tuote riistavesi
app.get("/api/varasto_riistavesi/poista", (req, res, next) => {
    var id = req.query.ID || '';

    con.query('DELETE FROM varasto_riistavesi WHERE ID = ?', [id], function (err, result, fields) {
        if (err) {
            console.log('Virhe poistettaessa dataa tuote-taulusta, syy: ' + err);
            res.status(500).json({ 'status': 'not ok', 'status_text': err.sqlMessage });
        } else {
            console.log(JSON.stringify(result));
            res.status(200).json({ 'status': 'ok', 'status_text': result.affectedRows + ' rows deleted' });
        }
    });
});

// Poista tuote melalahti
app.get("/api/varasto_melalahti/poista", (req, res, next) => {
    var id = req.query.ID || '';

    con.query('DELETE FROM varasto_melalahti WHERE ID = ?', [id], function (err, result, fields) {
        if (err) {
            console.log('Virhe poistettaessa dataa tuote-taulusta, syy: ' + err);
            res.status(500).json({ 'status': 'not ok', 'status_text': err.sqlMessage });
        } else {
            console.log(JSON.stringify(result));
            res.status(200).json({ 'status': 'ok', 'status_text': result.affectedRows + ' rows deleted' });
        }
    });
});

// Lisää tuote riistavesi
app.post("/api/varasto_riistavesi/lisaa", (req, res, next) => {
    if (typeof req.body.nimi === "undefined") {
        res.json({ "status": "not ok", "status_text": "nimi-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.maara === "undefined") {
        res.json({ "status": "not ok", "status_text": "m\u00e4\u00e4r\u00e4-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.yksikkotyyppi_ID === "undefined") {
        res.json({ "status": "not ok", "status_text": "yksikk\u00F6tyyppi-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.yksikkohinta === "undefined") {
        res.json({ "status": "not ok", "status_text": "yksikk\u00F6hinta-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.sijainti_ID === "undefined") {
        res.json({ "status": "not ok", "status_text": "sijainti-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.kommentit === "undefined") {
        res.json({ "status": "not ok", "status_text": "kommentit-kentt\u00e4 puuttuu" });
    }

    con.query('INSERT INTO varasto_riistavesi(nimi, maara, yksikkotyyppi_ID, yksikkohinta, saldo, sijainti_ID, kommentit) VALUES (?, ?, ?, ?, ?, ?, ?)', [req.body.nimi, req.body.maara, req.body.yksikkotyyppi_ID, req.body.yksikkohinta, req.body.saldo, req.body.sijainti_ID, req.body.kommentit], function (err, result, fields) {
        if (err) {
            console.log('Virhe lis\u00e4tt\u00e4ess\u00e4 dataa tuote-tauluun, syy: ' + err);
            res.status(500).json({ 'status': 'not ok', 'status_text': err.sqlMessage });
        } else {
            console.log(JSON.stringify(result));
            res.status(200).json({ 'status': 'ok', 'status_text': result.affectedRows + ' rows added' });
        }
    });
});

// Lisää tuote melalahti
app.post("/api/varasto_melalahti/lisaa", (req, res, next) => {
    if (typeof req.body.nimi === "undefined") {
        res.json({ "status": "not ok", "status_text": "nimi-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.maara === "undefined") {
        res.json({ "status": "not ok", "status_text": "m\u00e4\u00e4r\u00e4-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.yksikkotyyppi_ID === "undefined") {
        res.json({ "status": "not ok", "status_text": "yksikk\u00F6tyyppi-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.yksikkohinta === "undefined") {
        res.json({ "status": "not ok", "status_text": "yksikk\u00F6hinta-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.sijainti_ID === "undefined") {
        res.json({ "status": "not ok", "status_text": "sijainti-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.kommentit === "undefined") {
        res.json({ "status": "not ok", "status_text": "kommentit-kentt\u00e4 puuttuu" });
    }

    con.query('INSERT INTO varasto_melalahti(nimi, maara, yksikkotyyppi_ID, yksikkohinta, saldo, sijainti_ID, kommentit) VALUES (?, ?, ?, ?, ?, ?, ?)', [req.body.nimi, req.body.maara, req.body.yksikkotyyppi_ID, req.body.yksikkohinta, req.body.saldo, req.body.sijainti_ID, req.body.kommentit], function (err, result, fields) {
        if (err) {
            console.log('Virhe lis\u00e4tt\u00e4ess\u00e4 dataa tuote-tauluun, syy: ' + err);
            res.status(500).json({ 'status': 'not ok', 'status_text': err.sqlMessage });
        } else {
            console.log(JSON.stringify(result));
            res.status(200).json({ 'status': 'ok', 'status_text': result.affectedRows + ' rows added' });
        }
    });
});

// Hae yksittäisen tuotteen tiedot riistavesi
app.get("/api/varasto_riistavesi/:ID", (req, res, next) => {
    con.query('SELECT ID, nimi, maara, yksikkotyyppi_ID, yksikkohinta, saldo, sijainti_ID, kommentit FROM varasto_riistavesi WHERE ID=' + con.escape(req.params.ID), function (err, result, fields) {
        if (err) {
            console.log('Virhe haettaessa dataa tuote-taulusta, syy: ' + err);
            res.status(500).json({ 'status': 'not ok', 'status_text': err.sqlMessage });
        } else {
            console.log(JSON.stringify(result));
            res.status(200).json(result);
        }
    });
});

// Hae yksittäisen tuotteen tiedot melalahti
app.get("/api/varasto_melalahti/:ID", (req, res, next) => {
    con.query('SELECT ID, nimi, maara, yksikkotyyppi_ID, yksikkohinta, saldo, sijainti_ID, kommentit FROM varasto_melalahti WHERE ID=' + con.escape(req.params.ID), function (err, result, fields) {
        if (err) {
            console.log('Virhe haettaessa dataa tuote-taulusta, syy: ' + err);
            res.status(500).json({ 'status': 'not ok', 'status_text': err.sqlMessage });
        } else {
            console.log(JSON.stringify(result));
            res.status(200).json(result);
        }
    });
});


// Yksittäisen tuotteen tietojen muokkaus riistavesi
app.post("/api/varasto_riistavesi/:ID", (req, res, next) => {
    if (typeof req.body.nimi === "undefined") {
        res.json({ "status": "not ok", "status_text": "nimi-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.maara === "undefined") {
        res.json({ "status": "not ok", "status_text": "m\u00e4\u00e4r\u00e4-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.yksikkotyyppi_ID === "undefined") {
        res.json({ "status": "not ok", "status_text": "yksikk\u00F6tyyppi-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.yksikkohinta === "undefined") {
        res.json({ "status": "not ok", "status_text": "yksikk\u00F6hinta-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.sijainti_ID === "undefined") {
        res.json({ "status": "not ok", "status_text": "sijainti-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.kommentit === "undefined") {
        res.json({ "status": "not ok", "status_text": "kommentit-kentt\u00e4 puuttuu" });
    }

    con.query('UPDATE varasto_riistavesi SET nimi=?, maara=?, yksikkotyyppi_ID=?, yksikkohinta=?, saldo=?, sijainti_ID=?, kommentit=? WHERE ID=?', [req.body.nimi, req.body.maara, req.body.yksikkotyyppi_ID, req.body.yksikkohinta, req.body.saldo, req.body.sijainti_ID, req.body.kommentit, req.params.ID], function (err, result, fields) {
        if (err) {
            console.log('Virhe muokattaessa dataa tuote-taulussa, syy: ' + err);
            res.status(500).json({ 'status': 'not ok', 'status_text': err.sqlMessage });
        } else {
            console.log(JSON.stringify(result));
            res.status(200).json({ 'status': 'ok', 'status_text': result.affectedRows + ' rows updated' });
        }
    });
});

// Yksittäisen tuotteen tietojen muokkaus melalahti
app.post("/api/varasto_melalahti/:ID", (req, res, next) => {
    if (typeof req.body.nimi === "undefined") {
        res.json({ "status": "not ok", "status_text": "nimi-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.maara === "undefined") {
        res.json({ "status": "not ok", "status_text": "m\u00e4\u00e4r\u00e4-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.yksikkotyyppi_ID === "undefined") {
        res.json({ "status": "not ok", "status_text": "yksikk\u00F6tyyppi-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.yksikkohinta === "undefined") {
        res.json({ "status": "not ok", "status_text": "yksikk\u00F6hinta-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.sijainti_ID === "undefined") {
        res.json({ "status": "not ok", "status_text": "sijainti-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.kommentit === "undefined") {
        res.json({ "status": "not ok", "status_text": "kommentit-kentt\u00e4 puuttuu" });
    }

    con.query('UPDATE varasto_melalahti SET nimi=?, maara=?, yksikkotyyppi_ID=?, yksikkohinta=?, saldo=?, sijainti_ID=?, kommentit=? WHERE ID=?', [req.body.nimi, req.body.maara, req.body.yksikkotyyppi_ID, req.body.yksikkohinta, req.body.saldo, req.body.sijainti_ID, req.body.kommentit, req.params.ID], function (err, result, fields) {
        if (err) {
            console.log('Virhe muokattaessa dataa tuote-taulussa, syy: ' + err);
            res.status(500).json({ 'status': 'not ok', 'status_text': err.sqlMessage });
        } else {
            console.log(JSON.stringify(result));
            res.status(200).json({ 'status': 'ok', 'status_text': result.affectedRows + ' rows updated' });
        }
    });
});

// 404 virhettä, jos kutsu ei täsmää edellä oleviin osoitteisiin/metodeihin
app.use(function (req, res, next) {
    res.sendStatus(404);
});


// Kuunnellaan porttia 3000 osoitteessa 127.0.0.1
app.listen(3000, '127.0.0.1', () => {
    console.log("Server running at http://127.0.0.1:3000/");
});