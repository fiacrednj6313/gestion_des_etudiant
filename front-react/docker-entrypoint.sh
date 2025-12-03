#!/bin/sh

# Substituer les variables API_HOST et API_PORT dans le fichier de config nginx
# Si pas définies, elles seront vides et nginx utilisera la valeur par défaut
envsubst '${API_HOST},${API_PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Lancer nginx
exec "$@"
