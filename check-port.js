#!/usr/bin/env node

/**
 * Quick script to check what's using port 9912
 */

const { spawn } = require('child_process');

console.log('Checking what\'s using port 9912...\n');

// Check with lsof
const lsof = spawn('lsof', ['-i', ':9912']);

lsof.stdout.on('data', (data) => {
  console.log('Processes using port 9912:');
  console.log(data.toString());
});

lsof.stderr.on('data', (data) => {
  console.log('No processes found using port 9912');
});

lsof.on('close', (code) => {
  console.log('\n--- Alternative check with netstat ---');
  
  // Alternative check with netstat
  const netstat = spawn('netstat', ['-an']);
  let found = false;
  
  netstat.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.includes(':9912')) {
        if (!found) {
          console.log('Found port 9912 in netstat:');
          found = true;
        }
        console.log(line);
      }
    });
  });
  
  netstat.on('close', () => {
    if (!found) {
      console.log('Port 9912 not found in netstat output');
    }
    
    console.log('\n--- Trying to kill any var-dump-server processes ---');
    
    const pkill = spawn('pkill', ['-f', 'var-dump-server']);
    pkill.on('close', (code) => {
      if (code === 0) {
        console.log('Killed existing var-dump-server processes');
      } else {
        console.log('No var-dump-server processes found to kill');
      }
    });
  });
});