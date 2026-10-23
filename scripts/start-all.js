/**
 * StudySync AI Educational Suite - Multi-Service Orchestrator
 * Launches:
 * 1. Suite Index Hub (Port 3000)
 * 2. StudySync AI Smart Study Planner (Port 5000)
 * 3. StudySync AI Interactive Classroom (Port 5001)
 */

const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const plannerDir = path.join(rootDir, 'StudySync-AI_Smart_Study_Planner');
const classroomDir = path.join(rootDir, 'StudySync-AI_Interactive_Classroom');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

function startProcess(name, cmd, args, cwd, colorCode) {
  console.log(`\x1b[${colorCode}m[${name}] Launching in ${cwd}...\x1b[0m`);
  const proc = spawn(cmd, args, {
    cwd,
    stdio: 'pipe',
    shell: true,
    env: { ...process.env }
  });

  proc.stdout.on('data', (data) => {
    process.stdout.write(`\x1b[${colorCode}m[${name}]\x1b[0m ${data}`);
  });

  proc.stderr.on('data', (data) => {
    process.stderr.write(`\x1b[${colorCode}m[${name} ERR]\x1b[0m ${data}`);
  });

  proc.on('close', (code) => {
    console.log(`\x1b[${colorCode}m[${name}] Exited with code ${code}\x1b[0m`);
  });

  return proc;
}

console.log('======================================================================');
console.log('🚀 Starting Full StudySync AI Educational Suite (Hub + Planner + Classroom)');
console.log('======================================================================');

// 1. Suite Hub
const hubProc = startProcess('SUITE-HUB', 'node', ['server/index.js'], rootDir, '36'); // Cyan

// 2. Planner
const plannerProc = startProcess('PLANNER-5000', npmCmd, ['start'], plannerDir, '32'); // Green

// 3. Classroom
const classroomProc = startProcess('CLASSROOM-5001', npmCmd, ['start'], classroomDir, '35'); // Magenta

function shutdown() {
  console.log('\nShutting down all StudySync Suite services...');
  hubProc.kill();
  plannerProc.kill();
  classroomProc.kill();
  process.exit();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
