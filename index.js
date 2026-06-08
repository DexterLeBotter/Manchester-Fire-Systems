require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits,
    ChannelType
} = require('discord.js');

const transcripts = require('discord-html-transcripts');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
});

const SERVER_ID = '1264255616164298974';
const LOG_CHANNEL = '1488468404850659424';

const ROLES = {
    bronze: '1486117977135779990',
    silver: '1486117973944172694',
    gold: '1486117970190270654'
};

const CATEGORIES = {
    bronze: '1486497517062586529',
    silver: '1486497585043607662',
    gold: '1488302055075483749'
};

const commands = [

new SlashCommandBuilder()
.setName('promote')
.setDescription('Promote a member.')
.addUserOption(option =>
    option.setName('user')
    .setDescription('Member to promote')
    .setRequired(true))
.addStringOption(option =>
    option.setName('rank')
    .setDescription('New rank')
    .setRequired(true)),

new SlashCommandBuilder()
.setName('infract')
.setDescription('Infract a member.')
.addUserOption(option =>
    option.setName('user')
    .setDescription('Member to infract')
    .setRequired(true))
.addStringOption(option =>
    option.setName('reason')
    .setDescription('Infraction reason')
    .setRequired(true)),

new SlashCommandBuilder()
.setName('ticketpanel')
.setDescription('Send the support panel.')

].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                SERVER_ID
            ),
            { body: commands }
        );

        console.log('✅ Slash commands loaded.');

    } catch (err) {
        console.log(err);
    }
})();

client.once('ready', () => {
    console.log(`🚒 ${client.user.tag} is online.`);
});

client.on('interactionCreate', async interaction => {

    if (interaction.isChatInputCommand()) {

        if (interaction.commandName === 'promote') {

            const user = interaction.options.getUser('user');
            const rank = interaction.options.getString('rank');

            const embed = new EmbedBuilder()
            .setColor('#8B0000')
            .setTitle('🚒 GMFRS PROMOTION NOTICE')
            .setDescription(`
═══════════════════════

The Highranks here at Greater Manchester Fire and Rescue Service have recognised your bravery, professionalism, dedication, and continued service here at GMFRS.

Due to your outstanding performance and commitment to the department, you are hereby promoted.

Thank you for your service and continued contribution to Greater Manchester Fire and Rescue Service.

═══════════════════════
            `)
            .addFields(
                {
                    name: '👨‍🚒 Promoted Member',
                    value: `${user}`,
                    inline: true
                },
                {
                    name: '📈 New Rank',
                    value: rank,
                    inline: true
                },
                {
                    name: '🧑‍💼 Issued By',
                    value: `${interaction.user}`,
                    inline: true
                }
            )
            .setFooter({
                text: 'Manchester Fire Systems'
            })
            .setTimestamp();

            await interaction.reply({
                embeds: [embed]
            });

            const logs = await client.channels.fetch(LOG_CHANNEL);

            logs.send({
                embeds: [embed]
            });
        }

        if (interaction.commandName === 'infract') {

            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason');

            const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('⚠️ GMFRS INFRACTION NOTICE')
            .setDescription(`
═══════════════════════

A formal infraction has been issued against a member of Greater Manchester Fire and Rescue Service.

Please ensure all department standards, conduct policies, and professionalism expectations are followed at all times.

═══════════════════════
            `)
            .addFields(
                {
                    name: '👨‍🚒 Member',
                    value: `${user}`,
                    inline: true
                },
                {
                    name: '📄 Reason',
                    value: reason,
                    inline: true
                },
                {
                    name: '🧑‍💼 Issued By',
                    value: `${interaction.user}`,
                    inline: true
                }
            )
            .setFooter({
                text: 'Manchester Fire Systems'
            })
            .setTimestamp();

            await interaction.reply({
                embeds: [embed]
            });

            const logs = await client.channels.fetch(LOG_CHANNEL);

            logs.send({
                embeds: [embed]
            });
        }

        if (interaction.commandName === 'ticketpanel') {

            const embed = new EmbedBuilder()
            .setColor('#8B0000')
            .setTitle('🎫 GMFRS SUPPORT CENTRE')
            .setDescription(`
═══════════════════════

Welcome to the Greater Manchester Fire and Rescue Service support centre.

Please select the correct division below in order to open a support ticket.

═══════════════════════
            `)
            .addFields(
                {
                    name: '🥉 Bronze Command',
                    value: 'General support and assistance.'
                },
                {
                    name: '🥈 Silver Command',
                    value: 'Operational and management support.'
                },
                {
                    name: '🥇 Gold Command',
                    value: 'High command escalations and urgent matters.'
                }
            )
            .setFooter({
                text: 'Manchester Fire Systems'
            });

            const row = new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                .setCustomId('bronze_ticket')
                .setLabel('Bronze Command')
                .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                .setCustomId('silver_ticket')
                .setLabel('Silver Command')
                .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                .setCustomId('gold_ticket')
                .setLabel('Gold Command')
                .setStyle(ButtonStyle.Danger)

            );

            await interaction.reply({
                embeds: [embed],
                components: [row]
            });
        }
    }

    if (interaction.isButton()) {

        if (
            interaction.customId === 'bronze_ticket' ||
            interaction.customId === 'silver_ticket' ||
            interaction.customId === 'gold_ticket'
        ) {

            let category;
            let role;
            let type;

            if (interaction.customId === 'bronze_ticket') {
                category = CATEGORIES.bronze;
                role = ROLES.bronze;
                type = 'bronze';
            }

            if (interaction.customId === 'silver_ticket') {
                category = CATEGORIES.silver;
                role = ROLES.silver;
                type = 'silver';
            }

            if (interaction.customId === 'gold_ticket') {
                category = CATEGORIES.gold;
                role = ROLES.gold;
                type = 'gold';
            }

            const channel = await interaction.guild.channels.create({
                name: `${type}-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: category,

                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ['ViewChannel']
                    },
                    {
                        id: interaction.user.id,
                        allow: ['ViewChannel', 'SendMessages']
                    },
                    {
                        id: role,
                        allow: ['ViewChannel', 'SendMessages']
                    }
                ]
            });

            const embed = new EmbedBuilder()
            .setColor('#8B0000')
            .setTitle('🚒 GMFRS SUPPORT TICKET')
            .setDescription(`
═══════════════════════

Your support ticket has been created successfully.

A member of command staff will assist you shortly.

═══════════════════════
            `)
            .addFields(
                {
                    name: '👤 Opened By',
                    value: `${interaction.user}`,
                    inline: true
                },
                {
                    name: '📁 Division',
                    value: `${type.toUpperCase()} COMMAND`,
                    inline: true
                }
            )
            .setFooter({
                text: 'Manchester Fire Systems'
            });

            const buttons = new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                .setCustomId('claim_ticket')
                .setLabel('Claim')
                .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                .setCustomId('close_ticket')
                .setLabel('Close')
                .setStyle(ButtonStyle.Danger)

            );

            await channel.send({
                content: `<@&${role}>`,
                embeds: [embed],
                components: [buttons]
            });

            await interaction.reply({
                content: `✅ Your ticket has been created: ${channel}`,
                ephemeral: true
            });
        }

        if (interaction.customId === 'claim_ticket') {

            await interaction.reply({
                content: `🎫 This ticket has been claimed by ${interaction.user}.`
            });
        }

        if (interaction.customId === 'close_ticket') {

            const attachment = await transcripts.createTranscript(
                interaction.channel
            );

            const logs = await client.channels.fetch(LOG_CHANNEL);

            await logs.send({
                content: `📁 Ticket closed by ${interaction.user}`,
                files: [attachment]
            });

            await interaction.reply({
                content: '🗑️ Closing ticket...'
            });

            setTimeout(() => {
                interaction.channel.delete();
            }, 3000);
        }
    }
});

client.login(process.env.TOKEN);
