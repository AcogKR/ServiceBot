const Discord = require('discord.js')
const fs = require('fs')
const yaml = require('js-yaml')

const client = new Discord.Client();
const token = 'ODQ0NTA3MDE0MzkzODg4Nzg4.YKTacg.0YoFIYKNKLuK14TMQ7V-6EHRkyc'

const serviceList = new Map()
const commandChannelID = '844596483722706966'
const categoryId = '844523919992946688'
const serverGuild = '840625429328166921'
const serverManagerRoleID = '844523758664679444'
const image = 'https://search.pstatic.net/common/?src=http%3A%2F%2Fimgnews.naver.net%2Fimage%2F117%2F2021%2F03%2F26%2F202103261113133472_3_20210326112109697.jpg&type=sc960_832'
const link = 'https://www.github.com/Acogkr'

client.on('message', message => {
    if(message.author.bot) {
        return
    }
    let event = {
        player: {
            id: message.author.id,
            name: message.author.name,
            author: message.author,
            discriminator: message.author.discriminator
        },
        channel: {
            channel: message.channel,
            id: message.channel.id,
            type: message.channel.type,
        },
        data : {
            time: timeDate(),
            message: message.content
        }
    }

    if(event.data.message.startsWith("!stop")) {

    } else if(event.data.message.startsWith("!clear")) {
        if(event.channel.id == commandChannelID) {
            let channels = message.guild.channels.cache.filter((ch) => ch.parentID === categoryId)

            channels.forEach(channel => {
                if(channel.id != commandID) {
                    channel.delete()
                }
            })

            serviceList.forEach(entree => {
                entree.q
            })

            event.data.channel.send(new Discord.MessageEmbed()
                .setColor('#93db9f')
                .setAuthor(
                    '모든 고객센터의 기록을 정리했습니다', image, link
                )
                .setDescription('서버 고객센터들의 메세지를 삭제했습니다. \n 해당 명령어는 특정 상황에서만 사용부탁드립니다. ( 관리자 명령어 )')
            )
        }
    }
    if(event.channel.type == 'dm') {
        if(!serviceList.has(event.player.id)) {
            client.guilds.cache.get(serverGuild).channels.create(`${message.author.username} ( ${message.author.id} )`, {type: 'text'}).then(channel => {
                serviceList.set(event.player.id, {
                    player: {
                        id: event.player.id,
                        name: event.player.name,
                        author: event.player.author,
                        discriminator: event.player.discriminator
                    },
                    date: {
                        start: {
                            time: timeDate().timeData,
                            timeString: timeDate().timeString
                        },
                        end: {
                            time: timeDate().timeData,
                            timeString: timeDate().timeString
                        },
                        state: false,
                        logs: []
                    },
                    channel: {
                        id: event.channel.id,
                        type: event.channel.type
                    }
                }) // PlayerData Put Data
                channel.setParent(categoryId) // Channel Put category
            })
            let date = serviceList.get(event.player.id) // load PlayerData
            event.player.author.send(new Discord.MessageEmbed()
                .setColor('#1852bb')
                .setAuthor(
                    '고객센터 이용을 시작하셨습니다.', image, link
                )
                .setDescription('서버 고객센터에 메세지를 전달하였습니다. \n 관리자가 메세지 확인후 이 메세지로 답장을 해드립니다. ')
            ) // send Author Player Send Embed
            client.guilds.cache.get(serverGuild).channels.cache.get(date.channel.id).send(new Discord.MessageEmbed()
                .setColor('#1852bb')
                .setAuthor(
                    `${date.player.name}님이 고객센터 이용을 시작하셨습니다.`, image, link
                )
                .setDescription(`서버 고객센터에 메세지를 전달하였습니다. \n 메세지를 확인후 답장해주세요. <@${serverManagerRoleID}>`)
            ) // send manager Channel
            onSend(date, "manager", event.data.message)
            return;
        } else {
            let date = serviceList.get(event.player.id)
            onSend(date, "manager", event.data.message)
        }
    }


})


function timeDate() {
    return {
        timeData: new Date(),
        timeString: `${timeData.getFullYear()}년 ${timeData.getMonth()}월 ${timeData.getDay()}일 ${timeData.getHours()}시 ${timeData.getMinutes()}분`
    }
}

function onSend(date, type, message) {
    if(type == 'player') {
        date.player.author.send(`${date.player.name}#${date.player.discriminator} (User) : ${message}`)
        date.date.logs.push(`${date.player.name}#${date.player.discriminator} (User) : ${message}`)
    } else if(type == 'manager') {
        client.guilds.cache.get(serverGuild).channels.cache.get(date.channel.id).send(
            `${date.player.name} (Manager) : ${message}`
        )
        date.date.logs.push(`${date.player.name} (Manager) : ${message}`)
    }
}

function save(map) {
    try {
        fs.writeFileSync(`./../log/${map.date.endTime}-${map.player.name}.yml`, yaml.dump(map), 'utf8');
    } catch (err) {console.error(err)}
}

lient.login(token);