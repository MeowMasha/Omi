const { Client, Message, MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const moment = require("moment");

// API Information
/**
 * Service Name : Jikan API
 * Version: v3.4
 * Type : Search
 * Search : Anime
 * Query : ${query}
 * Endpoint URL : https://api.jikan.moe/v3/search/anime?q=query
 */

module.exports = {
  name: "anime",
  aliases: ["anime-search", "search-anime"],
  usage: "<anime-name>",
  description: "Search anime details",
  hidden: false,
  premium: false,
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const query = args.join(" ");
    if (!query) return message.lineReply("Please specify a query to search!");
    fetch(`https://api.jikan.moe/v3/search/anime?q=${query}`)
      .then((res) => res.json())
      .then((body) => {
        const title = body.results[0].title;
        const mal_url = body.results[0].url;
        const imgae = body.results[0].image_url;
        const synopsis = body.results[0].synopsis;
        const type = body.results[0].type;
        const episode = body.results[0].episodes;
        const score = body.results[0].score;
        const start_date = body.results[0].start_date;
        const rate = body.results[0].rated || "Unknown";

        const embed = new MessageEmbed()
          .setTitle(title)
          .setURL(mal_url)
          .setThumbnail(imgae)
          .setDescription(synopsis)
          .addField(`Type`, type)
          .addField(`Total Episode`, episode)
          .addField(`Ratings (at MyAnimeList)`, score)
          .addField(`Released`, moment(start_date).format("LLLL"))
          .addField(`Rate`, rate)
          .setColor(`#800080`)
          .setFooter(
            `Requested by : ${message.author.tag}`,
            message.author.displayAvatarURL({ dynamic: true })
          );

        message.lineReplyNoMention(embed);
      })
      .catch((err) =>
        message.lineReplyNoMention(
          new MessageEmbed()
            .setDescription(
              `<:tickNo:863367014092898314> | That anime isn't found!\n\n\`\`\`js\n${err}\n\`\`\``
            )
            .setColor("RED")
        )
      );
  },
};
