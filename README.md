# ReelsTalk 📱

ReelsTalk is a React Native social media application built with a sleek, Instagram/TikTok-inspired interface. It features seamless short-form video (Reels) playback, interactive profile pages, and an immersive media browsing experience.

## ✨ Features

- **Immersive Reels Viewer:** Infinite scrolling vertical video feed, built for optimal performance (only active videos are fully mounted to save memory and CPU).
- **Interactive Profiles:** Dynamic user profiles showing user stats (Posts, Following, Followers), an editable bio, and a categorized grid for Photos and Reels/Videos.
- **Dynamic Comments Modal:** Fully functional Instagram-style drag-to-dismiss comment sheet with inline replies, dynamic avatars, and an anchored text input.
- **Pexels API Integration:** Fetches beautiful, high-quality stock videos and photos for an instantly populated visual experience.
- **Glassmorphic UI Elements:** Modern, translucent UI overlays using sleek design patterns.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- React Native CLI or Expo (depending on setup)
- iOS Simulator (macOS only) or Android Emulator

### Installation

1. **Clone the repository** (if applicable) and navigate to the project directory:
   ```bash
   cd ReelsTalk
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   *(or `yarn install`)*

3. **Install CocoaPods (iOS only):**
   ```bash
   cd ios
   pod install
   cd ..
   ```

### Running the App

To run the app on an iOS simulator:
```bash
npm run ios
```

To run the app on an Android emulator:
```bash
npm run android
```

If you encounter any caching issues, you can start the Metro bundler with a reset cache flag:
```bash
npm start -- --reset-cache
```

## 🛠 Tech Stack

- **Framework:** [React Native](https://reactnative.dev/)
- **Navigation:** [React Navigation](https://reactnavigation.org/) (Bottom Tabs & Stack)
- **Video Playback:** [react-native-video](https://github.com/react-native-video/react-native-video)
- **Icons:** [iconsax-react-native](https://github.com/lusaxweb/iconsax)
- **Storage:** [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)

## 🎨 Design Philosophy
The app prioritizes aesthetic excellence and fluid interactions, mimicking industry-leading social media platforms. All modal animations and touch elements are meticulously aligned, taking safe-area insets into account for flawless cross-device layout.
