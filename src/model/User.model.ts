import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  _id : string;  //change it we getting issue 
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpire: Date;
  isVerifed : boolean;
  isAcceptingMessage: boolean;
  message: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "username is required "],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required : [true , 'email is required '],
    unique : true,
    match :/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})$/,
    message: 'Invalid email format',
  },
  password : {
    type : String,
    required : [true , 'password is required'],
    
  },
  verifyCode : {
    type : String,
    required : [true , 'verifyCode is required'],
  },
  verifyCodeExpire: {
    type: Date,
    required : [true , 'verify Code expiry is required'],
  },
  isVerifed : {
    type : Boolean,
    default: false
  },
  isAcceptingMessage : {
      type : Boolean,
      default: false
  },
  message : [MessageSchema]

});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User',UserSchema)

export default UserModel