/*jslint devel: true, node: true, plusplus: true, nomen: true, bitwise: true*/
"use strict";

(function () {
    var //Promise = require('promise'),
        //osu = require('osu-api'),
        //playerFormation = require('./playerFormation'),
        calculations = require('./calculations'),
        serverManagement = require('./serverManagement'),
        beatmapManagement = require('./beatmapManagement');

    module.exports.sendRecentUpdate = function (mybot, user, obj, bMap, calculatedAcc, db, osu, callback) {
        beatmapManagement.getBeatmapset(obj[0].beatmap_id, osu)
            .then(function (beatmapsetId) {
                user.trackedBy.forEach(function (trackedBy, i) {
                    serverManagement.findServer(trackedBy, db, function (item) {
                        if (item[0].trackStarted) {
                            mybot.channels.get(item[0]._id).sendMessage(" ", {embed: {
                                color: 3447003,
                                author: {
                                    name: user.name,
                                    url: 'https://osu.ppy.sh/u/' + user._id,
                                    icon_url: 'http://s.ppy.sh/a/' + user._id
                                },
                                thumbnail: {
                                    url: 'https://b.ppy.sh/thumb/' + beatmapsetId + 'l.jpg'
                                },
                                fields: [
                                    {
                                        name: '**Map**',
                                        value: '[' + bMap.artist + " - " + bMap.title + " [" + bMap.diff + "]](https://osu.ppy.sh/b/" + obj[0].beatmap_id + ')',
                                        inline: false
                                    },
                                    {
                                        name: '**Combo **',
                                        value: obj[0].maxcombo + '/' + bMap.maxcombo,
                                        inline: true
                                    },
                                    {
                                        name: "**Mods **",
                                        value: calculations.getMod(obj[0].enabled_mods).toString(),
                                        inline: true
                                    },
                                    {
                                        name: "**Accuracy **",
                                        value: calculatedAcc + " % (**" + obj[0].rank + "**)",
                                        inline: true
                                    },
                                    {
                                        name: "**Misses **",
                                        value: obj[0].countmiss,
                                        inline: true
                                    }
                                ]
                            }});
                        }
                    });
                    if (i === user.trackedBy.length - 1) {
                        callback();
                    }
                });
            });
    };

    module.exports.printTopScoresUpdate = function (mybot, osu, db, userObj, score, index, callback) {
        console.log("as ce");
        beatmapManagement.getBeatmapData(score.beatmap_id, osu, function (obj) {
            userObj.serverId.forEach(function (serverId, i) {
                serverManagement.findServer(serverId, db, function (item) {
                    if (item[0].botStarted) {
                        /*mybot.channels.get(item[0]._id).sendMessage("**" + userObj.name +
                            "**: \nNew Top Score **#" + (index + 1) +  "**: \nMap: **" + obj.artist + " - " + obj.title + " [" + obj.diff + "] " +
                            "\n(https://osu.ppy.sh/b/" + score.beatmap_id + ")**\nCombo: **" + score.maxcombo + "x** Misses: **" + score.countmiss +
                            "**\nGrade: **" + score.rank + "** Accuracy: **" + parseFloat(calculations.getAcc(score.count300, score.count100, score.count50, score.countmiss)).toFixed(2) +
                            " %** \nMods: **" + calculations.getMod(score.enabled_mods) + "** Weighted: **" + score.pp + "**");*/
                        mybot.channels.get(item[0]._id).sendMessage(" ", {embed: {
                            color: 3447003,
                            author: {
                                name: userObj.name,
                                url: 'https://osu.ppy.sh/u/' + userObj._id,
                                icon_url: 'http://s.ppy.sh/a/' + userObj._id
                            },
                            fields: [
                                {
                                    name: 'New top score **#' + (index + 1) + '**:',
                                    value: '[' + obj.artist + " - " + obj.title + " [" + obj.diff + "]](https://osu.ppy.sh/b/" + score.beatmap_id + ')',
                                    inline: false
                                },
                                {
                                    name: '**Combo **',
                                    value: score.maxcombo + 'x ' + score.countmiss + ' misses',
                                    inline: true
                                },
                                {
                                    name: "**Mods **",
                                    value: calculations.getMod(score.enabled_mods).toString(),
                                    inline: true
                                },
                                {
                                    name: "**Accuracy **",
                                    value: parseFloat(calculations.getAcc(score.count300, score.count100, score.count50, score.countmiss)).toFixed(2) + " % (**" + score.rank + "**)",
                                    inline: true
                                },
                                {
                                    name: "**Weighted **",
                                    value: score.pp,
                                    inline: true
                                }
                            ]
                        }});
                    }
                });
                if (i === userObj.serverId.length - 1) {
                    callback();
                }
            });
        });
    };

    module.exports.printUpdateMessage = function (mybot, userObj, obj, accuracyChange, total, db, callback) {
        userObj.serverId.forEach(function (server, i) {
            i++;
            serverManagement.findServer(server, db, function (item) {
                if (item[0].botStarted && ((Math.round(calculations.checkForChanges(userObj.pp, obj.pp_raw) * 100) / 100) > 1)) {
                    console.log("PP Gained by" + userObj.name);
                    /*global getChar*/
                    /*mybot.channels.get(item[0]._id).sendMessage("**" + userObj.name +
                        '**:\n**' + calculations.getChar(userObj.pp, obj.pp_raw) + Math.abs(Math.round(calculations.checkForChanges(userObj.pp, obj.pp_raw) * 100) / 100) + '** pp **\n' +
                        calculations.getChar(obj.pp_rank, userObj.rank) + Math.abs(Math.round(calculations.checkForChanges(userObj.rank, obj.pp_rank) * 100) / 100) + '** Ranks \n**' +
                        calculations.getChar(parseFloat(userObj.accuracy), parseFloat(obj.accuracy)) + Math.abs(parseFloat(accuracyChange)).toFixed(2) + "%** Accuracy**\n" +
                        (total.ppGained).toFixed(2) + '** pp this session **\n' +
                        total.rank + '** ranks this session');*/
                    mybot.channels.get(item[0]._id).sendMessage(" ", {embed: {
                        color: 3447003,
                        author: {
                            name: userObj.name,
                            url: 'https://osu.ppy.sh/u/' + userObj._id,
                            icon_url: 'http://s.ppy.sh/a/' + userObj._id
                        },
                        fields: [
                            {
                                name: ' ',
                                value: calculations.getChar(userObj.pp, obj.pp_raw) + Math.abs(Math.round(calculations.checkForChanges(userObj.pp, obj.pp_raw) * 100) / 100) + '** pp **\n' +
                                    calculations.getChar(obj.pp_rank, userObj.rank) + Math.abs(Math.round(calculations.checkForChanges(userObj.rank, obj.pp_rank) * 100) / 100) + '** Ranks \n**' +
                                    calculations.getChar(parseFloat(userObj.accuracy), parseFloat(obj.accuracy)) + Math.abs(parseFloat(accuracyChange)).toFixed(2) + "%** Accuracy**\n" +
                                    (total.ppGained).toFixed(2) + '** pp this session **\n' + total.rank + '** ranks this session',
                                inline: false
                            }
                        ]
                    }});
                }
            });
            if (i === userObj.serverId.length - 1) {
                callback();
            }
        });
    };

}());
