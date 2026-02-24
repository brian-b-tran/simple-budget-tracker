# Use stable LTS Node
FROM node:lts-alpine3.22
WORKDIR /app
COPY services/api/package*.json ./
COPY services/api/tsconfig.json ./
RUN npm install
COPY services/api/tsconfig.json ./
COPY services/api/src ./src
EXPOSE 3000
CMD ["npm", "run", "dev"]