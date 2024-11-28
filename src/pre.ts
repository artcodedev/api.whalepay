import { Currency } from "@prisma/client";

import jsonwebtoken from "jsonwebtoken";
import {SecretKey} from '../src/Secure/SeckretKey'




(async () => {

    const js = {

        merchant_uid: "18a1772c-e13f-4c51-9439-30f6b7704c12", 
        secret_key: "$2b$04$n3noeHzFau85HDp4kXIuvuC5e8/hq3l2uM9DIqteqAIrm2Ker4Cmy",
        amount: 10,
        currency: "RUB",
        domain: "pisun",
        callback: "call",
        description: "some",
        metadata: "data"

        // merchant_uid: "18a1772c-e13f-4c51-9439-30f6b7704c12",
        // secret_key: "$2b$04$n3noeHzFau85HDp4kXIuvuC5e8/hq3l2uM9DIqteqAIrm2Ker4Cmy",
        // amount: 10,
        // currency: "RUB",
        // domain: "some.com",
        // callback: "user.pph",
        // description: "des111",
        // metadata: 'metadata111'
    }


    const data = jsonwebtoken.sign(js, SecretKey.secret_key, { expiresIn: "24h" });

    // console.log(data);

    const response = await fetch("localhost:5000/session", {
        method: "POST",
        body: JSON.stringify({token: data + "778"}),
        headers: { "Content-Type": "application/json" },
    });
    const html = await response.json();

    console.log(html)

})();




/*



{
  id: 10,
  uid: "18a1772c-e13f-4c51-9439-30f6b7704c12",
  name: "user1",
  login: "user1login11111",
  password: "$2b$15$w3MbCM2kUgvDnmeRHcsH2.wvs2tol.QpzSQMIAgUZPsdEWv6.TEDu",
  phone: "+79999999999",
  email: "user1@gmail.com",
  secret_key: "$2b$04$n3noeHzFau85HDp4kXIuvuC5e8/hq3l2uM9DIqteqAIrm2Ker4Cmy",
  created_at: "1732768421381",
}


{
  status: 20,
  message: "Merchant successfully created",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxOGExNzcyYy1lMTNmLTRjNTEtOTQzOS0zMGY2Yjc3MDRjMTIiLCJlbWFpbCI6InVzZXIxQGdtYWlsLmNvbSIsImxvZ2luIjoidXNlcjFsb2dpbjExMTExIiwicGhvbmUiOiIrNzk5OTk5OTk5OTkiLCJuYW1lIjoidXNlcjEiLCJzZWNyZXRfa2V5IjoiJDJiJDA0JG4zbm9lSHpGYXU4NUhEcDRrWEl1dnVDNWU4L2hxM2wydU05RElxdGVxQUlybTJLZXI0Q215IiwiaWF0IjoxNzMyNzY4NDIxLCJleHAiOjE3MzI4NTQ4MjF9.eX8EEjAtvZrpPQqsC0nPc_zehZ0_DFS_9uAcgxl2VlQ",
}




*/