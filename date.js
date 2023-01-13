

const getDate = function() {
    var options = {weekday: "long", month: "long", day: "numeric" };
    var today = new Date();

    return today.toLocaleDateString("en-US", options);
};

exports.getDate = getDate;