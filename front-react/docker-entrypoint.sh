#!/bin/sh

# Substituer la variable API_URL dans le fichier de config nginx
# Si API_URL n'est pas définie, elle sera vide dans la config
envsubst '${API_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Lancer nginx
exec "$@"
