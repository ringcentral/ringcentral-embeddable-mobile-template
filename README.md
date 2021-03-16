# RingCentral embeddable mobile template

<!-- sep -->

**Experimental** RingCentral Android/IOS apps template project based on [ringcentral-embeddable](https://github.com/ringcentral/ringcentral-embeddable) and cordova

![ ](https://github.com/ringcentral/ringcentral-embeddable-mobile-framework/raw/main/screenshots/s1.png)

## Demo video

https://youtu.be/k7ovVgO5QlM

## Download demo apps

[https://github.com/ringcentral/ringcentral-embeddable-mobile/releases](https://github.com/ringcentral/ringcentral-embeddable-mobile/releases)

## Dev

### Prerequisites

- Install Nodejs and npm(recommend using [nvm](https://github.com/nvm-sh/nvm)).
- Android: Follow the cordova guide to prepare for Android development: https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html
- IOS: Follow the cordova guide to prepare for ISO development: https://cordova.apache.org/docs/en/latest/guide/platforms/ios/index.html, also requires paid apple developer account.
- ImageMagick installed (Mac: `brew install imagemagick`, Debian/Ubuntu: `sudo apt-get install imagemagick`, Windows: [See here, install "Legacy tools"](http://www.imagemagick.org/script/binary-releases.php#windows))
- cordova-splash: `npm install cordova-splash -g`
- cordova-icon: `npm install cordova-icon -g`
- A developer account in developer.ringcentral.com(free to register)
- Create an app in developer.ringcentral.com, Create a RingCentral app with platform type - "Browser Based", and add permissions `Edit Message`, `Edit Presence`, `Internal Messages`, `Read Accounts`, `Read Call Log`, `Read Contacts`, `Read Messages`, `Read Presence`, `RingOut`, `SMS`, `Call Control` and `VoIP Calling` to your app.

```bash
# install dependencies
npm run pre && npm i

# start proxy server in another terminal
npm run proxy

# will get https://xxxx.ngrok.io -> localhost:6066
# Remember https://xxxx.ngrok.io as serverUrl

# create env file, then fill .env with https://xxxx.ngrok.io as RINGCENTRAL_APP_SERVER and RINGCENTRAL_CLIENT_ID and RINGCENTRAL_CLIENT_SECRET from your app credentials,
# set https://xxxx.ngrok.io/rc-oauth as callback url in app setting
cp sample.env .env

# start server
npm start

# start client in another terminal
npm run c

# prepare cordova in another terminal
npm run prepare

# run Android app, make sure you have simulator or real android device ready and open
npm run a

# run IOS app, make sure you have real IOS device and paid developer ID ready,
# and open platforms/ios with xcode and config build an debug env, may need set workspace validate to yes
npm run i
```

## Deploy

```sh
## build all files to deploy folder
npm run build-dist
```

Just deploy the `deploy` folder to your server/serverless or any platform.

## Customize

- **Edit icon/splash**: Just replace [src/app/icon.png](src/app/icon.png) or [src/app/splash.png](src/app/splash.png)
- **Edit config/plugin**: Edit [src/app/config.xml](src/app/config.xml)
- **Add more server side function**: Edit [src/server/app/app.js](src/server/app/app.js)
- **Add more front end functions**: Edit [src/client/extra/index.js](src/client/extra/index.js)

## License

MIT
