FROM node:16
COPY . /usr/local/mini_faas_worker
WORKDIR /usr/local/mini_faas_worker
RUN npm install -g pnpm --registry=https://registry.npm.taobao.org && pnpm i

ENV NODE_ENV production

CMD ["pnpm","start"]
