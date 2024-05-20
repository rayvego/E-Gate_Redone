const mongoose = require('mongoose')
const Resident_Detail = require("../models/resident_details")
const resident_details = require("./resident_users")
const bcrypt = require("bcrypt")

mongoose.connect("mongodb://127.0.0.1:27017/e-gate") // Connecting to the application's db.
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Resident: Mongo connection successful ✅")
})

const hash_password = async (password) => {
    const hash = await bcrypt.hash(password, 12)
    return hash
}

const seedDB = async () => {
    await Resident_Detail.deleteMany({})
    for (let resident of resident_details) {
        const hashedPassword = await hash_password(resident.password);
        const resident_user = new Resident_Detail({
            name: resident.name,
            ic: resident.ic,
            email: resident.email,
            address: resident.address,
            qr_code: resident.qr_code,
            phone_number: resident.phone_number,
            password: hashedPassword,
        })
        await resident_user.save()
    }
}

seedDB().then(() => {
    console.log("Seeded Resident!")
    mongoose.connection.close()
})