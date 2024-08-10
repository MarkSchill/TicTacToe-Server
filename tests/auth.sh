#!/bin/bash

# echo 'Registering...'
# curl -X POST -d 'email=authtest@test.com&password=reallysecure' localhost:3000/player/register

echo 'Logging in...'
curl -c authcookies.txt -X POST -d 'email=authtest@test.com&password=reallysecure' localhost:3000/player/login

# echo 'Attempting to access authorized only page...'
# curl -b authcookies.txt -X GET localhost:3000/player/3d52502d-fb19-427b-aefd-076a06459f1e