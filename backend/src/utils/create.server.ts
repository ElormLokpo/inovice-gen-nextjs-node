import express, { urlencoded } from 'express';
import cors from 'cors';

import { ErrorMiddleware } from '../middleware';
import {authRoutes,invoiceRoutes, uploadRoutes, businessRoutes, paymentRoutes} from '../routes';

export const CreateServer = ()=>{
    const app:express.Application = express();

    app.use(express.json())
    app.use(urlencoded({extended:true}))
    app.use(cors({
        origin:process.env.FRONTEND_URL ?? "http://localhost:3000",
        methods:["GET","POST","PUT","DELETE"],
        credentials:true
    }))

    app.get("/health", (_req, res) => {
        res.status(200).json({ success: true, message: "ok" });
    })

    app.use("/api/auth", authRoutes);
    app.use("/api/businesses", businessRoutes);
    app.use("/api/invoices", invoiceRoutes);
    app.use("/api/payments", paymentRoutes);
    app.use("/api/uploads", uploadRoutes);

    app.use(ErrorMiddleware)

    
    app.listen(process.env.PORT,(error:any)=>{
        if(error){
            console.log(error);
            process.exit(1);
        }
        console.log(`Server is running on port ${process.env.PORT}`)
    })

    return app;

    
}
