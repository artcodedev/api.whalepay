import { Elysia } from "elysia";

import {SessionController} from '../src/Controllers/SessionController'
import { InitSessionData } from '../src/Models/SessionModels';

import {MerchantController} from '../src/Controllers/MerchantController';

import { Auth, AuthResponse, Signup, TrxList, MerchantByUID } from "../src/Models/MerchantController";
const app = new Elysia()


/*
*** index page
*/
app.get("/", () => "No correct parameters :(");

app.get("/test", async ({query}: {query: MerchantByUID}) => query);

/*
*** Merchant sinnup | auth  
*/
app.get('/merchant/', async ({query}: {query: MerchantByUID}) => await MerchantController.getMerchantByUID(query));
app.post('/merchant/auth', async ({body} : {body: Auth}) => await MerchantController.auth(body));
app.post('/merchant/signup', async ({body}: {body: Signup}) => await MerchantController.signup(body));


/*
*** Session create | verify
*/
app.post('/session', ({body: InitSessionData}: {body: InitSessionData}) => SessionController.CreateSession(InitSessionData));
app.post('/session/verify', () => {})

/*
*** Start app listen port 
*/
app.listen(process.env.BACKEND_PORT || 5000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);





/* 
*

https://www.dmosk.ru/miniinstruktions.php?mini=postgresql-users
https://stackoverflow.com/questions/18664074/getting-error-peer-authentication-failed-for-user-postgres-when-trying-to-ge


******************************************************************************

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





*/
