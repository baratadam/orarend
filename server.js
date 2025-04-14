const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Betölti az órákat
app.get("/orak", (req, res) => {
  db.all("SELECT * FROM orak", (err, rows) => {
    if (err) {
      console.error("Hiba a /orak lekérdezésnél:", err);
      return res.status(500).send(err.message);
    }
    res.json(rows);
  });
});

// Új óra hozzáadása
app.post("/orak", (req, res) => {
  const { nap, tantargy, idopont } = req.body;
  db.run(
    "INSERT INTO orak (nap, tantargy, idopont) VALUES (?, ?, ?)",
    [nap, tantargy, idopont],
    function (err) {
      if (err) {
        console.error("Hiba a /orak POST kéréseknél:", err);
        return res.status(500).send(err.message);
      }
      res.json({ id: this.lastID });
    }
  );
});

// Óra szerkesztése
app.put("/orak/:id", (req, res) => {
  const { nap, tantargy, idopont } = req.body;
  db.run(
    "UPDATE orak SET nap = ?, tantargy = ?, idopont = ? WHERE id = ?",
    [nap, tantargy, idopont, req.params.id],
    (err) => {
      if (err) {
        console.error("Hiba a /orak PUT kéréseknél:", err);
        return res.status(500).send(err.message);
      }
      res.sendStatus(200);
    }
  );
});

// Óra törlése
app.delete("/orak/:id", (req, res) => {
  db.run("DELETE FROM orak WHERE id = ?", req.params.id, (err) => {
    if (err) {
      console.error("Hiba a /orak DELETE kéréseknél:", err);
      return res.status(500).send(err.message);
    }
    res.sendStatus(200);
  });
});

app.listen(port, () => {
  console.log(`Szerver fut a http://localhost:${port} címen.`);
});
