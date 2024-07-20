import UserModel from "@/model/User.model";
import dbconnect from "@/lib/dbconnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { Session } from "next-auth";

export async function POST(request: Request) {
  await dbconnect();

  // const session = await getServerSession(authOptions)
  // const user : User= session?.user
  const session: Session | null = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    console.log("not authenticated");
    return Response.json(
      {
        message: "not authenticated",
        success: false,
      },
      {
        status: 401,
      }
    );
  }

  const userId = user._id;
  const { acceptMessage } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessage },
      { new: true }
    );

    if (!updatedUser) {
      console.log("updated user failed ");
      return Response.json(
        {
          success: false,
          message: "updation  of user failed ",
        },
        {
          status: 401,
        }
      );
    }

    // when user successfully updated

    return Response.json(
      {
        success: true,
        message: "the user has been successfully updated ",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("failed to update the user status to accept the message ");
    return Response.json(
      {
        message: "failed to update the user status to accept the message",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: Request) {
  await dbconnect();

  // const session = await getServerSession(authOptions)
  // const user : User= session?.user
  const session: Session | null = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    console.log("not authenticated");
    return Response.json(
      {
        message: "not authenticated",
        success: false,
      },
      {
        status: 401,
      }
    );
  }

  try {
    const foundUser = await UserModel.findById(user._id);
    if (!foundUser) {
      console.log("user not found");
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 500,
        }
      );
    }

    // when user is found
    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error retrieving message acceptance status:");
    return Response.json(
      {
        message: "Error retrieving message acceptance status",
        success: false,
      },
      {
        status: 401,
      }
    );
  }
}
