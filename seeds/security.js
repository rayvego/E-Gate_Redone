if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require('mongoose')
const Security = require("../models/security")
const securities = require("./security_users")
const bcrypt = require("bcrypt")

mongoose.connect(process.env.DB_URL) // Connecting to the application's db.
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Security: Mongo connection successful ✅")
})

const hash_password = async (password) => {
    const hash = await bcrypt.hash(password, 12)
    return hash
}

const seedDB = async () => {
    await Security.deleteMany({})
    for (let security of securities) {
        const hashedPassword = await hash_password(security.password);
        const security_user = new Security({
            name: security.name,
            sic: security.sic,
            phone_number: security.phone_number,
            password: hashedPassword,
            image: security.image,
        })
        await security_user.save()
    }
}

seedDB().then(() => {
    console.log("Seeded Security!")
    mongoose.connection.close()
})