#!/bin/sh

for f in mono/*.wav; do
  name=$(basename "$f" .wav)
  sox "$f" mp3/"$name".mp3
done
