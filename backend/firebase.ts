import { initializeApp, applicationDefault, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from './service_account.json';

const app = initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});
const db = getFirestore();

export { db };