FROM golang:1.25-alpine AS builder
WORKDIR /app
RUN apk add --no-cache git
COPY . .
RUN rm -f go.mod go.sum
RUN go mod init unibo-provider
RUN go get github.com/VaiTon/unibocalendar@main
RUN go mod tidy
RUN go build -o unibo-provider .

FROM alpine:latest
WORKDIR /app
RUN apk --no-cache add ca-certificates
COPY --from=builder /app/unibo-provider .
EXPOSE 8080
CMD ["./unibo-provider"]