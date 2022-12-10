FROM node:current-slim
WORKDIR /rpp2205-yuchen-QA
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD ["node", "server/index.js"]
