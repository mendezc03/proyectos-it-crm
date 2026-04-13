#!/usr/bin/env python3
import subprocess
import sys
import os

os.chdir('/home/mendez/Documentos/estructura empresas/proyectos-it-crm')

env = os.environ.copy()
env['NVM_DIR'] = '/home/mendez/.nvm'
env['PATH'] = f"/home/mendez/.nvm/versions/node/v20.20.2/bin:" + env['PATH']

proc = subprocess.Popen(
    ['node', 'node_modules/.bin/next', 'dev', '-p', '3000'],
    env=env,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT
)

print("Servidor iniciando...")
for line in iter(proc.stdout.readline, b''):
    print(line.decode(), end='')
    if b'Ready' in line:
        break

print("\nServidor listo. Presiona Ctrl+C para detener.")
proc.wait()
