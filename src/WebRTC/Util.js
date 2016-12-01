
exports._onConnectionDrop = function(success) {
    return function(track) {
        return function (pc) {
            return function () {
                var hasConnected = new Promise(function (resolve) { pc.oniceconnectionstatechange =
                                                                    function (e) { return pc.iceConnectionState == "connected" && resolve();
                                                                                 };
                                                                  });
                return hasConnected.then(function() {
                    var is = function(stat, type) {
                        isRemoteChromium = typeof stat.bytesReceived == "undefined";
                        isRemote_ = typeof stat.isRemote == "undefined" ? isRemoteChromium : stat.isRemote;
                        fixedType = stat.type == "ssrc" ? "inboundrtp" : stat.type; // Fix chrome again: ssrc can also be outboundrtp but this gets checked by isRemoteChromium
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

                    var iv = setInterval(function() { return pc.getStats(track).then(function (stats) {
                        try
                        {
                            var packets = findStat(stats, "inboundrtp").packetsReceived;
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
                            clearInterval(iv);
                        }
                    });}, 1000);
                }).catch(function (e) { clearInterval(iv);}); // Clean up in case of error
            };
        };
    };
};
