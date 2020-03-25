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
app.get("/api/varasto_riistavesi/haku", (req, res, next) => {
    var nimi = req.query.nimi || '';
    var sijainti = req.query.sijainti_ID || '';

    var kysely = 'SELECT ID, nimi, maara, yksikkotyyppi_ID, yksikkohinta, saldo, sijainti_ID, kommentit FROM varasto_riistavesi WHERE nimi LIKE ' + con.escape('%' + nimi + '%') + ' AND sijainti_ID LIKE ' + con.escape(sijainti + '%');
   // kysely + ' SELECT tuote.yksikkotyyppi_ID, yksikkotyyppi.nimi FROM tuote INNER JOIN yksikkotyyppi ON tuote.yksikkotyyppi_ID = yksikkotyyppi.ID';

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

// Poista tuote
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

// Lisää tuote
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

// Hae yksittäisen tuotteen tiedot
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

// Muokkaa yksittäisen tuotteen tietoja
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

// 404 virhettä, jos kutsu ei täsmää edellä oleviin osoitteisiin/metodeihin
app.use(function (req, res, next) {
    res.sendStatus(404);
});


// Kuunnellaan porttia 3000 osoitteessa 127.0.0.1
app.listen(3000, '127.0.0.1', () => {
    console.log("Server running at http://127.0.0.1:3000/");
});