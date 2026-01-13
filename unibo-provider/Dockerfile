FROM golang:1.21-alpine AS builder
WORKDIR /app
RUN apk add --no-cache git
COPY go.mod ./
RUN go mod tidy
COPY . .
RUN go build -o unibo-provider .

FROM alpine:latest
WORKDIR /app
RUN apk --no-cache add ca-certificates
COPY --from=builder /app/unibo-provider .
EXPOSE 8080
CMD ["./unibo-provider"]