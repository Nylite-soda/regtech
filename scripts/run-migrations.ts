import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  try {
    console.log('Starting migrations...');
    
    // Read all SQL files from the migrations directory
    const migrationsDir = join(process.cwd(), 'supabase', 'migrations');
    const files = readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Ensure migrations run in alphabetical order

    for (const file of files) {
      console.log(`Running migration: ${file}`);
      const sql = readFileSync(join(migrationsDir, file), 'utf8');
      
      // Split SQL into individual statements
      const statements = sql
        .split(';')
        .map(statement => statement.trim())
        .filter(statement => statement.length > 0);

      // Execute each statement
      for (const statement of statements) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.error(`Error executing statement in ${file}:`, error);
          throw error;
        }
      }
    }

    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations(); 