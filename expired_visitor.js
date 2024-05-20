const mongoose = require('mongoose');
const visitor_data = require('./models/visitor')
const visitors = require('./seeds/sample_visitors')
const moment = require('moment');

// Establish MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/e-gate");
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))

//Sample data insertion
const seedDB = async () => {
    await visitor_data.deleteMany({})
    for (let visitor of visitors) {
        const visiting_person = new visitor_data({
            username: visitor.username,
            name: visitor.name,
            password: visitor.password,
            phone_number: visitor.phone_number,
            vehicle_number: visitor.vehicle_number,
            exit_time: visitor.exit_time,
            gate_number: visitor.gate_number,
            sic: visitor.sic,
            concerned_with: visitor.concerned_with,
            reason: visitor.reason,
            isApproved: visitor.isApproved,
            isExpired: visitor.isExpired
        })
        await visiting_person.save()
    }
}

seedDB().then(() => {
    console.log("seeded");
})

// Function to fetch campus data from the 'visitor' collection
async function fetchCampusData() {
    try {
        // Fetch data from MongoDB
        const data = await visitor_data.find({});

        // Map over the data and mark expired persons
        const current_date = Date.now();
        const formatted_current_date = moment(current_date).format('YYYY-MM-DD HH:mm:ss');

        for (let i = 0; i < data.length; i++) {
            const person = data[i];
            const person_exit_formatted = moment(person.exit_time).format('YYYY-MM-DD HH:mm:ss');
            const person_exit = moment(person.exit_time);
            person.isExpired = moment(person_exit).isBefore(formatted_current_date);
            console.log(person_exit_formatted, " ", formatted_current_date);
            await person.save();
        }

        console.log("Data formatted successfully");
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return []; // Return an empty array if an error occurs
    }
}


module.exports = fetchCampusData;