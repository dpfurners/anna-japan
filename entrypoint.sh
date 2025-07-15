#!/bin/sh
echo "Setting up permissions for days directory..."
mkdir -p /app/days
chmod 777 /app/days
echo "Permissions set! Starting server..."
exec "$@"
