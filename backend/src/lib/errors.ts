import { Socket } from "socket.io";

export class CustomError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CustomError';
    }
}

export const handleError = (error:any, socket:Socket)=>{
    if(error instanceof CustomError){
        socket.emit('error', error.message);
    }else{
        socket.emit('error', 'An error occurred');
    }
    console.log(error)
}