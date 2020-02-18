'use strict'

var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var app = express();
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'varastokirjanpito'
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type');
    next();
});

// Hae tuotteet
app.get("/api/varastosaldo/haku", (req, res, next) => {
    var nimi = req.query.nimi || '';

    var kysely = 'SELECT id, nimi, maara, yksikko, sijainti, kommentit FROM varastosaldo WHERE nimi LIKE ' + con.escape(nimi + '%');

    con.query(kysely, function (err, result, fields) {
        if (err) {
            console.log('Virhe haettaessa dataa varastosaldo-taulusta, syy: ' + err);
            res.status(500).json({ 'status': 'not ok', 'status_text': err.sqlMessage });
        } else {
            console.log(JSON.stringify(result));
            res.status(200).json(result);
        }
    });
});

// Poista tuote
app.get("/api/varastosaldo/poista", (req, res, next) => {
    var id = req.query.id || '';

    con.query('DELETE FROM varastosaldo WHERE id = ?', [id], function (err, result, fields) {
        if (err) {
            console.log('Virhe poistettaessa dataa varastosaldo-taulusta, syy: ' + err);
            res.status(500).json({ 'status': 'not ok', 'status_text': err.sqlMessage });
        } else {
            console.log(JSON.stringify(result));
            res.status(200).json({ 'status': 'ok', 'status_text': result.affectedRows + ' rows deleted' });
        }
    });
});

// Lisää tuote
app.post("/api/varastosaldo/lisaa", (req, res, next) => {
    if (typeof req.body.nimi === "undefined") {
        res.json({ "status": "not ok", "status_text": "nimi-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.maara === "undefined") {
        res.json({ "status": "not ok", "status_text": "m\u00e4\u00e4r\u00e4-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.yksikko === "undefined") {
        res.json({ "status": "not ok", "status_text": "yksikk\u00F6-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.sijainti === "undefined") {
        res.json({ "status": "not ok", "status_text": "sijainti-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.kommentit === "undefined") {
        res.json({ "status": "not ok", "status_text": "kommentit-kentt\u00e4 puuttuu" });
    }

    con.query('INSERT INTO varastosaldo(nimi, maara, yksikko, sijainti, kommentit) VALUES (?, ?, ?, ?, ?)', [req.body.nimi, req.body.maara, req.body.yksikko, req.body.sijainti, req.body.kommentit], function (err, result, fields) {
        if (err) {
            console.log('Virhe lis\u00e4tt\u00e4ess\u00e4 dataa varastosaldo-tauluun, syy: ' + err);
            res.status(500).json({ 'status': 'not ok', 'status_text': err.sqlMessage });
        } else {
            console.log(JSON.stringify(result));
            res.status(200).json({ 'status': 'ok', 'status_text': result.affectedRows + ' rows added' });
        }
    });
});

// Hae yksittäisen tuotteen tiedot
app.get("/api/varastosaldo/:id", (req, res, next) => {
    con.query('SELECT id, nimi, maara, yksikko, sijainti, kommentit FROM varastosaldo WHERE id=' + con.escape(req.params.id), function (err, result, fields) {
        if (err) {
            console.log('Virhe haettaessa dataa varastosaldo-taulusta, syy: ' + err);
            res.status(500).json({ 'status': 'not ok', 'status_text': err.sqlMessage });
        } else {
            console.log(JSON.stringify(result));
            res.status(200).json(result);
        }
    });
});

// Muokkaa yksittäisen tuotteen tietoja
app.post("/api/varastosaldo/:id", (req, res, next) => {
    if (typeof req.body.nimi === "undefined") {
        res.json({ "status": "not ok", "status_text": "nimi-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.maara === "undefined") {
        res.json({ "status": "not ok", "status_text": "m\u00e4\u00e4r\u00e4-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.yksikko === "undefined") {
        res.json({ "status": "not ok", "status_text": "yksikk\u00F6-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.sijainti === "undefined") {
        res.json({ "status": "not ok", "status_text": "sijainti-kentt\u00e4 puuttuu" });
    }
    if (typeof req.body.kommentit === "undefined") {
        res.json({ "status": "not ok", "status_text": "kommentit-kentt\u00e4 puuttuu" });
    }

    con.query('UPDATE varastosaldo SET nimi=?, maara=?, yksikko=?, sijainti=?, kommentit=? WHERE id=?', [req.body.nimi, req.body.maara, req.body.yksikko, req.body.sijainti, req.body.kommentit, req.params.id], function (err, result, fields) {
        if (err) {
            console.log('Virhe muokattaessa dataa varastosaldo-taulussa, syy: ' + err);
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