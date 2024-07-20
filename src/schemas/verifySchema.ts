import {z} from 'zod'



export const verifySchema = z.object({
    code : z.string().length(6 , 'Verficiation code should be 6 digit')
})