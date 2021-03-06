#build stage
FROM node:10.20.1 as builder

RUN mkdir -p /code

ARG BUILD_TYPE=build

ADD ./ /code/

RUN cd /code && \
    npm install && \
    npm run build && \
    test -f /code/dist/nextoa/index.html

# final stage
FROM clouthinkin/nginx

LABEL maintainer="melthaw@gmai.com"

RUN mkdir -p /usr/share/nginx/html

ADD ./shared/etc/nginx/ /etc/nginx/

COPY ./shared/scripts/docker-healthcheck.sh /
COPY ./shared/scripts/docker-entrypoint.sh /
COPY --from=builder /code/dist/nextoa/ /usr/share/nginx/html/

RUN chmod +x /*.sh

WORKDIR /

EXPOSE 80

VOLUME ["/usr/share/nginx/html/"]

HEALTHCHECK --interval=2m --timeout=15s \
            CMD bash -xe /docker-healthcheck.sh

ENTRYPOINT /docker-entrypoint.sh
