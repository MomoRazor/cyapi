FROM node:16-alpine AS build
RUN mkdir /app
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build

FROM node:16-alpine AS service
RUN mkdir /app
WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package*.json /app/
RUN npm i --only=prod
EXPOSE 60000
CMD ["npm", "run", "start"]