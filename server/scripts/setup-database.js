const { supabase } = require('../lib/supabase');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    const migrationPath = path.join(__dirname, '../migrations/001_create_profiles_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('Executing migration...');
    
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.error('Error executing statement:', error);
        }
      }
    }

    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase();
