const eventbus = require("./src/index.js");

let publishedMsg = ""

//name of test
test('basic publish/subscribe',() => {
    //subscribe, then publish message
    eventbus.subscribe("event1",(msg) => {
        publishedMsg = msg;
    });
    eventbus.publish("event1","published message");

    expect(publishedMsg).toEqual("published message");
});