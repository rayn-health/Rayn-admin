import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFileSync, existsSync } from "fs";
function loadEnvLocal(){if(!existsSync('.env.local'))return;for(const line of readFileSync('.env.local','utf8').split('\n')){const m=line.match(/^([A-Z_]+)=(.*)$/);if(!m)continue;const [,k,v]=m;if(!process.env[k])process.env[k]=v.trim().replace(/^"|"$/g,'')}}
loadEnvLocal();
const email=process.argv[2]||process.env.ADMIN_EMAIL;
const {FIREBASE_PROJECT_ID,FIREBASE_CLIENT_EMAIL,FIREBASE_PRIVATE_KEY}=process.env;
if(!email||!FIREBASE_PROJECT_ID||!FIREBASE_CLIENT_EMAIL||!FIREBASE_PRIVATE_KEY){console.error('Missing admin email or Firebase Admin credentials.');process.exit(1)}
if(!getApps().length)initializeApp({credential:cert({projectId:FIREBASE_PROJECT_ID,clientEmail:FIREBASE_CLIENT_EMAIL,privateKey:FIREBASE_PRIVATE_KEY.replace(/\\n/g,'\n')})});
try{const user=await getAuth().getUserByEmail(email);await getAuth().setCustomUserClaims(user.uid,{admin:true});console.log(`Granted admin claim to ${email} (${user.uid})`)}catch(err){console.error(err);process.exit(1)}
