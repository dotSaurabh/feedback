import mongoose from "mongoose";

// interface for the database connection 
type ConnectionObject = {
    isConnected?: number     // when connected it return the number 
} 

const connection : ConnectionObject = {}  

async function dbconnect():Promise<void> {
    if(connection.isConnected){
        console.log('already connected ');
        return
        
    }
    try {
       const db = await mongoose.connect(process.env.MONGODB_URI || '', {} ) 
       connection.isConnected = db.connections[0].readyState
       console.log("Db is connected successfully");
        
    } catch (error) {
        console.log('database connection is failed ', error);
        
        process.exit(1)
    }
}


export default dbconnect;