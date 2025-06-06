import winston from "winston";
import dotenv from "dotenv"

dotenv.config()

const levels = {
    fatal:0,
    error:1,
    warn:2,
    info:3,
    http:4
}

const colors = {
    fatal:"red",
    error:"orange",
    warn:"yellow",
    info:"blue",
    http:"green"
}

const loggerDev = winston.createLogger({
    levels:levels,
    transports:[
        new winston.transports.Console({
            level:"http",
            format:winston.format.combine(
                winston.format.colorize(colors),
                winston.format.simple()
            )
            
        })
    ]
})


const loggerProd = winston.createLogger({
    levels:levels,
    transports:[
        new winston.transports.Console({
            level:"http",
            format:winston.format.combine(
                winston.format.colorize(colors),
                winston.format.simple()
            )
            
        }),
        new winston.transports.File({
            filename:"error.log",
            level:"error",
            format:winston.format.simple()
            
        })
    ]
})

export const logger = process.env.MODE === "prod" ? loggerProd : loggerDev