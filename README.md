# <img align="left" width="105" height="105" src="./src/media/2d/favicon.png"> Bouncing band

## [https://bouncing.band](https://bouncing.band)

![hand](https://user-images.githubusercontent.com/2639360/115254296-1ac65700-a125-11eb-9e10-f8b175a55cd5.gif)

## A portable random orchestra

Bouncing Band turns any space in a random musical instrument. Just use objects and characters from the oio orchestra to generate chaotic nonsense and annoy all your friends and family.

The experiment runs from a regular website in your browser, without requiring additional downloads or applications to install. Just browse to the project page [https://bouncing.band](https://bouncing.band) from a device that supports WebXR (Chrome Android 81+).

The application lets you drop different sound characters in the surrounding space. Once in the scene, characters will start bouncing off the floors, tables and all the detected surfaces, making sounds as they interact with the environment.

# Tech

Bouncing Band was built using [ThreeJS](https://threejs.org/), starting from the WebXR examples. Under the hood it makes use of the [WebXR device APIs](https://immersiveweb.dev/), of which you can find more information [here](https://github.com/immersive-web/webxr/blob/master/explainer.md).

The size of the web application is around 15mb, which is significant for a website but not so much for an AR app considering sounds, images and 3d files. It can be further reduced, as it was not optimised for space.

Bouncing Band performs well up to around 600 bouncing characters, on a Google Pixel 3, which we think it's quite impressive for a non-native app.

# Why?

We are a new company called [oio](https://oio.studio), and creative technology is our business.

# Develop

```
yarn install && yarn start
```

Https is required by WebXR, you can use [ngrok](https://ngrok.com/) for https on local dev, there's a handy `yarn grok` command, if you have it installed.

# Credits

## [https://oio.studio](https://oio.studio)

A WebXR experiment by [oio](https://oio.studio), a creative company on a quest to turn emerging technology into an accessible, everyday and sustainable reality.

![oio](https://user-images.githubusercontent.com/2639360/115254363-2ade3680-a125-11eb-9fcf-9acf9b832cf2.gif)

**📐 &nbsp; Design and Development**

[Matteo Loglio](https://matlo.me)

**🔉 &nbsp; Sounds**

- Undo by [ConarB13](https://freesound.org/people/ConarB13/sounds/401542/)
- Explosion by [Partners in Rhyme](https://www.freesoundeffects.com/free-track/explosion-3-466448/)
- Ping pong ball by [Michorvath](https://freesound.org/people/michorvath/sounds/269718/)
- Hot-dog squash by [oio](https://oio.studio)
- Quack by [oio](https://oio.studio)
- Hammer kick by [oio](https://oio.studio)

**🏓 &nbsp; 3D**

- Vegan hot dog by [Google Poly](https://poly.google.com/view/fPOjUkuqPLw)
- Rubber duck by [Google Poly](https://poly.google.com/view/9pffFcv7LSm)
- Paddle by [Matteo Loglio](https://matlo.me)
- Moka (Coffee Pot) by [Google Poly](https://poly.google.com/view/4JpGweI6vVR)
- Hammer by [Google Poly](https://poly.google.com/view/cOizz1RJnb3) remixed by [Matteo Loglio](https://matlo.me)
- Broccoli by [Google Poly](https://poly.google.com/view/e2Z3XDxtT41) remixed by [Matteo Loglio](https://matlo.me)
- Laser gun by [Damon Pidhajecky](https://poly.google.com/view/9qGe3grmPlK)
