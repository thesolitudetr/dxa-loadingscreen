
<img src="https://i.hizliresim.com/mt46qbs.png">
# DXA Loading Screen

A highly customizable and feature-rich loading screen for FiveM servers, designed to provide an engaging and immersive experience for players while they connect to your server. This loading screen allows for personalized branding, dynamic content, background music with visualizer, and even an interactive mini-game.

## Key Features & Benefits

*   **Custom Branding**: Easily set your server's name, tagline, logo, and social links (Discord, Website).
*   **Dynamic Backgrounds**: Support for both static image backgrounds (`bg.jpg`) and dynamic video backgrounds.
*   **Engaging Music**: Play background music (`music.mp3`) with an optional, interactive audio visualizer.
*   **Interactive Mini-Game**: Keep players entertained with a built-in "DXA Flappy" mini-game while they wait.
*   **Real-time News Feed**: Display important announcements or server news directly on the loading screen.
*   **Custom Loading Messages**: Provide helpful or fun tips with customizable loading status messages.
*   **Visual Enhancements**: Features animated particle effects for a modern and dynamic look.
*   **Easy Configuration**: All key elements are easily configurable via a single `config.js` file.
*   **Responsive Design**: Optimized for various screen sizes, ensuring a consistent experience.
*   **Modern UI/UX**: Built with `Inter` and `Outfit` fonts, and `Font Awesome` icons for a sleek aesthetic.

## Prerequisites & Dependencies

Before installing and using the DXA Loading Screen, ensure you have the following:

*   **FiveM Server**: A running FiveM server instance.
*   **Web Browser**: Clients connecting to your server will need a modern web browser that supports HTML5, CSS3, and JavaScript.
*   **External Assets**:
    *   Google Fonts: `Inter` and `Outfit` (automatically loaded via CDN).
    *   Font Awesome: Icons (automatically loaded via CDN).

## Installation & Setup Instructions

Follow these simple steps to get your DXA Loading Screen up and running:

1.  **Download the Resource**:
    *   Clone this repository to your local machine:
        ```bash
        git clone https://github.com/thesolitudetr/dxa-loadingscreen.git
        ```
    *   Alternatively, download the ZIP archive and extract it.

2.  **Place in Resources Folder**:
    *   Rename the extracted folder to `dxa-loadingscreen` (if necessary).
    *   Move the `dxa-loadingscreen` folder into your FiveM server's `resources` directory.

3.  **Add to `server.cfg`**:
    *   Open your server's `server.cfg` file.
    *   Add the following line to ensure the loading screen resource starts automatically:
        ```cfg
        ensure dxa-loadingscreen
        ```
    *   It's recommended to place this at the top of your `server.cfg` to ensure it loads before other resources that might affect the loading process.

4.  **Customize (Optional but Recommended)**:
    *   Navigate to the `dxa-loadingscreen` folder.
    *   Open `config.js` and `style.css` to personalize the loading screen to match your server's brand (see **Configuration Options** below).

5.  **Restart Server**:
    *   Restart your FiveM server to apply the changes.

## Usage

Once installed and configured, the DXA Loading Screen will automatically be displayed to players connecting to your FiveM server. Players can:

*   View your server's name and tagline.
*   Click on your Discord and Website links.
*   Read the latest news updates.
*   Listen to background music.
*   Play the "DXA Flappy" mini-game by pressing the `SPACE` key.

## Configuration Options

The primary configuration file is `config.js`, located in the root of the `dxa-loadingscreen` directory. Open this file to customize the loading screen to your preferences.

```js
const Config = {
    // Basic Server Information
    ServerName: "DXA Premium Roleplay", // Your server's main name
    Tagline: "The Ultimate Experience", // A catchy slogan or subtitle
    Discord: "discord.gg/dxa",         // Your Discord invite link (e.g., "discord.gg/yourinvite")
    Website: "dxa-roleplay.com",       // Your server's website or community page (e.g., "yourserver.com")

    // Background Settings
    VideoBackground: false,            // Set to true to enable a video background, false for a static image
    BackgroundVideoLink: "https://www.youtube.com/embed/your_video_id?autoplay=1&controls=0&loop=1&playlist=your_video_id&mute=1&disablekb=1",
                                       // URL for the video background. Examples: YouTube embed or direct MP4 link.
                                       // If VideoBackground is false, 'assets/bg.jpg' will be used as the image background.

    // Music Settings
    Music: ["./assets/music.mp3"],     // Array of music files. Add more paths for a playlist.
                                       // Example: ["./assets/music1.mp3", "./assets/music2.mp3"]
    MusicVolume: 0.2,                  // Volume for the background music (0.0 to 1.0)

    // News Section
    News: [
        { title: "DXA Relaunch!", description: "We are excited to announce the grand relaunch of DXA Premium Roleplay with new features and a fresh start!" },
        { title: "New Jobs & Activities", description: "Discover exciting new civilian jobs and criminal activities across the city." },
        { title: "Community Events", description: "Join us for weekly community events and win exclusive rewards!" }
        // Add more news objects as needed
    ],

    // Loading Messages (Displayed in sequence)
    LoadingMessages: [
        "Optimizing your roleplay experience...",
        "Gathering resources for the ultimate adventure...",
        "Ensuring every detail is perfect...",
        "Preparing the world for your arrival...",
        "Booting up the premium roleplay engine..."
        // Add more loading messages as needed
    ],

    // Feature Toggles
    EnableParticles: true,             // Enable or disable the animated particle background
    EnableVisualizer: true,            // Enable or disable the audio visualizer for music
    EnableGame: true,                  // Enable or disable the 'DXA Flappy' mini-game

    // Localization (Text strings used in the UI)
    Locales: {
        PlayGameBtn: "PLAY GAME",
        NewsHeader: "LATEST NEWS",
        LoadingStatus: "Loading...",
        GameHeader: "DXA FLAPPY",
        GamePrompt: "PRESS SPACE TO JUMP!",
        GameBtnExit: "EXIT GAME",
        GameStartPrompt: "PRESS SPACE TO START!",
        GameOver: "GAME OVER! Score:",
        ScoreLabel: "SCORE:",
        // Add other locale strings as needed
    }
};
```

### Styling Customization

For visual styling, modify the `style.css` file. You can change primary colors, fonts, and layout. The CSS uses custom properties (CSS variables) for easy theme adjustments:

```css
:root {
    --primary: #c084fc; /* Main accent color (e.g., purple) */
    --secondary: #2dd4bf; /* Secondary accent color (e.g., teal) */
    --accent: #f472b6; /* Another accent color (e.g., pink) */
    --bg-dark: #020617; /* Dark background color */
    --glass-bg: rgba(255, 255, 255, 0.02); /* Background for glassmorphic elements */
    --glass-border: rgba(255, 255, 255, 0.08); /* Border for glassmorphic elements */
    --text-main: #f8fafc; /* Main text color */
    --text-muted: #64748b; /* Muted text color */
    --shadow-glow: 0 0 30px rgba(192, 132, 252, 0.2); /* Glow effect shadow */
}
```
Adjust these variables at the top of `style.css` to quickly change the theme of your loading screen.

## Contributing Guidelines

Contributions are welcome! If you have suggestions for improvements, new features, or bug fixes, please follow these steps:

1.  **Fork the repository**.
2.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name` or `git checkout -b bugfix/issue-description`.
3.  **Make your changes** and ensure the code adheres to the existing style.
4.  **Test your changes** thoroughly.
5.  **Commit your changes** with a clear and concise message: `git commit -m "feat: Add new feature"`.
6.  **Push your branch** to your forked repository: `git push origin feature/your-feature-name`.
7.  **Open a Pull Request** to the `main` branch of this repository, describing your changes in detail.

## Acknowledgments

*   **Google Fonts**: For providing `Inter` and `Outfit` font families.
*   **Font Awesome**: For the iconic font and CSS toolkit.
