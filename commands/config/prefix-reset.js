const { Client, Message, MessageEmbed } = require("discord.js");
const prefixSchema = require("../../models/prefix");
const prefix = require("../../config.json").prefix;
const { confirmation } = require("@reconlx/discord.js");

module.exports = {
  name: "reset-prefix",
  aliases: ["defaultPrefix"],
  usage: "",
  description: "Reset Customized Prefix to Default.",
  hidden: false,
  premium: false,
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has("MANAGE_GUILD"))
      return message.lineReply(
        "You need `MANAGE_GUILD` Permission in order to run this command!"
      );
    message
      .lineReplyNoMention("Are you sure to Reset Custom Prefix to Default?")
      .then(async (msg) => {
        const emoji = await confirmation(
          msg,
          message.author,
          ["✅", "❌"],
          10000
        );
        if (emoji === "✅") {
          msg.delete();
          await prefixSchema.findOneAndDelete({ Guild: message.guild.id });
          message.lineReplyNoMention(
            `The prefix has been reset to **${prefix}**`
          );
        }
        if (emoji === "❌") {
          msg.delete();
          message.lineReplyNoMention(
            "Reset Prefix Operation has been cancelled."
          );
        }
      });
  },
};
