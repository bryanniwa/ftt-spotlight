FROM php:7.4-alpine

# Install php extensions and other dependencies
RUN docker-php-ext-install pdo pdo_mysql
RUN apk update && apk add unzip  mariadb-client neovim

# Copy data to container
WORKDIR /root
COPY . /root

# Install composer and dependencies
SHELL ["/bin/sh", "-o", "pipefail", "-c"]
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer update

CMD [ "php", "artisan", "serve", "--host=0.0.0.0", "--port=8000" ]
