# Mega Slot
Node.js and Vue.js application to show how slot machines work.

# Run
 - Install docker
 - Copy `.env.example` to `.env`
 
 - Run Build
   - Run `docker-compose run --rm client npm run build`
   - Run `docker-compose run --rm admin npm run build`
   - Run `docker-compose up node db`
   - Open `http://localhost:${BE_PORT}` where `${BE_PORT}` is a variable from .env
 
 - Run Client Dev
   - Run `docker-compose up node db client`
   - Open `http://localhost:${VUE_APP_CLIENT_PORT}` where `${VUE_APP_CLIENT_PORT}` is a variable from .env
 
 - Run Admin Dev
   - Run `docker-compose up node db admin`
   - Open `http://localhost:${VUE_APP_ADMIN_PORT}` where `${VUE_APP_ADMIN_PORT}` is a variable from .env
 
# Notes
 - `node` service is looking for `front/admin/dist` and `front/client/dist` so make sure you build front as well if you want to run prod for example
 - `node` service runs initDb script every time you run `docker-compose up`
 - all services run npm install before running any script
