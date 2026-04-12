import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('\x1b[36m%s\x1b[0m', '[Aurnem Dynamics] INICIANDO SISTEMAS COMBINADOS...');

// 1. Iniciar Backend Core
const server = spawn('node', ['--env-file=.env', 'server.js'], {
  stdio: 'inherit',
  shell: true
});

server.on('error', (err) => {
  console.error('\x1b[31m%s\x1b[0m', '[ERROR] Fallo al iniciar el servidor backend:', err);
});

// 2. Iniciar Frontend Vite (con un pequeño delay para que el backend esté listo)
setTimeout(() => {
  console.log('\x1b[36m%s\x1b[0m', '[Aurnem Dynamics] INICIANDO INTERFAZ VITE...');
  const vite = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });

  vite.on('error', (err) => {
    console.error('\x1b[31m%s\x1b[0m', '[ERROR] Fallo al iniciar Vite:', err);
  });

  vite.on('close', (code) => {
    console.log(`[Aurnem Dynamics] Interfaz Vite cerrada con código ${code}`);
    server.kill();
    process.exit();
  });
}, 2000);

process.on('SIGINT', () => {
  server.kill();
  process.exit();
});
