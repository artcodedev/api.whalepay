import { Currency } from "@prisma/client";

import jsonwebtoken from "jsonwebtoken";
import { SecretKey } from '../src/Secure/SeckretKey'

import { fromString } from 'uuidv4'
import { password } from "bun";








// import { Prisma } from "../src/Utils/Prisma";



// (async () => {


//   const backs = await Prisma.client.banks.findMany();

//   console.log(backs)

//   const banks = await Prisma.client.banks.createMany({
//     data: [
//       {
//         title: "SBER BANK",
//         status: true,
//         uid: "111"
//       }, 
//       {
//         title: "ALFA BANK",
//         status: true,
//         uid: "222"
//       }
//     ]
//   });


// })()







/*
******************************************************************
create session payment
******************************************************************
*/
// (async () => {

//   const js = {

//     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI4ZjAyNDI4Ni1hYWRiLTU2OGQtYmI1Mi03ZDNiNzI2MjE2ZTciLCJpYXQiOjE3MzMxMzM2MDMsImV4cCI6MzQ2NjI2NzUwNn0.kSaz1aD87rQ3Ggt8jEvV3OkPuY-YTqOwCA-Pv_HJJzY",
//     data: {
//       merchant_uid: "8f024286-aadb-568d-bb52-7d3b726216e7",
//       amount: 10,
//       currency: "RUB",
//       domain: "pisun",
//       callback: "call",
//       description: "some",
//       metadata: "data"
//     }

//   }


//   const response = await fetch("localhost:5000/api/session/create", {

//     method: "POST",
//     body: JSON.stringify(js),
//     headers: { "Content-Type": "application/json" },
//   });
//   const html = await response.json();

//   console.log(html)

// })();






/*
******************************************************************
auth
******************************************************************
*/
// (async () => {

//   const js = {

//     login: "pisunlogin",
//     password: "posunpass"

//   }


//     const response = await fetch("localhost:5000/api/merchant/auth", {


//     method: "POST",
//     body: JSON.stringify(js),
//     headers: { "Content-Type": "application/json" },
//   });
//   const html = await response.json();

//   console.log(html)

// })();







/*
******************************************************************
signup
******************************************************************
*/
// (async () => {

//   const js = {

//     phone: "+8098098098",
//     email: "userpisun@gmail.com",
//     name: "OOO Pisun",
//     login: "pisunlogin",
//     password: "posunpass"

//   }

//   const secret_key = "$2b$04$6LMWcuftNGJPQQF0/mpifeY2XjIXA2yBSIamZmbrkYlrVUX9dTGWS";

//     const response = await fetch("localhost:5000/api/merchant/signup", {

//     method: "POST",
//     body: JSON.stringify(js),
//     headers: { "Content-Type": "application/json" },
//   });
//   const html = await response.json();

//   console.log(html)

// })();