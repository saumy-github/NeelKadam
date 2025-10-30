#!/usr/bin/env node

/**
 * Verification script for blockchain microservice refactor
 * Checks that all refactor steps 1-4 have been completed correctly
 */

const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

let failCount = 0;

function pass(message) {
  console.log(`${GREEN}✓ PASS${RESET} ${message}`);
}

function fail(message) {
  console.log(`${RED}✗ FAIL${RESET} ${message}`);
  failCount++;
}

function info(message) {
  console.log(`${YELLOW}ℹ INFO${RESET} ${message}`);
}

function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    pass(`${description} exists: ${filePath}`);
    return true;
  } else {
    fail(`${description} is missing: ${filePath}`);
    return false;
  }
}

function checkFileAbsent(filePath, description) {
  if (!fs.existsSync(filePath)) {
    pass(`${description} is absent (as required): ${filePath}`);
    return true;
  } else {
    fail(`${description} should be absent but exists: ${filePath}`);
    return false;
  }
}

function checkDirExists(dirPath, description) {
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    pass(`${description} exists: ${dirPath}`);
    return true;
  } else {
    fail(`${description} is missing: ${dirPath}`);
    return false;
  }
}

function checkDirAbsent(dirPath, description) {
  if (!fs.existsSync(dirPath)) {
    pass(`${description} is absent (as required): ${dirPath}`);
    return true;
  } else {
    fail(`${description} should be absent but exists: ${dirPath}`);
    return false;
  }
}

console.log('\n=== Blockchain Microservice Refactor Verification ===\n');

const projectRoot = __dirname;
const backendDir = path.join(projectRoot, 'backend');
const blockchainDir = path.join(projectRoot, 'blockchain');

// ========== STEP 1: Check sibling folders ==========
info('Step 1: Checking project structure...');
checkDirExists(backendDir, 'backend/ folder');
checkDirExists(blockchainDir, 'blockchain/ folder');

// ========== STEP 2: Blockchain folder checks ==========
info('\nStep 2: Checking blockchain/ folder...');

// 2.1 Check blockchain/package.json
const blockchainPkgPath = path.join(blockchainDir, 'package.json');
if (checkFileExists(blockchainPkgPath, 'blockchain/package.json')) {
  try {
    const blockchainPkg = JSON.parse(fs.readFileSync(blockchainPkgPath, 'utf8'));
    if (blockchainPkg.name === 'neel-kadam-blockchain-service') {
      pass('blockchain/package.json name is "neel-kadam-blockchain-service"');
    } else {
      fail(`blockchain/package.json name is "${blockchainPkg.name}", expected "neel-kadam-blockchain-service"`);
    }
    
    if (blockchainPkg.scripts && blockchainPkg.scripts.start) {
      pass('blockchain/package.json has "start" script');
    } else {
      fail('blockchain/package.json is missing "start" script');
    }
  } catch (error) {
    fail(`blockchain/package.json is invalid JSON: ${error.message}`);
  }
}

// 2.2 Check blockchain/server.js
checkFileExists(path.join(blockchainDir, 'server.js'), 'blockchain/server.js');

// 2.3 Check blockchain/.env.example
const blockchainEnvExamplePath = path.join(blockchainDir, '.env.example');
if (checkFileExists(blockchainEnvExamplePath, 'blockchain/.env.example')) {
  const envContent = fs.readFileSync(blockchainEnvExamplePath, 'utf8');
  const requiredKeys = ['PORT', 'PROVIDER_URL', 'CONTRACT_ADDRESS', 'ADMIN_PRIVATE_KEY'];
  let allKeysPresent = true;
  
  for (const key of requiredKeys) {
    if (envContent.includes(key)) {
      pass(`blockchain/.env.example contains ${key}`);
    } else {
      fail(`blockchain/.env.example is missing ${key}`);
      allKeysPresent = false;
    }
  }
}

// 2.4 Check blockchain/scripts/ folder and required files
const blockchainScriptsDir = path.join(blockchainDir, 'scripts');
if (checkDirExists(blockchainScriptsDir, 'blockchain/scripts/ folder')) {
  checkFileExists(path.join(blockchainScriptsDir, 'checkProvider.js'), 'blockchain/scripts/checkProvider.js');
  checkFileExists(path.join(blockchainScriptsDir, 'grantNCCR.js'), 'blockchain/scripts/grantNCCR.js');
}

// 2.5 Check blockchain/src/utils/blockchain.js
checkFileExists(
  path.join(blockchainDir, 'src', 'utils', 'blockchain.js'),
  'blockchain/src/utils/blockchain.js (moved from backend)'
);

// 2.6 Check NO middleware folder in blockchain
checkDirAbsent(
  path.join(blockchainDir, 'middleware'),
  'blockchain/middleware/ folder'
);

// ========== STEP 3: Backend folder checks ==========
info('\nStep 3: Checking backend/ folder...');

// 3.1 Check backend/scripts/ is absent
checkDirAbsent(path.join(backendDir, 'scripts'), 'backend/scripts/ folder');

// 3.2 Check backend/utils/blockchain.js is absent
checkFileAbsent(
  path.join(backendDir, 'utils', 'blockchain.js'),
  'backend/utils/blockchain.js'
);

// 3.3 Check backend/src/services/blockchain-client.js exists
checkFileExists(
  path.join(backendDir, 'src', 'services', 'blockchain-client.js'),
  'backend/src/services/blockchain-client.js'
);

// 3.4 Check backend/package.json
const backendPkgPath = path.join(backendDir, 'package.json');
if (checkFileExists(backendPkgPath, 'backend/package.json')) {
  try {
    const backendPkg = JSON.parse(fs.readFileSync(backendPkgPath, 'utf8'));
    
    // Check that ethers is NOT in dependencies
    if (!backendPkg.dependencies || !backendPkg.dependencies.ethers) {
      pass('backend/package.json does NOT list "ethers" in dependencies');
    } else {
      fail('backend/package.json still lists "ethers" in dependencies (should be removed)');
    }
    
    // Check that axios IS in dependencies
    if (backendPkg.dependencies && backendPkg.dependencies.axios) {
      pass('backend/package.json lists "axios" in dependencies');
    } else {
      fail('backend/package.json does NOT list "axios" in dependencies');
    }
    
    // Check for start script
    if (backendPkg.scripts && backendPkg.scripts.start) {
      pass('backend/package.json has "start" script');
    } else {
      fail('backend/package.json is missing "start" script');
    }
  } catch (error) {
    fail(`backend/package.json is invalid JSON: ${error.message}`);
  }
}

// ========== STEP 4: Final validation ==========
info('\nStep 4: Final validation...');

// Check both package.json files are valid JSON (already done above)
pass('Both package.json files have been validated');

// ========== Summary ==========
console.log('\n=== Verification Summary ===\n');

if (failCount === 0) {
  console.log(`${GREEN}✓ ALL CHECKS PASSED${RESET}`);
  console.log('All refactor steps have been completed successfully!\n');
  process.exit(0);
} else {
  console.log(`${RED}✗ ${failCount} CHECK(S) FAILED${RESET}`);
  console.log('Please address the failed checks and run verification again.\n');
  process.exit(1);
}
