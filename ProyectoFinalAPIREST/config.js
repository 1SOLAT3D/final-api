import {config} from 'dotenv'

config();

export const MYSQLHOST = process.env.MYSQLHOST || "localhost";
export const MYSQLUSER = process.env.MYSQLUSER || "root";
export const MYSQLPASSWORD = process.env.MYSQLPASSWORD || "";
export const MYSQLDATABASE = process.env.MYSQLDATABASE || "lec2023";
export const MYSQLPORT = process.env.MYSQLPORT || 8080;