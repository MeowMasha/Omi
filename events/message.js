const { MessageEmbed } = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;
const premiumSchema = require("../models/premium");
const blacklist = require("../models/blacklist");
const prefixSchema = require("../models/prefix");

module.exports = (client) => {
  client.on("message", async (message) => {
    if (message.author.bot) return;
    // if(db.has(`afk-${message.author.id}+${message.guild.id}`)) {
    //     const info = db.get(`afk-${message.author.id}+${message.guild.id}`)
    //     await db.delete(`afk-${message.author.id}+${message.guild.id}`)
    //     message.reply(`Your afk status have been removed (${info})`)
    // }
    // //checking for mentions
    // if(message.mentions.members.first()) {
    //     if(db.has(`afk-${message.mentions.members.first().id}+${message.guild.id}`)) {
    //         message.channel.send(message.mentions.members.first().user.tag + ":" + db.get(`afk-${message.mentions.members.first().id}+${message.guild.id}`))
    //     }else return;
    // }else;
    const p = await client.prefix(message);
    if (message.mentions.users.first()) {
      if (message.mentions.users.first().id === "848232775798226996")
        message.lineReplyNoMention(
          new MessageEmbed()
            .setTitle(`Prefix Info`)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setDescription(
              `Prefix in **${message.guild.name}** is **\`${p}\`**\nFor Help Commands, you can type **\`${p}help\`**`
            )
            .setFooter(
              message.author.tag,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setColor(`BLUE`)
        );
    }
    if (!message.content.startsWith(p)) return;
    blacklist.findOne({ id: message.author.id }, async (err, data) => {
      if (err) throw err;
      if (!data) {
        if (!message.guild) return;
        if (!message.member)
          message.member = await message.guild.fetchMember(message);
        const args = message.content.slice(p.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
        if (cmd.length == 0) return;
        let command = client.commands.get(cmd);
        if (!command) command = client.commands.get(client.aliases.get(cmd));
        if (command) {
          if (
            command.premium &&
            !(await premiumSchema.findOne({ User: message.author.id }))
          )
            return message.lineReply(
              "You need to upgrade to premium to use this command!\n\nUse `.premium` to know how to upgrade!"
            );

          command.run(client, message, args);
        }
      } else {
        message.lineReplyNoMention("You are blacklisted!");
      }
    });
  });
};
