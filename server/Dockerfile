FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
COPY src/scripts/data/*.json ./dist/scripts/data/
CMD ["npm", "run", "start"]
