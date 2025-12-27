
FROM alpine:latest

ARG PB_VERSION=0.22.21

RUN apk add --no-cache \
    unzip \
    ca-certificates \
    # lib6-compat needed for Go binaries on Alpine sometimes
    gcompat

# Download
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

EXPOSE 8090

# Start
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090", "--encryptionEnv=PB_ENCRYPTION_KEY", "--dir=/pb_data", "--publicDir=/pb_public", "--hooksDir=/pb_hooks", "--migrationsDir=/pb_migrations"]
