# builder
FROM golang:1.19

WORKDIR /app

COPY main.go /app
COPY go.mod /app

RUN go build -o app /app

# app
FROM alpine:latest
COPY --from=0 /app/app /app/app
EXPOSE 8080
CMD ["/app/app"]
