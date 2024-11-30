#!/bin/bash

IN=budapest_gtfs
OUT=data

mkdir -p $OUT 2>/dev/null

cp $IN/{agency.txt,feed_info.txt} $OUT

head -1 $IN/stops.txt > $OUT/stops.txt
for id in `cat test_stop_ids.txt | tail -n +2`; do
  grep -E "^$id," $IN/stops.txt >> $OUT/stops.txt
done

head -1 $IN/stop_times.txt > $OUT/stop_times.txt
for id in `cut $OUT/stops.txt -d, -f1 | tail -n +2`; do
  grep ,$id, $IN/stop_times.txt | head -100 >> $OUT/stop_times.txt
done

head -1 $IN/trips.txt > $OUT/trips.txt
for id in `cut $OUT/stop_times.txt -d, -f1 | tail -n +2 | sort -u`; do
  grep -E "^[^,]*,$id," $IN/trips.txt >> $OUT/trips.txt
done

head -1 $IN/routes.txt > $OUT/routes.txt
for id in `cut $OUT/trips.txt -d, -f1 | tail -n +2 | sort -u`; do
  grep -E "^[^,]*,$id," $IN/routes.txt >> $OUT/routes.txt
done

head -1 $IN/shapes.txt > $OUT/shapes.txt
for id in `cut $OUT/trips.txt -d, -f7 | tail -n +2 | sort -u`; do
  grep -E "^$id," $IN/shapes.txt >> $OUT/shapes.txt
done

cd $OUT && zip -r ../gtfs_sample.zip ./*
