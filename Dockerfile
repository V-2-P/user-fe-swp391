FROM node:18-alpine

WORKDIR /fe-admin-swp391

RUN yarn --version || npm install -g yarn

COPY package.json package-lock.json ./

RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]