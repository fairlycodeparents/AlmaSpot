package main

import (
    "net/http"
)

type transport struct {
    http.RoundTripper
}

func (t*transport) RoundTrip(req *http.Request) (*http.Response, error) {
    req.Header.Set("User-Agent", "Calendar-Bot")
    return t.RoundTripper.RoundTrip(req)
}

var httpClient = &http.Client{
    Transport: &transport{http.DefaultTransport},
}