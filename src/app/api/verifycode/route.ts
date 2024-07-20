import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/User.model";



export async function POST(request : Request){
    await dbconnect()

    try {

        const {username , code } = await request.json()  // getting the username and verify code 
         const userByurl = decodeURIComponent(username)  // decoded the url before using in the db 
        const user = await UserModel.findOne({username : userByurl})
         
        if(!user){
            return Response.json(
                {
                    success : false,
                    message : 'User not found'
                },
                {
                    status : 500
                }
            )

        }

        const isCodeValid = user.verifyCode === code  //checking for the verfication code 
        const isCodeVaildExpiry = user.verifyCodeExpire > new Date() //checking the expiry code

        if (isCodeValid && isCodeVaildExpiry) {
            // Update the user's verification status
            user.isVerifed = true;
            await user.save();
      
            return Response.json(
              { success: true, message: 'Account verified successfully' },
              { status: 200 }
            );
          } else if (!isCodeVaildExpiry) {
            // Code has expired
            return Response.json(
              {
                success: false,
                message:
                  'Verification code has expired. Please sign up again to get a new code.',
              },
              { status: 400 }
            );
          } else {
            // Code is incorrect
            return Response.json(
              { success: false, message: 'Incorrect verification code' },
              { status: 400 }
            );
          }
        
    } catch (error) {
        console.log('error whiile verifying the user ');
        return Response.json(
            {
                success : false,
                message : 'Error while  veriftying the user'
            },
            {
                status : 500
            }
        )
    }
}