import { Message } from "@/model/User.model"


export interface ApiResponse{
    success : boolean,
    message : string,
    isAccessptingMessage?:boolean,
    messages?:Array<Message>
}