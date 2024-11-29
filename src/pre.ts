import { Currency } from "@prisma/client";

import jsonwebtoken from "jsonwebtoken";
import { SecretKey } from '../src/Secure/SeckretKey'

import { fromString } from 'uuidv4'
import { password } from "bun";

// console.log(fromString('the native web'));



// cdb63720-9628-5ef6-bbca-2e5ce6094f3c




(async () => {

  const js = {

    session_uid: "some"

    // token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI4ZjAyNDI4Ni1hYWRiLTU2OGQtYmI1Mi03ZDNiNzI2MjE2ZTciLCJpYXQiOjE3MzI4NzI5MzcsImV4cCI6MzQ2NTc0NjE3NH0.hIitVslYQIgmsVfmN_aIUoruE33sgAasoT8kAqstDRQ",
    // data: {
    //   merchant_uid: "8f024286-aadb-568d-bb52-7d3b726216e7",
    //   amount: 10,
    //   currency: "RUB",
    //   domain: "pisun",
    //   callback: "call",
    //   description: "some",
    //   metadata: "data"
    // }



    // merchant_uid: "18a1772c-e13f-4c51-9439-30f6b7704c12",
    // secret_key: "$2b$04$n3noeHzFau85HDp4kXIuvuC5e8/hq3l2uM9DIqteqAIrm2Ker4Cmy",
    // amount: 10,
    // currency: "RUB",
    // domain: "some.com",
    // callback: "user.pph",
    // description: "des111",
    // metadata: 'metadata111'

    // phone: "+8098098098",
    // email: "userpisun@gmail.com",
    // name: "OOO Pisun",
    // login: "pisunlogin",
    // password: "posunpass"
    // session: true

  }

  const secret_key = "$2b$04$6LMWcuftNGJPQQF0/mpifeY2XjIXA2yBSIamZmbrkYlrVUX9dTGWS";
  // const data = jsonwebtoken.sign(js, secret_key,  { expiresIn: "24h" });

  // console.log(data);

  // const response = await fetch("localhost:5000/api/session/create", {
    // const response = await fetch("localhost:5000/api/merchant/auth", {
    // const response = await fetch("localhost:5000/api/merchant/signup", {
  const response = await fetch("http://localhost:5000/api/session/verify", {

    method: "POST",
    body: JSON.stringify(js),
    headers: { "Content-Type": "application/json" },
  });
  const html = await response.json();

  console.log(html)

})();




/*

status: 200,
  data: {
    uid: "8f024286-aadb-568d-bb52-7d3b726216e7",
    secret_key: "$2b$04$ff2ioaBN0TjpW1wHiFEmU.OndttgaiX50kDQnfJXMLvZnvwBetOB2",
  },



  {
  status: 200,
  data: {
    session_uid: "f1a1a0d0-bf91-5d2f-9f23-b6137f3d3095",
    merchant_uid: "8f024286-aadb-568d-bb52-7d3b726216e7",
    status: "PROCESS",
    currency: "RUB",
    paid: false,
    amount: 10,
    created_at: "1732873432592",
    description: "some",
    metadata: "data",
    domain: "pisun",
    gateway: "http://127.0.0.1:3000/payment?session_uid=f1a1a0d0-bf91-5d2f-9f23-b6137f3d3095",
  },
}

*/



import { Prisma } from "../src/Utils/Prisma";



// (async () => {


//   const backs = await Prisma.client.merchant.findMany();

//     console.log(backs)



// })()