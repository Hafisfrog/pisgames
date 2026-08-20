FROM php:8.2-apache

WORKDIR /var/www/html

RUN apt-get update \
  && apt-get install -y --no-install-recommends git libpq-dev unzip \
  && docker-php-ext-install pdo_pgsql pgsql \
  && a2enmod rewrite \
  && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf
COPY . .

RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader \
  && chmod +x docker/start.sh \
  && chown -R www-data:www-data storage bootstrap/cache \
  && chmod -R ug+rwx storage bootstrap/cache

EXPOSE 80

CMD ["docker/start.sh"]
