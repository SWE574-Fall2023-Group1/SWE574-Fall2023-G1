#!/usr/bin/env bash

set -euo pipefail

check_and_create_file() {
    filePath=$1
    sampleFilePath="${filePath}.sample"

    if [ -e "$filePath" ]; then
        # File exists
        echo "$filePath already exists."
    elif [ -e "$sampleFilePath" ]; then
        # Sample file exists, copy it to create the file
        cp "$sampleFilePath" "$filePath"
        echo "File created by copying $sampleFilePath to $filePath."
    else
        # Neither file nor sample file exists, create an empty file
        touch "$filePath"
        echo "File created at $filePath."
    fi
}

check_and_create_file "./backend/backend/.env"
check_and_create_file "./backend/frontend/.env"
