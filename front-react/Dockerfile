FROM node:latest As builder

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:latest As runner

RUN rm /etc/nginx/conf.d/default.conf

# 2. On ajoute NOTRE config Nginx (créée à l'étape 1)
COPY nginx.conf /etc/nginx/conf.d

# 3. On copie UNIQUEMENT les fichiers statiques générés (dossier dist)
# depuis l'étape builder vers le dossier public de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Port standard HTTP
EXPOSE 80

# Lancement de Nginx
CMD ["nginx", "-g", "daemon off;"]