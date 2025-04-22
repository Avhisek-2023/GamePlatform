import cors from 'cors';
import express from 'express';
import cookieParser from "cookie-parser";


function appMiddleware(app){
    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());
}

export default appMiddleware;