import {z} from 'zod'


export const messageSchema = z.object({
    content : z
    .string()
    .min(10 , {message: ' Content should be more than 10 character'})
    .max(300 , {message: ' Content should be less than 300 character'}),
})