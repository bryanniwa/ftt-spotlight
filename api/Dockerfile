FROM php:7.4-apache

# Install php extensions and other dependencies
RUN docker-php-ext-install pdo pdo_mysql
RUN apt-get update && apt-get install -y unzip=6.0-26+deb11u1 mariadb-client=1:10.5.23-0+deb11u1 --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Copy data to container
WORKDIR /root
COPY . /root

# Install composer and dependencies
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer update && composer install

CMD [ "php", "artisan", "serve", "--host=0.0.0.0", "--port=8000" ]
