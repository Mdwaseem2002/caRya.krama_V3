const mongoose = require('mongoose');

async function main() {
    await mongoose.connect("mongodb+srv://DBC_Pentacoud:Pentacloud%40123@cluster0.yjflp6k.mongodb.net/Caryakrama?retryWrites=true&w=majority&appName=Cluster0");
    const db = mongoose.connection.db;
    const reports = await db.collection("inspection_reports").find({}).toArray();
    console.log("ALL REPORTS IN DB:");
    for (let r of reports) {
        console.log(`id: ${r.id}, carId: ${r.carId}, carName: ${r.carName}`);
    }
    process.exit(0);
}

main().catch(console.error);
