# Miyeonie

A Discord bot, based off a [horrible joke](https://twitter.com/NoContextGidle/status/1321301150856073223) involving (G)I-DLE's Miyeon and her inability to solve captchas.

Built off [hopskipnfall's Discord TypeScript template](https://github.com/hopskipnfall/discord-typescript-bot).

## Configuration
Make a copy of `sample.config.ts`, add your [OpenWeatherMap](https://openweathermap.org/) and Discord API keys to it, and save that as `config.ts`.
Clone the repository and `yarn install`. Then, `yarn run`.

More commands: 

| Command       | Description                            |
| ------------- | -------------------------------------- |
| `yarn start`  | Run the bot.                           |
| `yarn build`  | Build the typescript code.             |
| `yarn lint`   | Runs the linter on the code.           |
| `yarn format` | Fixes most lint errors using Prettier. |
| `yarn test`   | Run all tests.                         |

## TODO

- [x] avatar grabber
- [x] weather checker
- [ ] emote grabber?
- [ ] music player
  - [ ] soundcloud/spotify support?