const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/SIH');
        console.log("Connected to Database")
        
    } catch (error) {
        console.log(error);
    }
}