# backend/Dockerfile

FROM golang:1.21 AS build
ENV CGO_ENABLED=1
WORKDIR /app
COPY . .
RUN go mod tidy
RUN go build -o app .

FROM golang:1.21
WORKDIR /app
COPY --from=build /app/app .
COPY --from=build /app/*.db . 
EXPOSE 8080
ENTRYPOINT ["./app"]
