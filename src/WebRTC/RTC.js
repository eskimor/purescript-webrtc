// module WebRTC.RTC

exports.newRTCPeerConnection = function(ice) {
    return function() {
        return new (window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection)(ice, {
            optional: [
		            { DtlsSrtpKeyAgreement: true }
	          ]
        });
    };
};

exports.connectionState = function(pc) {
    return function() {
        return pc.connectionState;
    };
};

exports.iceConnectionState = function(pc) {
    return function() {
        return pc.iceConnectionState;
    };
};

exports.addStream = function(stream) {
    return function(pc) {
        return function() {
            pc.addStream(stream);
        };
    };
};

exports.onicecandidate = function(f) {
    return function(pc) {
        return function() {
            pc.onicecandidate = function(event) {
                f(event)();
            };
        };
    };
};

exports.onnegotiationneeded = function(f) {
    return function(pc) {
        return function() {
            pc.onnegotiationneeded = f;
        };
    };
};

exports.onconnectionstatechange = function(f) {
    return function(pc) {
        return function() {
            pc.onconnectionstatechange = function(event) {
                f(event)();
            };
        };
    };
};

exports.oniceconnectionstatechange = function(f) {
    return function(pc) {
        return function() {
            pc.oniceconnectionstatechange = function(event) {
                f(event)();
            };
        };
    };
};

exports.onaddstream = function(f) {
    return function(pc) {
        return function() {
            pc.onaddstream = function(event) {
                f(event)();
            };
        };
    };
};

exports._createOffer = function(success) {
    return function(error) {
        return function(pc) {
            return function() {
                pc.createOffer(
                    function(desc) {
                        success(desc)();
                    },
                    function(e) {
                        error(e)();
                    }
                );
            };
        };
    };
};

exports._createAnswer = function(success) {
    return function(error) {
        return function(pc) {
            return function() {
                pc.createAnswer(
                    function(desc) {
                        success(desc)();
                    },
                    function(e) {
                        error(e)();
                    }
                );
            };
        };
    };
};

exports._setLocalDescription = function(success) {
    return function(error) {
        return function(desc) {
            return function(pc) {
                return function() {
                    pc.setLocalDescription(
                        desc,
                        success,
                        function(e) {
                            error(e)();
                        }
                    );
                };
            };
        };
    };
};

exports._setRemoteDescription = function(success) {
    return function(error) {
        return function(desc) {
            return function(pc) {
                return function() {
                    pc.setRemoteDescription(
                        desc,
                        success,
                        function(e) {
                            error(e)();
                        }
                    );
                };
            };
        };
    };
};

exports._iceEventCandidate = function(nothing) {
    return function(just) {
        return function(e) {
            return e.candidate ? just(e.candidate) : nothing;
        };
    };
};

exports._addIceCandidate = function(c) {
    return function(pc) {
        return function(error) {
            return function(success) {
                return function() {
                    pc.addIceCandidate(c);
                };
            };
        };
    };
};

exports.closeRTCPeerConnection =  function(pc) {
    return function() {
        pc.close();
    };
};

exports.newRTCSessionDescription = function(s) {
    return new RTCSessionDescription(s);
};

exports.createDataChannel = function(s) {
    return function(pc) {
        return function() {
            var dc = pc.createDataChannel(s);
            dc.onopen = function() {
                console.log("OPENED");
            }
            return dc;
        };
    };
};

exports.send = function(s) {
    return function(dc) {
        return function() {
            if (dc.readyState != "open") return;
            dc.send(s);
        };
    };
};

exports.onmessageChannel = function(f) {
    return function(dc) {
        return function() {
            dc.onmessage = function(m) {
                f(m)();
            };
        };
    };
};

exports.fromRTCSessionDescription = function(description) {
    return { "sdp" : description["sdp"]
             , "type" : description["type"]
           };
};

exports._getStats = function(success) {
    return function (error) {
        return function(track) {
            return function (pc) {
                return function () {
                    return pc.getStats(track).then(success).catch(error);
                };
            };
        };
    };
};
