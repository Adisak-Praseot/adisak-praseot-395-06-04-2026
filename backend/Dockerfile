FROM node:20

WORKDIR /app

# copy package
COPY package*.json ./

# install dependencies
RUN npm ci

# copy prisma schema ก่อน
COPY prisma ./prisma

# generate prisma client
RUN npx prisma generate

# copy source code
COPY . .

# build typescript
RUN npm run build

EXPOSE 3000

CMD ["npm","start"]