FROM node:16
COPY . /usr/local/mini_faas_worker
WORKDIR /usr/local/mini_faas_worker
ENV NODE_ENV production

RUN npm install -g pnpm --registry=https://registry.npm.taobao.org && pnpm i

CMD ["pnpm","start"]
