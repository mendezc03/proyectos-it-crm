#!/bin/bash
echo "Iniciando Proyectos-IT CRM..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20 > /dev/null 2>&1
cd "$(dirname "$0")"
echo "Usando Node.js: $(node -v)"
echo "Iniciando servidor en http://localhost:3000"
echo ""
npm run dev
