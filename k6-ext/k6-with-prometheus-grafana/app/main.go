package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"sync/atomic"
	"time"
)

const (
	defSleepTime = 1
	maxSleepTime = 5
)

var (
	reqsCount uint32
	sleepTime uint32
)

func init() {
	rand.Seed(time.Now().UnixNano())
}

type CountResp struct {
	Count     uint32 `json:"count"`
	SleepTime uint32 `json:"sleep_time"`
}

func main() {
	port := flag.Int("p", 8080, "HTTP port")

	http.Handle("/count", failingMiddleware(http.HandlerFunc(countHandler)))
	http.Handle("/sleep", failingMiddleware(http.HandlerFunc(sleepHandler)))

	log.Fatal(http.ListenAndServe(fmt.Sprint(":", *port), nil))
}

func countHandler(w http.ResponseWriter, r *http.Request) {
	b, err := json.Marshal(CountResp{
		Count:     atomic.LoadUint32(&reqsCount),
		SleepTime: atomic.LoadUint32(&sleepTime),
	})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	_, err = w.Write(b)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}
	w.Header().Add("Content-Type", "application/json")
}

func sleepHandler(w http.ResponseWriter, r *http.Request) {
	st, err := strconv.Atoi(r.URL.Query().Get("t"))
	if err != nil {
		st = defSleepTime
	} else if st < 0 || st > maxSleepTime {
		st = maxSleepTime
	}

	atomic.AddUint32(&reqsCount, 1)
	atomic.AddUint32(&sleepTime, uint32(st)) // cast checked by impl

	time.Sleep(time.Duration(st) * time.Second)
}

func failingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if shouldFailReq() {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func shouldFailReq() bool {
	return rand.Intn(10) == 1
}
