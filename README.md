# TorbanBot-for-Twitch-chat
Twitch chatbot for modifying OBS settings

## Features
1. Chat commands for playing gifs/sound clips/videos
2. Configurable cooldown for commands
3. Easy to add new commands

## Installation
### Prerequisites
1. Install nodejs https://nodejs.org/en/download/
2. Install obs-websocket-plugin 4.9.1 https://github.com/obsproject/obs-websocket/releases
    * **DO NOT USE VERSION 5**
    * If you are on OBS studio version 28.0 you can skip this step
3. Configure obs websocket
  1. Open OBS Studio. Click **Tools** > **Websockets Server Settings**
  2. Click **Enable authentication** and set a password
  3. Uncheck **Enable System Tray Alerts**
  4. Note the "Server Port" and "Password" for later
4. Create a Twitch app: https://dev.twitch.tv/console

### Installation
1. Click the green **Code** button on the top-right of this page. Download ZIP
2. Extract the ZIP file somewhere on your PC.
3. Open the .env file and add the following information: 
  * TWITCH_CLIENT_ID - The client ID of your twitch bot
  * TWITCH_CLIENT_SECRET - The client secret of your twitch bot
  * BOTNAME - The name of your twitch bot (This needs a twitch account)
  * OBS_WEBSOCKET_ADDRESS - The "Server Port" in step 3.4 of prerequisites.
  * OBS_WEBSOCKET_PASSWORD - The "Password" in step 3.4 of prerequisites.

### First time running the bot
1. Make sure OBS Studio is running
2. Double click **Start.bat**
3. Follow the prompts on the screen.
    1. You'll get a URL, post that into your browser.
      * To copy the URL from the console, highlight it and right click. 
    2. In the twitch auth, log in with your twitch bot credentials (You may need to launch the URL in an incognito tab if you're already logged into twitch as another account)
    3. In the same browser, click the link that says **here**
    4. Click the **Continue with twitch** button
    5. The page will still be logged in as the bot, click **not you? log out.**
    6. Log in with your broadcaster account and authorize. 
4. In OBS Studio, there should be 2 new Sources on your current scene: MemeMedia and MemeImage. These are used for the integration.
  * If you want the integration on multiple scenes, close the bot, change scenes in OBS and run the bot. The sources will be added if they are missing. Do this for each scene.
    1. Right click MemeMedia and click **properties**
    2. Click the check for **Show nothing when playback ends**

### Running the bot after setup
1. Make sure OBS Studio is running
2. Double click **Start.bat**

