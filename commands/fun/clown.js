const {
  Client,
  Message,
  MessageEmbed,
  MessageAttachment,
} = require("discord.js");

module.exports = {
  name: "clown",
  aliases: ["clowns"],
  usage: "<@user>",
  description: "Clown a user",
  hidden: false,
  premium: false,
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    message.channel.startTyping();
    const user = message.mentions.members.first() || message.member;
    let msg = await message.channel.send("Please wait...");
    let att = new MessageAttachment(
      `https://api.popcatdev.repl.co/clown?image=${user.user.displayAvatarURL({
        dynamic: false,
        format: "png",
      })}`,
      `${user.user.username}_clown.png`
    );

    message.channel.send(att);
    msg.delete();
    message.channel.stopTyping();
  },
};
