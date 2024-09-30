FROM php:7.3-apache

RUN apt-get update && apt-get install -y \
  libpng-dev \
  libzip-dev

RUN docker-php-ext-install -j"$(nproc)" gd pdo pdo_mysql zip


RUN apt-get update && apt-get install -y unzip=6.0-26+deb11u1 mariadb-client=1:10.5.23-0+deb11u1 --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Copy data to container
WORKDIR /var/www/html

# Enable Apache mod_rewrite (required for Laravel)
RUN a2enmod rewrite

# Copy the Laravel application files to the working directory
COPY . /var/www/html

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Install composer and download dependencies
COPY --from=composer:1.10 /usr/bin/composer /usr/bin/composer
RUN composer install --optimize-autoloader --no-dev

# Expose port 80
EXPOSE 80

# Start the container apache
CMD ["apache2-foreground"]
