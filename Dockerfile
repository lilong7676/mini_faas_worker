FROM node:16
COPY . /usr/local/mini_faas_worker
WORKDIR /usr/local/mini_faas_worker

EXPOSE 9100 9101 9102

RUN npm install -g pnpm --registry=https://registry.npm.taobao.org && pnpm i

CMD ["pnpm","start"]
