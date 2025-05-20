// lib/db.ts
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEON_INVOICES_DATABASE_URL!);

export default sql;
