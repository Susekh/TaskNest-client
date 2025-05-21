# Use official Node.js LTS image
FROM node:slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Expose the correct port for vite preview
EXPOSE 4173

CMD ["npm", "run", "preview"]
