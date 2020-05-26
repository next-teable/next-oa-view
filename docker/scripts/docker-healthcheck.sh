#!/bin/bash -e
function curl_head_200() {
    local curl_endpoint=${1?}
    local err_msg=${2?}
    if ! curl -I "$curl_endpoint" | grep 'HTTP/1.1 200 OK'; then
        echo "ERROR: $err_msg"
        exit 1
    fi
}

function curl_head_401() {
    local curl_endpoint=${1?}
    local err_msg=${2?}
    if ! curl -I "$curl_endpoint" | grep 'HTTP/1.1 401 Unauthorized'; then
        echo "ERROR: $err_msg"
        exit 1
    fi
}

curl_head_200 "http://localhost/" "content check fails"

