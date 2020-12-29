/* eslint-disable camelcase */
// camelcase disabled because the resulting json file is in camelcase, i can't change that
import axios from 'axios';
import Discord from 'discord.js';
import { config } from '../../config/config';
import { CommandContext } from '../../models/command_context';
import { Command } from '../command';

export class Weather implements Command {
  commandNames = ['weather'];

  getHelpMessage(commandPrefix: string): string {
    return `Fetches the weather from OpenWeatherAPI.
**Usage**: \`${commandPrefix}weather [unit of measurement] [location]\`
Units of measurement default to Celsius - use \`f/fahrenheit\` if you want it in F.`;
  }

  weatherembed = (
    currTemp: number,
    feelTemp: number,
    minTemp: number,
    maxTemp: number,
    humidity: any,
    country: any,
    city: any,
    cloudness: any,
    icon: any,
    author: string,
    units: string,
    prefix: string,
  ) =>
    new Discord.MessageEmbed()
      .setColor('#1da0f8')
      .setAuthor(`Hello, ${author}`)
      .setTitle(
        `It's currently ${currTemp}\u00B0${
          units === 'imperial' ? 'F' : 'C'
        } in ${city}, ${country}`,
      )
      .addField(
        `Feels like`,
        `${feelTemp}\u00B0${units === 'imperial' ? 'F' : 'C'}`,
        true,
      )
      .addField(
        `Max Temp`,
        `${maxTemp}\u00B0${units === 'imperial' ? 'F' : 'C'}`,
        true,
      )
      .addField(
        `Min Temp`,
        `${minTemp}\u00B0${units === 'imperial' ? 'F' : 'C'}`,
        true,
      )
      .addField(`Humidity`, `${humidity}%`, true)
      .addField(`Cloudiness`, `${cloudness} `, true)
      .setFooter(
        `If you want to see weather in ${
          units === 'imperial' ? 'Celsius' : 'Fahrenheit'
        }, try ${prefix}weather ${
          units === 'imperial' ? '[c]/[celsius] (optional)' : '[f]/[fahrenheit]'
        } [location]`,
      )
      .setThumbnail(`http://openweathermap.org/img/wn/${icon}@2x.png`);

  async run(parsedUserCommand: CommandContext): Promise<void> {
    // chooses to display in C or F, C is default
    let units = 'metric';
    // make copy of arguments to slice 1 off in case i need to remove the argument of F/C
    // eslint-disable-next-line prefer-const
    let sarny = parsedUserCommand.args;

    if (!parsedUserCommand.args) {
      parsedUserCommand.originalMessage.channel.send(
        'Please provide a location!',
      );
      return;
    }
    const validTemps = ['f', 'fahrenheit', 'c', 'celsius'];
    // pops the first argument only if it's a unit of measurement
    if (validTemps.includes(sarny[0])) {
      const unitArg = sarny.shift();
      if (unitArg === 'f' || unitArg === 'fahrenheit') {
        units = 'imperial';
      }
    }

    // making location a string for cases like New York
    let location = '';

    for (let x = 0; x < sarny.length; x++) {
      location += `${sarny[x]} `;
    }

    const APIData = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${units}&APPID=${config.openAPIKey}`,
    );

    // fool proof!
    if (APIData.data.cod === '404') {
      parsedUserCommand.originalMessage.channel.send(
        "Either this location doesn't exist, or there's no information available.",
      );
      return;
    }

    const { temp, feels_like, temp_min, temp_max } = APIData.data.main;
    const currTemp = Math.round(temp);
    const feelTemp = Math.round(feels_like);
    const minTemp = Math.round(temp_min);
    const maxTemp = Math.round(temp_max);
    const { humidity } = APIData.data.main;
    const { country } = APIData.data.sys;
    const city = APIData.data.name;
    const cloudness = APIData.data.weather[0].description;
    const { icon } = APIData.data.weather[0];
    const author = parsedUserCommand.originalMessage.author.username;
    parsedUserCommand.originalMessage.reply(
      this.weatherembed(
        currTemp,
        feelTemp,
        minTemp,
        maxTemp,
        humidity,
        country,
        city,
        cloudness,
        icon,
        author,
        units,
        parsedUserCommand.commandPrefix,
      ),
    );
  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }
}
