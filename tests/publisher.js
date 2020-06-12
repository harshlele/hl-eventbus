const eventbus = require("../src/index.js");

module.exports = {
    publishTestMessage: function(event,msg) {
        eventbus.publish(event,msg);
    },

}