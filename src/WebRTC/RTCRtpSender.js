
exports.track = function (sender) {
    return function () {
        return sender.track;
    };
};
