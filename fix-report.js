const mongoose = require('mongoose');

async function main() {
    await mongoose.connect("mongodb+srv://DBC_Pentacoud:Pentacloud%40123@cluster0.yjflp6k.mongodb.net/Caryakrama?retryWrites=true&w=majority&appName=Cluster0");
    const db = mongoose.connection.db;
    
    // Update the specific report we found
    const result = await db.collection("inspection_reports").updateOne(
        { id: "IR-5030689" },
        { $set: { carId: "CK-6458437" } }
    );
    
    console.log("Update result:", result);
    process.exit(0);
}

main().catch(console.error);
