FROM node:18
 
WORKDIR /usr/src/app
 
COPY package*.json ./
 
RUN npm install
 
COPY . .
 
RUN npm run build
EXPOSE 3000
 
CMD ["npm","run","dev","--","--host","0.0.0.0","--port","3000"]