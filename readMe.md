# Ip-Anchor

## Overview

Ip-Anchor is a Node.js tool designed for developers to easily configure their local development environment with custom domain names and IP addresses. It automates the process of setting up local domains and SSL certificates, streamlining the development workflow.

## Features

- Easy configuration of local domain names and IP addresses.
- Automatic SSL certificate generation for secure local development.
- Supports multiple platforms including Windows, macOS, and Linux.
- Command-line interface for quick and straightforward setup.

## Prerequisites

- Node.js: Make sure you have Node.js installed on your machine.
- npm or yarn: Required for installing the tool globally.

## Installation

You can install Ip-Anchor globally using npm or yarn. This allows you to use it from anywhere in your terminal.

### Using npm:

```bash
npm install -g ip-anchor
```

### Using yarn:

```bash
yarn global add ip-anchor
```

## Usage

To configure a local domain with Ip-Anchor, simply run the following command in your terminal:

```bash
ip-anchor <IP-ADDRESS> <DOMAIN-NAME>
```

### Example:

```bash
ip-anchor 192.168.1.100 mycustomdomain.com
```

This will set up the specified IP address and domain name for local development.

## Configuration Options

The Ip-Anchor tool accepts the following arguments:

- IP Address: The local IP address you want to associate with a custom domain.
- Domain Name: The custom domain name you want to set up for local development.

## Using with Vite

To use DomainConfigurator with Vite, a frontend build tool, follow these steps:

1. **Configure Domain and IP**: First, use DomainConfigurator to set up your custom domain and IP address as described in the Usage section.

2. **Update Vite Config**: In your project's `vite.config.js` file, set the server host to your custom domain:

    ```javascript
    export default {
      server: {
        host: 'mycustomdomain.com'
      }
    }
    ```

3. **Start Vite**: Run `vite` or `npm run dev` (if you've set up a script for it) to start the Vite development server. It should now be accessible at `http://mycustomdomain.com` (or another port if you've configured it differently).

4. **SSL Configuration**: If you've set up SSL certificates with DomainConfigurator, you may also want to configure Vite to use these certificates for HTTPS. Update your `vite.config.js` to include the path to your key and certificate:

    ```javascript
    import fs from 'fs';
    import path from 'path';

    export default {
      server: {
        host: 'mycustomdomain.com',
        https: {
          key: fs.readFileSync(path.resolve(__dirname, '.cert/key.pem')),
          cert: fs.readFileSync(path.resolve(__dirname, '.cert/cert.pem'))
        }
      }
    }
    ```

5. **Access Your Project**: Open a browser and navigate to your custom domain (e.g., `https://mycustomdomain.com`). You should see your Vite project running.

Remember to replace `'mycustomdomain.com'` with the actual domain you configured and adjust the paths to your SSL certificates if they are located elsewhere.


## Troubleshooting

If you encounter any issues while using Ip-Anchor, please ensure that:

- You have the necessary permissions to modify system files.
- Your Node.js and npm/yarn versions are up to date.
- You have correctly entered the IP address and domain name.

## Contributing

Contributions to Ip-Anchor are welcome! If you have suggestions for improvements or encounter any issues, please feel free to open an issue or submit a pull request on our GitHub repository.
