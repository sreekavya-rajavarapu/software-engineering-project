from node:carbon-alpine

WORKDIR /app
COPY package*.json ./
RUN npm i

VOLUME ["/app/cfg"]

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm","start"]
