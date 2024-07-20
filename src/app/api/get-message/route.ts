import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { Session } from "next-auth";
import mongoose from "mongoose";

export async function GET(request : Request){
    await dbconnect()

    const session : Session | null = await getServerSession(authOptions)
    const user:User = await session?.user 
    
    if(!session || !session.user){
        console.log('user not found ');
        return Response.json({
           success : false ,
           message: 'user not found'
        })
    }
    
    // getting the user id in number because it return in string and we can't use in aggreation because in aggrestion moongoose donot work 
    const userId  = new mongoose.Types.ObjectId(user._id) 

    try {
        const user = await UserModel.aggregate([
            {$match : {_id: userId}},
            {$unwind: '$message'},
            {$sort : {'message.createAt': -1}},
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },
        ])
        
        if (!user || user.length === 0) {
            return Response.json(
              { message: 'User not found', success: false },
              { status: 404 }
            );
          }

          
          //if user is found 
          return Response.json(
            { messages: user[0].messages },
            {
              status: 200,
            }
          );
    } catch (error) {
        console.log('something went wrong while getting message');
        return Response.json({
            success : false ,
            message: 'something went wrong while getting message'
        },{
            status : 500
        })
        
    }

}