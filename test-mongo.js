const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://DBC_Pentacoud:Pentacloud%40123@cluster0.yjflp6k.mongodb.net/Caryakrama?retryWrites=true&w=majority&appName=Cluster0";
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

    try {
        console.log("Connecting to MongoDB...");
        await client.connect();
        console.log("Successfully connected to MongoDB!");
        
        // Pick a db
        const db = client.db("Caryakrama");
        const collections = await db.collections();
        console.log("Collections:", collections.map(c => c.collectionName));
    } catch (e) {
        console.error("Connection failed:", e);
    } finally {
        await client.close();
        console.log("Client closed.");
    }
}

main().catch(console.error);
