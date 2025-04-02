# NyxDrive

NyxDrive is a desktop Telegram client application built with Tauri, React, and TypeScript. It provides a clean interface for authenticating with Telegram and managing your conversations.

## Features

- Telegram account authentication
- Session persistence
- User profile information display
- Modern UI with Tailwind CSS

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or later)
- **Rust** and **Cargo** (latest stable version)
- **System dependencies** for Tauri development:

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install -y build-essential libwebkit2gtk-4.0-dev libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
sudo apt install -y libjavascriptcoregtk-4.1-dev
sudo apt install -y libsoup-3.0-dev
sudo apt install -y libwebkit2gtk-4.1-dev
```

### macOS

```bash
brew install webkit2gtk-4.1
```

### Windows

No additional dependencies required beyond Rust and Node.js.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/NyxDrive.git
   cd NyxDrive
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Telegram API credentials:
   ```
   VITE_TELEGRAM_API_ID=your_api_id
   VITE_TELEGRAM_API_HASH=your_api_hash
   ```
   You can obtain these credentials from [Telegram's developer portal](https://my.telegram.org/apps).

4. Copy the `telegram.js` file to your config directory:
   ```bash
   # Linux/macOS
   mkdir -p ~/.config/nyxdrive
   cp src-tauri/telegram.js ~/.config/nyxdrive/
   
   # Windows (PowerShell)
   New-Item -ItemType Directory -Force -Path "$env:APPDATA\nyxdrive"
   Copy-Item -Path "src-tauri\telegram.js" -Destination "$env:APPDATA\nyxdrive\"
   ```

## Development

To run the application in development mode:

```bash
npm run tauri dev
```

## Building

To build the application for production:

```bash
npm run tauri build
```

This will create platform-specific installers in the `src-tauri/target/release/bundle` directory.

## Troubleshooting

If you encounter issues:

1. Ensure all system dependencies are installed
2. Verify your `.env` file contains the correct Telegram API credentials
3. Make sure the `telegram.js` file is in the correct config directory
4. Check that you're using compatible versions of Node.js and Rust

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
