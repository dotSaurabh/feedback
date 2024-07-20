import dbconnect from "@/lib/dbconnect"; // database
import UserModel from "@/model/User.model"; // model of User in database
import bcrypt from "bcryptjs"; // encryption for password saving in the database
import { sendVerificationEmail } from "@/helper/sendVerificationEmail"; // email to user when registered

console.log(process.env.NEXTAUTH_SECRET);
export async function POST(request: Request) {
  await dbconnect(); // because it is edge we have to check wether it is connected or not

try {
    const { username, email, password } = await request.json(); // destructing the data from user

    const userByUsername = await UserModel.findOne({
      username,
      isVerifed: true,
    });
    console.log(userByUsername);
    
    if (userByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 400 }
      );
    }

    const userByEmail = await UserModel.findOne({ email });
    // console.log('step 1 ' ,userByEmail);
    
    let verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    console.log('the verifcatin code is ',verificationCode);
    
    if (userByEmail) {
      if (userByEmail.isVerifed) {
        // checking wether is verifed after email has been found in the db
        // if it found then it is already exit so user should use login
        // console.log('step2 here the user is verified by email');
        
        return Response.json(
          {
            success: false,
            message: "User already exit with this email  ",
          },
          {
            status: 400,
          }
        );
      } else {
        // if user is not verifed then may be password is changed 
        // console.log('step 3 not vereifed');
        
        const hasedPassword = await bcrypt.hash(password, 10);
        //  console.log('step 4 hased password ',hasedPassword);
        userByEmail.password = hasedPassword
        userByEmail.verifyCode = verificationCode
        userByEmail.verifyCodeExpire = new Date(Date.now()+3600000)
        // console.log('step last before updafe !!!!!!');
        
        await userByEmail.save()
      }
    } else {
      // hashing the password before saving
      // console.log('step 5 not vereifed');
      const hasedPassword = await bcrypt.hash(password, 10);
      // console.log('step 6 hased password ',hasedPassword);
      
      // verifyCodeExpiry date
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hasedPassword,
        isVerifed: false,
        verifyCode: verificationCode,
        verifyCodeExpire: expiryDate,
        isAcceptingMessage: false,
        message: [],
      });

      await newUser.save();
    }

    //email verification

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verificationCode
    );
     
    console.log(emailResponse);
    
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "user created successfully ",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while creating the User");
    return Response.json(
      {
        success: false,
        message: "error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
