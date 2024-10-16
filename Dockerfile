# Build Angular app
FROM node:16.14.2 as node
WORKDIR /app
COPY ./package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build -- --prod

#Publish on nginx
FROM nginx:alpine
VOLUME /var/cache/nginx
COPY --from=node /app/dist/IPM-Decisions-Platform /usr/share/nginx/html
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf

# Run command to build IPM Decissions Platform docker image 
    # docker build -t ipm-decisions-platform .

# Run image locally 
    #docker run -p 8080:80 ipm-decisions-platform

