import mongoose from "mongoose";

export default async function connect() {
    try{
        mongoose.connect(process.env.MONGODB_URL!);
        const connection = mongoose.connection;
        
        connection.on("connection", ()=> {
            console.log("connected succesfully to DB");
        })

        connection.on("error", () => {
            console.log("Error occuered after connecting to DB");
        })
    }catch(error){
        console.log("Error while connecting to DB");
        console.log(error);
    }
}