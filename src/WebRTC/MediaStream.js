// module WebRTC.MediaStream

var Adapter = (typeof require === 'function' && require('webrtc-adapter'))
        || (typeof window === 'object' && window.adapter);

exports._getUserMedia = function(success) {
    return function(error) {
        return function(constraints) {
            return function() {
                var mediaDevicesGetUserMedia = null;
                if (typeof navigator.mediaDevices != "undefined") {
                    mediaDevicesGetUserMedia =
                        function (constraints, success, error) {
                            navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
                        };

                }
                else {
                    mediaDevicesGetUserMedia = null;
                }
                var getUserMedia = mediaDevicesGetUserMedia
                        || navigator.getUserMedia
                        || navigator.webkitGetUserMedia
                        || navigator.mozGetUserMedia;

                return getUserMedia.call(
                    navigator,
                    constraints,
                    function(r) { success(r)(); },
                    function(e) { error(e)(); }
                );
            };
        };
    };
};

exports.clone = function(stream) {
    return function() {
        return stream.clone();
    };
};
exports.createObjectURL = function(blob) {
    return function() {
        return URL.createObjectURL(blob);
    };
};

exports.getTracks = function(stream) {
    return function() {
        return stream.getTracks();
    };
};
