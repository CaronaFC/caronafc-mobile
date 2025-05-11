# 🚗📱 CaronaFC - Mobile

Aplicativo mobile CaronaFC

---

## 🛠 Tecnologias utilizadas

<div>
  <img align="center" src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img align="center" src="https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img align="center" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img align="center" src="https://img.shields.io/badge/NativeWind-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img align="center" src="https://img.shields.io/badge/Babel-F9DC3E?style=for-the-badge&logo=babel&logoColor=black" />
  <img align="center" src="https://img.shields.io/badge/Metro%20Bundler-121212?style=for-the-badge&logo=metro&logoColor=white" />
</div>

---

## 🚀 Como rodar localmente

```bash
# Clone o repositório
git clone https://github.com/CaronaFC/caronafc-mobile.git

# Acesse o diretório
cd caronafc-mobile

# Instale as dependências
npm install

# Inicie o projeto
npm run web

# Acesse em seu navegador:
http://localhost:8081
```

## 👥 Como desenvolver em equipe

```bash

# Após realizar o passo acima e garantir que o projeto está rodando, siga os passos abaixo:

# Certifique-se de que você está na branch dev

git checkout dev

# Certifique-se de que a branch dev está atualizada

git pull origin dev

# Crie uma nova branch para a sua feature, utilize o código da task, exemplo:

git checkout -b CF-1

# Após realizar as alterações, faça os seus commits

# Exemplo de commit:

git add arquivo-modificado.tsx

git commit -m "feat: [CF-1] Adiciona nova feature"

# Após realizar os commits, faça o push da sua branch (a flag -u é para criar o tracking remoto da sua branch, que até o momento só existe na sua máquina):

git push -u origin CF-1

# Após isso, crie um Pull Request no GitHub, para mergear sua branch com a branch de dev e aguarde alguém revisar!
```