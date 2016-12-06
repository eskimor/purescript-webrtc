
onConnectionHandlersForDrop = new Map();
exports._onConnectionDrop = function(success) {
    return function(track) {
        return function (pc) {
            return function () {
                if (typeof onConnectionHandlersForDrop.get(pc) == "undefined") {
                    console.log("Yep it was undefined - carry on ...");
                    onConnectionHandlersForDrop.set(pc, []);
                }
                var callOnConnectionHandlersDrop= function (e) {
                    var buf =[];
                    for(var i=0; i < onConnectionHandlersForDrop.get(pc).length; i++) {
                        var handler=onConnectionHandlersForDrop.get(pc)[i];
                        if(!handler())
                            buf.push(handler);
                    }
                    if (buf.length == 0) {
                        pc.oniceconnectionstatechange = null;
                        onConnectionHandlersForDrop.delete(pc);
                    }
                    else
                        onConnectionHandlersForDrop.set(pc, buf);
                };
                pc.oniceconnectionstatechange = callOnConnectionHandlersDrop;
                var hasConnected = new Promise(function (resolve) { onConnectionHandlersForDrop.get(pc).push(function () { if (pc.iceConnectionState == "connected")
                                                                                                                           { resolve();
                                                                                                                             return true;
                                                                                                                           }
                                                                                                                           else
                                                                                                                             return false;
                                                                                                                         });
                                                                  });
                return hasConnected.then(function() {
                    console.log("in hasConnected!");
                    var is = function(stat, type) {
                        var isRemoteChromium = typeof stat.bytesReceived == "undefined";
                        var isRemote_ = typeof stat.isRemote == "undefined" ? isRemoteChromium : stat.isRemote;
                        var fixedType = stat.type == "ssrc" ? "inboundrtp" : stat.type; // Fix chrome again: ssrc can also be outboundrtp but this gets checked by isRemoteChromium
                        //console.log("Checking type: " + stat.type + ", is remote: " + isRemote_);
                        return  (fixedType == type && !isRemote_);
                    }; // skip RTCP
                    //var findStat = function (o, type) { return o[Object.keys(o).find(function (key) { return is(o[key], type);})];};
                    // Same as this, but above works in all browsers:
                    var findStat = function (o, type) {
                        var arr= Array.from(o.values());
                        //console.log("Got array for finding stat:" + arr.toString());
                        //console.log("Got key array for finding stat:" + Array.from(o.keys()).toString());
                        return arr.find (function (val) { return is(val, type); });
                    };

                    var lastPackets = countdown = 0, timeout = 3; // seconds
                    console.log("ok setting interval .....");
                    var iv = setInterval(function() { return pc.getStats(track).then(function (stats) {
                        try
                        {
                            var packets = findStat(stats, "inboundrtp").packetsReceived;
                            // try {
                            //     // console.log("Found stats:");
                            //     // console.log(JSON.stringify(stats, null, 4));
                            //     var framesPerSecond = stats["inbound_rtp_video_1"].framerateMean;
                            //     var framesStdDev = stats["inbound_rtp_video_1"].framerateStdDev;
                            //     console.log("Found track, with frames per second: " + framesPerSecond);
                            //     console.log("Found track, with frames stdDev: " + framesStdDev);
                            // } catch (e) { console.log("Error when receiving framesPerSecond:" + e.message); }
                            // try {
                            //     var arr= Array.from(stats.values());
                            //     var stat=arr.find (function (val) { return (val.type == "ssrc" && val.mediaType == "video");});
                            //     // console.log(JSON.stringify(stat, null, 4));
                            //     console.log("Framerate received: " + stat.googFrameRateReceived);
                            //     console.log("Framerate decoded: " + stat.googFrameRateDecoded);
                            // }
                            // catch (e) { console.log("no chrome here ;-)");}

                            countdown = (packets - lastPackets)? timeout : countdown - 1;
                            if (countdown <= 0) {
                                clearInterval(iv);
                                success(null)();
                            }
                            else {
                                success(packets)();
                            }
                            lastPackets = packets;
                        }
                        catch(e) {
                            console.log("Error while watching connection(try): " + e.message);
                            clearInterval(iv);
                        }
                    });}, 1000);
                }).catch(function (e) {
                    console.log("Error while watching connection(promise): " + e.message);
                    clearInterval(iv);
                }); // Clean up in case of error
            };
        };
    };
};
