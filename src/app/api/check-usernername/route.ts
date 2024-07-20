import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation, // checking the username according the username validation in schemas
});

export async function GET(request: Request) {
  await dbconnect();
  try {
    const { searchParams } = new URL(request.url);  // fetching the username from param in the url 
    const queryParam = { username: searchParams.get("username") };
    console.log('step 1 ',queryParam);
    
    //validate with zod

    const result = usernameQuerySchema.safeParse(queryParam); // checking the validation with zod 
    console.log('step 2 ',result);

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:usernameError+"invalid query paramter" ,
        },
        {
          status: 400,
        }
      );
    }

     const {username} = result.data  // fetrching username from the result data 

     const existingVerifyUser = await UserModel.findOne({username :{ $regex: new RegExp(`^${username}$`, 'i') }  , isVerifed : true}) 
      
     // if fasle result 
     if(existingVerifyUser) return Response.json({success : false , message : "username already exist"},{status :400 })
    
    // if it doesnot exit 
    return Response.json({
        success : true,
        message : 'Username is unique'
    }, {
        status : 200
    })

  } catch (error) {
    console.error("error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
