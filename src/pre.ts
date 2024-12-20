import { Currency, Session } from "@prisma/client";

import jsonwebtoken from "jsonwebtoken";
import { SecretKey } from '../src/Secure/SeckretKey'

import { fromString } from 'uuidv4'
import { password } from "bun";
import { Token } from "./Utils/Token";









import { Prisma } from "../src/Utils/Prisma";



import { Fetch } from "./Utils/Fetch";






(async () => {


  const js = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI4ZjAyNDI4Ni1hYWRiLTU2OGQtYmI1Mi03ZDNiNzI2MjE2ZTciLCJpYXQiOjE3MzQ2NjM5NjYsImV4cCI6MzQ2OTMyODIzMn0.EzPSqqMFSM3DyOE-BMtBbPpHXOPKHm0lzoUnwyARhdY',

  }

  const fetch = await Fetch.request('http://localhost:5000/api/admin/get_banks', js);

  console.log(fetch);



  // const js = {
  //   token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI4ZjAyNDI4Ni1hYWRiLTU2OGQtYmI1Mi03ZDNiNzI2MjE2ZTciLCJpYXQiOjE3MzQ2NjM5NjYsImV4cCI6MzQ2OTMyODIzMn0.EzPSqqMFSM3DyOE-BMtBbPpHXOPKHm0lzoUnwyARhdY',
  //   login: 'loginsine1',
  // }

  // const fetch = await Fetch.request('http://localhost:5000/api/admin/delete', js);

  // console.log(fetch);

  // const js = {

  //   token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImxvZ2luc2luZTEiLCJpYXQiOjE3MzQ2ODA1NDcsImV4cCI6MTczNjQyNjAyNzU0N30.FgCmH-A3Hp4_xGdC0MxVKNHMTllS68_tM6iStl0U5gU'
  // }

  // const fetch = await Fetch.request('http://localhost:5000/api/admin/verify', js);

  // console.log(fetch);

  // const user = await Prisma.client.banks.findMany();

  // console.log(user)









  // const token: string = await Token.sign({ session_uid: "86112ae2-674b-51e2-9a97-1a1bfe6a37c1" }, SecretKey.secret_key_micro, 1000000000000000);

  // const token: boolean = await Token.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX3VpZCI6Ijg2MTEyYWUyLTY3NGItNTFlMi05YTk3LTFhMWJmZTZhMzdjMSIsImlhdCI6MTczMzkwMTQ2NSwiZXhwIjoxNzMzOTYxNDY1fQ.iAj9a_1rDVPVrHd7UKBnB4HwdbCJljAh4GEcwNVtkH0", SecretKey.secret_key_micro);

  // console.log(token)
  // const js = {
  //   token: token,
  //   login: 'DKLHDFKJDGFjkdfs',
  //   password: 'SOQANEMENYAITEPAROLblin!!00',
  //   amount: 10,
  //   timeout: Date.parse(new Date().toLocaleString("en-US", { timeZone: "Europe/Moscow" })) + 900000,
  //   trx: "bb88951a-7572-4099-bb7a-18e59e413c1f",
  //   session_uid: "86112ae2-674b-51e2-9a97-1a1bfe6a37c1"
  // }

  // const fetch = await Fetch.request('http://localhost:3006/micro/payments/sberbank_rub', js);

  // console.log(fetch);


  // const st = await Prisma.client.payment.findMany();

  // console.log(st)

  // const token: string = await Token.sign({session_uid: "86112ae2-674b-51e2-9a97-1a1bfe6a37c1"}, SecretKey.secret_key_micro, 10000000000);

  // const data: any = {
  //   status: 'EXITED',
  //   error: "",
  //   trx:'',
  //   session_uid: "86112ae2-674b-51e2-9a97-1a1bfe6a37c1",
  //   token: token,
  //   amount: 10,
  //   enrollment_time: Date.parse(new Date().toLocaleString("en-US", { timeZone: "Europe/Moscow" }))
  // }


  // const fetch = await Fetch.request('http://localhost:5000/api/micro/sberbankrub', data);

  //   const session = await Prisma.client.session.findFirst({
  //   where: {uid: "86112ae2-674b-51e2-9a97-1a1bfe6a37c1"},
  // })
  // console.log(session);


  // const session = await Prisma.client.session.update({
  //   where: {uid: "86112ae2-674b-51e2-9a97-1a1bfe6a37c1"},
  //   data: {status: "PENDING_PAY", paid: false, created_at: Date.parse(new Date().toLocaleString("en-US", {timeZone: "Europe/Moscow"})) + 900000}
  // })


  //   const token: string = jsonwebtoken.sign(

  //     {login: "PkGmjkYrK84Jdf6"},

  //     SecretKey.secret_key_micro,

  //     { expiresIn: Math.floor(Date.now() / 1000) + (5 * 60)}
  // );

  //   const js = {

  //     session_id: "1212122121",
  //     token: token,
  //     login: 'PkGmjkYrK84Jdf6',
  //     password: 'Supreme01sperman--F-F-f',
  //     txr: "12121212",
  //     amount: '1',
  //     timeout: 173207352054090900093,
  //     proxy: { login: '', pass: '', ip: '', port: '' }
  //   }

  //   const response = await Fetch.request("http://127.0.0.1:3005/micro/payments/sberbank_rub", js);

  //   console.log(response)

})();



(async () => {


  //   const objectMicroSberRUB = {
  //     session_uid: "adsdd",
  //     token: "sdsds",
  //     login: "sdsd",
  //     password: "dsdsdsdsd",
  //     trx: "23232322",
  //     amount: "2323232323232"
  // }

  // const sberbank_rub_trx: string =  'sberbank_rub_trx';

  // const request: { status: number } = await Fetch.request(`http://127.0.0.1:3006/micro/payments/sberbank_rub_trx`, objectMicroSberRUB);

  // console.log(request)

  // console.log(Date.parse(new Date().toLocaleString("en-US", {timeZone: "Europe/Moscow"})))

  // const javaScriptRelease = Date.parse('04 Dec 1995 00:12:00 GMT');

  // const session = await Prisma.client.session.update({
  //   where: {uid: "e8868fa0-d4fb-5f2d-9252-8cbde191c541"},
  //   data: {status: "PENDING_CARD"}

  //   // data: {status: "PROCESS"}
  //   // data: {status: "PENDING_PAY"}
  //   // data: {status: "ERROR"}
  //   // data: {status: "EXITED"}
  //   // data: {status: "SUCCESS"}
  // })


  // console.log(card)

  // const card = await Prisma.client.card.findMany()

  // console.log(card)

  // const carda = await Prisma.client.card.update({
  //   where: { id: 1 },
  //   data: { busy: false }
  // })

  // // console.log(card)

  // const st = await Prisma.client.payment.delete({
  //   where: {session_uid: "d2b24fd3-e21b-5af7-87cd-b99239dd4f8d"}
  // })

  // const card = await Prisma.client.payment.findMany()
  // console.log(card)

  // const session = await Prisma.client.payment.update({
  //   where: {session_uid: 'e8868fa0-d4fb-5f2d-9252-8cbde191c541'},
  //   data: {
  //     card_id: null
  //   }
  // });

  // console.log(session)

  // const banks = await Prisma.client.session.findMany();

  // console.log(banks)

})();



// (async () => {

//   const rt = await Prisma.client.card.create({
//     data: {
//       id: 1,
//     card_number: "2202208069490903",
//     card_login: "DFKodoisdf423",
//     card_password: "parolinemenyautsaAFAXA_!369",
//     card_phone: "+79841562811",
//     card_holder: " ",
//     card_receiver: "Денис Андреевич К.",
//     card_cvv: " ",
//     card_valid_thru: "10/20",
//     card_pin: " ",
//     card_secret: " ",
//     active: true,
//     busy: false,
//     balance: 0,
//     withdraw_avaliable: true,
//     bank_uid: '111'
//     }
//   })

//   console.log(rt)
// })();





// (async () => {



//   let trx: { trx: string }[] = await Prisma.client.$queryRaw`
//   SELECT trx FROM "Session"
//   JOIN "Payment" on "Session".uid = "Payment".session_uid
//   WHERE "Session".paid = false AND "Session".amount = ${10} AND "Payment".card_id = ${1 }
//   ORDER BY "Payment".id DESC
//   LIMIT 1;

// `;

// // console.log(trx);


// const session = await Prisma.client.payment.findMany();

// console.log(session);



//   const updateSesson: Session = await Prisma.client.session.update({
//     where: { uid: "0282cc9f-f971-52a9-9fa0-d7d76297e3b0" },
//     data: { status: "PROCESS" },
// });


// const tr = await Prisma.client.payment.delete({
//   where: {session_uid: "f7fb7208-2180-57e4-9dec-2466bd29a9c9"}
// });

// console.log(tr)

// const ses = await Prisma.client.session.update({
//   where: {}
// })

// const session = await Prisma.client.payment.findMany();

// const banks = await Prisma.client.banks.createMany({
//   data: [
//     {
//       title: "SBER BANK",
//       status: true,
//       uid: "111",
//       currency: "RUB",
//       currencySymbol: "₽"
//     },
//     {
//       title: "ALFA BANK",
//       status: true,
//       uid: "222",
//       currency: "RUB",
//       currencySymbol: "₽"
//     },
//     {
//       title: "ALFA BANK USD",
//       status: true,
//       uid: "333",
//       currency: "USD",
//       currencySymbol: "$"
//     }
//   ]
// });

// console.log(banks)

// const banks = await Prisma.client.banks.findMany();
// console.log(banks)


// })()







/*
******************************************************************
create session payment
******************************************************************
*/
// (async () => {

//   const js = {

//     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI4ZjAyNDI4Ni1hYWRiLTU2OGQtYmI1Mi03ZDNiNzI2MjE2ZTciLCJpYXQiOjE3MzM5MTAxODEsImV4cCI6MzQ2NzgyMDY2Mn0.w6ilNeyFbIBPggxlpW0s7FonYlbcV9qE34ULinUbHsE",
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

//   const response = await fetch("localhost:5000/api/merchant/auth", {

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

//     const response = await fetch("localhost:5000/api/merchant/signup", {

//     method: "POST",
//     body: JSON.stringify(js),
//     headers: { "Content-Type": "application/json" },
//   });
//   const html = await response.json();

//   console.log(html)

// })();