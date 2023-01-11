const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
// JST PASSING BY
// Our list of patients. Instead of implimenting a back0end database I made variables. 
let patients = new Object();
patients["900023266"] = ["Toby", "Perez", "910-328-0484"];
patients["600023299"] = ["Mike", "Willow", "323-420-6969"];

// My records variable - the info the user receives when they resquest using GET/PUT/POST/DELETE function.
let records = new Object();
records["900023266"] = "Status: Healthy";
records["600023299"] = "Status: Slight Fever";

// HTTP GET patient medical records - request info
// " /records " in the records folder
// req = request , res = response 
app.get("/records", (req, res) => {
  // verify patient exists
  if (records[req.headers.ssn] === undefined) {
    res.status(404).send({ msg: "Patient not found." });
    return;
  }

  // verify SSN matches first and last name
  if (
    req.headers.firstname == patients[req.headers.ssn][0] &&
    req.headers.lastname == patients[req.headers.ssn][1]
  ) {
    if (req.body.reasonforvisit === "medicalrecords") {
      // return medical records, ie. healthy or slight fever.
      res.status(200).send(records[req.headers.ssn]);
      return;
    } else {
      // return error
      res.status(501).send({
        msg:
          "unable to complete request at this time: " + req.body.reasonforvisit,
      });
      return;
    }
    // first last name match
  } else {
    res.status(401).send({ msg: "first or last name didn't match SSN." });
    return;
  }

  // first last and ssn match

  // verify appropriate record

  res.status(200).send({ msg: "HTTP GET SUCCESS!" });
});

// HTTP POST - Create a new patient
app.post("/", (req, res) => {
  // create patient in database
  patients[req.headers.ssn] = [
    req.headers.firstname,
    req.headers.lastname,
    req.headers.phone,
  ];
  res.status(200).send(patients);
});

// HTTP PUT - Update existing patient phone number
app.put("/", (req, res) => {
  // verify patient exists
  if (records[req.headers.ssn] === undefined) {
    res.status(404).send({ msg: "Patient not found." });
    return;
  }

  if (
    req.headers.firstname == patients[req.headers.ssn][0] &&
    req.headers.lastname == patients[req.headers.ssn][1]
    // Update phone number and return patient info
  ) {
    patients[req.headers.ssn] = [
      req.headers.firstname,
      req.headers.lastname,
      req.body.phone,
    ];
    res.status(200).send(patients[req.headers.ssn]);
    return;
  } else {
    res.status(401).send({
      msg: "first or last name didn't match SSN - failed to update phone number.",
    });
    return;
  }

  // make sure patient exists
  res.status(200).send({ msg: "HTTP PUT SUCCESS!" });
});

// HTTP DELETE - Delete patient records
app.delete("/", (req, res) => {
  if (records[req.headers.ssn] === undefined) {
    res.status(404).send({ msg: "Patient not found." });
    return;
  }

  // verify SSN matches first and last name
  if (
    req.headers.firstname == patients[req.headers.ssn][0] &&
    req.headers.lastname == patients[req.headers.ssn][1]
  ) {
    // delete patient and medical records from database

    delete patients[req.headers.ssn];
    delete records[req.headers.ssn];

    res.status(200).send(patients);
    return;
  } else {
    res
      .status(401)
      .send({ msg: "first or last name didn't match SSN - failed to delete" });
    return;
  }

  res.status(200).send({ msg: "HTTP DELETE SUCCESS!" });
});

app.listen(3000);
// API up and running, listening on port 3000
// through web browser ( localhost:3000 ), the browser sends a GET request and "receives and runs" the
/// block of code we defined in app.get, app.put, app.post and app.delete
// each HTTP request nloack of code is an API route. We can send and receive information from Postman.
