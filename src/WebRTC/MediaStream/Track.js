
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

exports.addEventListener = function(event) {
    return function (handler) {
        return function(track) {
            return function() {
                return track.addEventListener(event, function(ev) {return handler(ev)();});
            };
        };
    };
};
