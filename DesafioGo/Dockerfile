FROM golang:1.19.5-alpine AS base

WORKDIR /usr/src

RUN go mod init app

COPY . .

RUN go build -v -o . ./...

FROM scratch

COPY --from=base /usr/src .

CMD ["./app"]