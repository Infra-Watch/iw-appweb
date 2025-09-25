#!/bin/bash
echo ''
echo "Criando configurações de inicialização da WEBDATAVIZ e BOBIA..."
echo ''
echo "Configure arquivo de configuração abaixo"
echo ''
read -p "Escolha o ambiente 1(producao) ou 2(desenvolvimento): " AMBIENTE
if [ $AMBIENTE = 1 ]; then ENV='.env' AMBIENTE='producao'
elif [ $AMBIENTE = 2 ]; then ENV='.env.dev' AMBIENTE='desenvolvimento'
else echo 'Erro na escolha do ambiente'; exit
fi
echo ''
echo 'Configurações de conexão com o banco de dados'
read -p "Insira o database server host: " HOST_BD
read -p "Insira a porta do database server: " PORTA_BD
read -p "Insira o database server user: " USER
read -s -p "Insira a senha do user $USER: " SENHA
echo ''
read -p "Insira o database: " DATABASE
echo ''
echo 'Configurações do servidor de aplicação'
read -p "Insira a porta a ser tomada pela api: " PORTA_API
read -p "Insira o host da porta da api: " HOST_API
echo ''
echo 'Configurações do servidor de aplicação'
read -p "Insira a chave de acesso do gemini: " CHAVE

cat > "$ENV" <<EOF
AMBIENTE_PROCESSO=$AMBIENTE

DB_HOST='$HOST_BD'
DB_USER='$USER'
DB_PASSWORD='$SENHA'
DB_DATABASE='$DATABASE'
DB_PORT=$PORTA_BD

APP_PORT=$PORTA_API
APP_HOST=$HOST_API

MINHA_CHAVE='$CHAVE'
EOF

echo ''
read -p "As credenciais 
'
$(cat $ENV)
'
estão corretas? (S/N)" INICIAR_API

echo ''
if [ $INICIAR_API = 'S' ]; then 
echo 'INSTALANDO DEPENDÊNCIAS...'
npm i
echo ''
echo 'INICIALIZANDO WEBDATAVIZ...'
npm start
else 
echo 'RECONFIGURE AS CREDENCIAIS...'
./init.sh
fi
