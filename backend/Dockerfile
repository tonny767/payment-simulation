FROM golang:1.25-alpine

WORKDIR /app

RUN apk add --no-cache gcc musl-dev
# Copy go mod files FIRST
COPY go.mod ./
RUN go mod tidy
RUN go mod vendor

# Copy the rest of the source
COPY . .

# Build binary
RUN CGO_ENABLED=1 go build -o app


EXPOSE 8080
CMD ["./app"]
