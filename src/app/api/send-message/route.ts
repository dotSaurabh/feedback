import UserModel from "@/model/User.model";
import dbconnect from "@/lib/dbconnect";
import { Message } from "@/model/User.model";

export async function POST(request: Response) {
  await dbconnect();
  
  // getting the username and content from the frontend  
  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne(username);
    if (!user) {
      console.log("user not found");
      return Response.json(
        {
          success: false,
          message: "user not found ",
        },
        {
          status: 501,
        }
      );
    }
    
    // checking the wether is accepting the message or not 
    if (!user.isAcceptingMessage) {
      console.log("user is not accepting message ");
      return Response.json(
        {
          success: false,
          message: "user is not accepting message ",
        },
        {
          status: 501,
        }
      );
    }

    // making new message
    const newMessage = { content, createdAt: new Date() };

    //pushing the new message
    user.message.push(newMessage as Message);

    //saving the it in the db
    await user.save();

    return Response.json(
      {
        success: true,
        message: "message sent ",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("error while sending the message");
    return Response.json(
      {
        success: false,
        message: "error while sending the message ",
      },
      {
        status: 501,
      }
    );
  }
}
