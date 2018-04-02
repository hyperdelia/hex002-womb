#!/bin/sh

echo "Splitting" "$1"

chans=$(soxi -c "$1")
while [ "$chans" -ge 1 ]; do
    chans0=$(printf %02i "$chans")   # 2 digits hence up to 99 chans
    out=$(echo "$1"|sed "s/\(.*\)\.\(.*\)/\1-$chans0.\2/")
    echo "Wrote" "$2"/"$out"
    sox "$1" "$2"/"$out" remix "$chans"
    chans=$(expr $chans - 1)
done
echo "Finished de-interleaving" "$1"
