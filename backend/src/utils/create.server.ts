import express, { urlencoded } from 'express';
import cors from 'cors';
import { authRoutes } from '../routes/auth.routes';
import { ErrorMiddleware } from '../middleware/error.middleware';
import { businessRoutes } from '../routes/business.routes';
import { clientRoutes } from '../routes/client.routes';
import { invoiceItemRoutes } from '../routes/invoice-item.routes';
import { invoiceRoutes } from '../routes/invoice.routes';
import { paymentRoutes } from '../routes/payment.routes';
import { uploadRoutes } from '../routes/upload.routes';


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
    app.use("/api/clients", clientRoutes);
    app.use("/api/invoices", invoiceRoutes);
    app.use("/api/invoice-items", invoiceItemRoutes);
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
