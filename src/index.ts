import { Elysia } from "elysia";

/*
*** Interface models
*/
import { InitPaymentData, GetCard, TrxMicroservice, ResponseMicroservice} from './/Models/PaymentControllerModels';
import { InitSessionFetchRequestData } from './Models/SessionControllerModels';
import { Auth, Signup, MerchantByUID, InitSessionDataRequest } from "./Models/MerchantControllerModels";
import { Callback, ResponseSberBankRUB, SberBankRubBody } from "../src/Models/MicroControllerModels";

/*
*** Controllers
*/
import { BacksController } from "./Controllers/BanksController";
import {SessionController} from '../src/Controllers/SessionController';
import {MerchantController} from '../src/Controllers/MerchantController';
import { PaymentController } from '../src/Controllers/PaymentController';
import { MicroController } from '../src/Controllers/MicroController';
import { AddUser, AdminAuth, DeleteUser, GetAllUsers, UpdateUser, VerifyAuthToken } from "./Models/AdminCRUDControllerModels";
import AdminCRUDController from "./Controllers/AdminCRUDController";
import AdminAuthController from "./Controllers/AdminAuthController";
import AdminCardController from "./Controllers/AdminCardController";
import { RequestGETCard } from "./Models/AdminCardControllerModel";
import AdminBanksController from "./Controllers/AdminBanksController";
import { RequestGETBanks, UpdateBank } from "./Models/AdminBanksControllerModel";
import { UpdateCard } from "./Models/AdminCardControllerModels";


const app = new Elysia()

/*
*** index page
*/
app.get("/", () => "No correct parameters :(");

app.get("/test", async ({query}: {query: MerchantByUID}) => query);

/*
*** Merchant sinnup | auth  
*/
app.get('/api/merchant/', async ({query}: {query: MerchantByUID}) => await MerchantController.getMerchantByUID(query));

app.post('/api/merchant/auth', async ({body} : {body: Auth}) => await MerchantController.auth(body));

app.post('/api/merchant/signup', async ({body}: {body: Signup}) => await MerchantController.signup(body));

/*
*** Payment actions
*/
app.post('/api/payment/init', async ({body}: {body: InitPaymentData}) => await PaymentController.init(body));

app.post('/api/payment/getcard', async ({body}: {body: GetCard}) => await PaymentController.getCard(body));

app.post('/api/payment/checkpay', async ({body}: {body: {session_uid: string}}) => await PaymentController.checkPay(body))

app.post('/api/payment/trxmicroservice', ({body}: {body: TrxMicroservice}) => PaymentController.getTrxMicroservice(body));

app.post('/api/payment/responsemicroservice', ({body}: {body:  ResponseMicroservice}) => PaymentController.getResponseMicroservice(body));

/*
*** Admin CRUD
*/
app.post('/api/admin/create_user', async ({body}: {body: AddUser}) => await AdminCRUDController.create_user(body));

app.post('/api/admin/delete_user', async ({body}: {body: DeleteUser}) => await AdminCRUDController.delete_user(body));

app.post('/api/admin/update_user', async ({body}: {body: UpdateUser}) => await AdminCRUDController.update_user(body));

app.post('/api/admin/get_all_users', async ({body}: {body: GetAllUsers}) => await AdminCRUDController.get_all_user(body));

/*
*** Admin auth
*/
app.post('/api/admin/auth', async ({body}: {body: AdminAuth}) => await AdminAuthController.auth(body));

app.post('/api/admin/verify', async ({body}: {body: VerifyAuthToken}) => await AdminAuthController.verify_auth(body));

/*
*** Admin get data for administration
*/

app.post('/api/admin/get_cards', async ({body}: {body: RequestGETCard}) => await AdminCardController.get(body));

app.post('/api/admin/update_card', async ({body}: {body: UpdateCard}) => await AdminCardController.update(body));

app.post('/api/admin/get_banks', async ({body}: {body: RequestGETBanks}) => await AdminBanksController.get(body));

app.post('/api/admin/update_banks', async ({body}: {body: UpdateBank}) => await AdminBanksController.update(body));



/*
*** Get all active banks
*/
app.post('/api/banks', async ({body}: {body: {session_uid: string}}) => await BacksController.banks(body));

/*
*** Session create | verify
*/
app.post('/api/session/create', async ({body}: {body: InitSessionDataRequest}) => await SessionController.CreateSession(body));

app.post('/api/session/verify', async ({body} : {body: InitSessionFetchRequestData}) => await SessionController.VerifySession(body));

/*
*** Microservice response
*/
app.post('/api/micro/sberbankrub', ({body}: {body: SberBankRubBody}) => MicroController.sberbankrub(body));



/*
*** Start app listen port 
*/
app.listen(process.env.BACKEND_PORT || 5000);

console.log( `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);





/* 
*

https://www.dmosk.ru/miniinstruktions.php?mini=postgresql-users
https://stackoverflow.com/questions/18664074/getting-error-peer-authentication-failed-for-user-postgres-when-trying-to-ge


*******************************************************************************

all doc http://repo.postgrespro.ru/doc//pgsql/17.2/ru/postgres-A4.pdf



******************************************************************************
******************************************************************************
******************************************************************************

sudo -u postgres psql

CREATE USER dmosk WITH PASSWORD 'myPassword';

GRANT ALL PRIVILEGES ON DATABASE "database1" to dmosk;

\c database1

database1=# GRANT pg_read_all_data TO dmosk;

database1=# GRANT pg_write_all_data TO dmosk;

ALTER DATABASE database1 OWNER TO dmosk;

SELECT current_setting('hba_file');

\q

chage user

psql -d <db-name> -U <username> -W
change in pg_hba.conf
if (Peer authentication failed for user "user")
--- host    all      all     127.0.0.1/32   md5

systemctl restart postgresql

psql -U dmosk -d database1 -h 127.0.0.1

******************************************************************************
******************************************************************************
******************************************************************************


* Comands 

\l - show databases
\du - show users
\dn - show all schemas

CREATE SCHEMA schema_name

\dt {name_schema}.* all 



\? list all the commands
\l list databases
\c onninfo display information about current connection
\c [DBNAME] connect to new database, e.g., \c template1
\dt list tables of the public schema
\dt <schema-name>.* list tables of certain schema, e.g., \dt public.*
\dt *.* list tables of all schemas

*/
