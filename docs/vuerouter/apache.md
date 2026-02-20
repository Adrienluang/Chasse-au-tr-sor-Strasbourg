### Apache

```
<IfModule mod_negotiation.c>
  Options -MultiViews
</IfModule>

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

Instead of `mod_rewrite`, you could also use [`FallbackResource`](https://httpd.apache.org/docs/2.4/mod/mod_dir.html#fallbackresource).
