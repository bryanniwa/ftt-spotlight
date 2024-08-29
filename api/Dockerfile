FROM php:7.4-apache
WORKDIR /root
COPY . /root

RUN apt-get update && apt-get install -y unzip=6.0-26+deb11u1 --no-install-recommends && rm -rf /var/lib/apt/lists/*

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer update && composer install
