
exports._onConnectionDrop = function(success) {
    return function(track) {
        return function (pc) {
            return function () {
                var hasConnected = new Promise(function (resolve) { pc.oniceconnectionstatechange =
                                                                    function (e) { return pc.iceConnectionState == "connected" && resolve();
                                                                                 };
                                                                  });
                return hasConnected.then(function() {
                    var is = function(stat, type) { return  (stat.type == type && !stat.isRemote); }; // skip RTCP
                    //var findStat = function (o, type) { return o[Object.keys(o).find(function (key) { return is(o[key], type);})];};
                    // Same as this, but above works in all browsers:
                    var findStat = function (o, type) { return Array.from(o.values()).find (function (val) { return is(val, type); }); };

                    var lastPackets = countdown = 0, timeout = 3; // seconds

                    var iv = setInterval(function() { return pc.getStats(track).then(function (stats) {
                        var packets = findStat(stats, "inboundrtp").packetsReceived;
                        countdown = (packets - lastPackets)? timeout : countdown - 1;
                        if (countdown <= 0) {
                            clearInterval(iv);
                            success();
                        }
                        lastPackets = packets;
                    });}, 1000);
                });
            };
        };
    };
};
