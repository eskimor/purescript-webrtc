
exports.stop = function(track) {
    return function () {
        track.stop();
    };
};

exports.kind = function(track) {
    return function() {
        return track.kind;
    };
};
