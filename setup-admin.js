#!/usr/bin/env node

/**
 * Admin Setup Helper Script
 * 
 * This script helps you quickly set up admin access in Supabase.
 * 
 * Usage:
 *   node setup-admin.js
 * 
 * Or with npm:
 *   npm run setup-admin
 */

import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
};

async function main() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║      ADMIN SETUP HELPER SCRIPT         ║');
  console.log('╚════════════════════════════════════════╝\n');

  // Get Supabase credentials
  const supabaseUrl = process.env.VITE_SUPABASE_URL || (await question('Enter Supabase URL: '));
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || (await question('Enter Supabase Service Role Key: '));

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Supabase credentials not provided');
    console.log('   Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables');
    process.exit(1);
  }

  // Initialize Supabase admin client
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('✓ Connected to Supabase\n');

  // Fetch all auth users
  console.log('Fetching users from Supabase Auth...');
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

  if (usersError) {
    console.error('❌ Error fetching users:', usersError.message);
    process.exit(1);
  }

  if (!users || users.length === 0) {
    console.error('❌ No users found in Supabase Auth');
    console.log('   Create at least one user first via Supabase Dashboard');
    process.exit(1);
  }

  // Display users
  console.log(`\nFound ${users.length} user(s):\n`);
  users.forEach((user, index) => {
    console.log(`  ${index + 1}. ${user.email} (${user.id})`);
  });

  // Ask which user to make admin
  const userIndex = parseInt(await question('\nEnter number of user to make admin: '), 10) - 1;

  if (isNaN(userIndex) || userIndex < 0 || userIndex >= users.length) {
    console.error('❌ Invalid selection');
    process.exit(1);
  }

  const selectedUser = users[userIndex];
  console.log(`\n→ Selected: ${selectedUser.email} (${selectedUser.id})`);

  // Assign admin role
  const { error: insertError } = await supabase
    .from('user_roles')
    .upsert(
      { user_id: selectedUser.id, role: 'admin' },
      { onConflict: 'user_id,role' }
    );

  if (insertError) {
    console.error('❌ Error assigning admin role:', insertError.message);
    process.exit(1);
  }

  console.log('✓ Admin role assigned successfully!\n');

  // Verify
  const { data: roleData, error: verifyError } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', selectedUser.id)
    .eq('role', 'admin');

  if (verifyError) {
    console.error('⚠ Could not verify:', verifyError.message);
  } else if (roleData && roleData.length > 0) {
    console.log('✓ Verification successful - admin role is active\n');
    console.log('Next steps:');
    console.log(`  1. Log in with email: ${selectedUser.email}`);
    console.log('  2. Go to /admin-login on your app');
    console.log('  3. You should now have access to the Admin Panel\n');
  }

  rl.close();
}

main().catch(console.error);
