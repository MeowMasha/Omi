const { Client, Message, MessageEmbed } = require("discord.js");
const translate = require("@iamtraction/google-translate");

module.exports = {
  name: "translate",
  aliases: [],
  usage: "query",
  description: "Translate text to English.",
  hidden: false,
  premium: false,
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const query = args.join(" ");
    if (!query) return message.lineReply("Please specify a text to translate!");

    const translated = await translate(query, { to: "en" });

    const embed = new MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: false })
      )
      .addField("Query", query)
      .addField("Result", translated.text)
      .addField("Translated to", "English")
      .setColor("BLUE")
      .setFooter(message.author.tag)
      .setTimestamp();
    message.lineReplyNoMention(embed);
  },
};
