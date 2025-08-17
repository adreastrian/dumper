# Dump Viewer

A beautiful debugging tool that captures and displays PHP dump() output with a beautiful interface. Works with any PHP project - Laravel, Symfony, or vanilla PHP.

## Features

- 🎨 Beautiful interface
- 🔄 Real-time dump capture
- 📱 Responsive web-based UI
- 🎯 Zero configuration setup
- 🔍 Filtering
- 🌐 Works with any PHP framework

## Quick Start

1. **Download** the latest release from GitHub
2. **Extract** the zip file
3. **Start the server**:
   ```bash
   cd dump-viewer
   ./bin/dump-viewer.js
   ```
   > **Note**: On first run, the script will automatically install npm dependencies. This may take a moment.

4. **Include in your PHP project**:

   ```php
   require_once '/path/to/dumper/dumper.php';

   // Now you can use dump() anywhere
   d($variable);
   dd($data); // dump and die
   ```

5. **Open your browser** - dumps will appear in real-time!

## Configuration

### Environment Variables

Create a `.env` file in the dump-viewer directory to customize paths:

```bash
# Path to your PHP vendor directory
PHP_VENDOR_PATH=/path/to/your/project/vendor
```

### PHP Integration

The `dumper.php` file automatically configures Symfony VarDumper to send dumps to the viewer:

- **Auto-detects vendor path**: Uses your configured `PHP_VENDOR_PATH`
- **Source context**: Shows file names and line numbers
- **Framework agnostic**: Works with any PHP project
- **Zero configuration**: Just include the file and start dumping

### Troubleshooting

**Connection Issues:**

- Ensure the dump viewer is running (`./bin/dump-viewer.js`)
- Check that port 9912 is available
- Verify the `PHP_VENDOR_PATH` points to the correct vendor directory

**Symfony VarDumper Not Found:**

- Make sure Symfony VarDumper is installed: `composer require symfony/var-dumper`
- Verify the vendor path in your `.env` file

## Command Line Options

```bash
./bin/dump-viewer.js --help

Options:
  -p, --port <port>       Port for the web interface (default: 3000)
  -d, --dump-port <port>  Port for the Symfony dump server (default: 9912)
  --no-open              Don't automatically open browser
  -h, --help              Display help for command
```

## Development

```bash
# Clone the repository
git clone <repository-url>
cd dump-viewer

# Install dependencies manually (for development)
npm install

# Build TypeScript
npm run build

# Start in development mode
npm run dev

# Clean build files
npm run clean
```

> **Note**: For development, you need to manually install dependencies and build the project. The auto-install feature in `./bin/dump-viewer.js` is only for end users.

## Requirements

- Node.js >= 16.0.0
- PHP (any version with basic functionality)

## License

MIT
