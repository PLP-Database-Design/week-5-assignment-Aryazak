//import dependencies
const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
//configuring the environment variables 
app.use(express.json());
app.use(cors());
dotenv.config();

//connection to the database 
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})
//communicating to the ejs file
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//checking if there is connection 
db.connect((err) =>{
    if (err){
        return console.log('Error connecting tot the database: ', err)
    }
    console.log("successfully connected to mysql: ", db.threadId);
})
// question 1...retrieve all patients
app.get('/patients', (req, res) =>{
    const getPatients = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients"
    db.query(getPatients, (err, data)=>{
        if(err){
            return res.status(400).send("Failed to get patients", err)
        }
        res.status(200).send(data)
    })
})
// question 2.... Retrieve all providers
app.get('/providers', (req, res) => {
    const getProviders = 'SELECT first_name, last_name, provider_specialty FROM providers';
    db.query(getProviders, (err, data) => {
        if (err) {
            return res.status(400).send('Failed to get providers');
        }
        res.status(200).send(data);
    });
});
// question 3... Filter patients by first name
app.get('/patients/filter', (req, res) => {
    const firstName = req.query.first_name;
    
    if (!firstName) {
        return res.status(400).send('Please provide a first name');
    }

    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    db.query(query, [firstName], (err, data) => {
        if (err) {
            return res.status(400).send('Failed to get patients by first name');
        }

        if (data.length === 0) {
            return res.status(404).send('No patients found with that first name');
        }

        res.status(200).send(data);
    });
});
// question 4... Retrieve all providers by their specialty
app.get('/providers/filter', (req, res) => {
    const specialty = req.query.specialty;
    if (!specialty) {
        return res.status(400).send('Please provide a specialty');
    }

    const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
    db.query(query, [specialty], (err, data) => {
        if (err) {
            return res.status(400).send('Failed to get providers by specialty');
        }

        if (data.length === 0) {
            return res.status(404).send('No providers found with that specialty');
        }

        res.status(200).send(data);
    });
});



//start and listen to server
app.listen(3301, () => {
    console.log('server is running on port 3301...')
})