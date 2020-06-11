let eventbus;

beforeEach(() => {
    eventbus = require('./src/index.js');
});

test('basic publish/subscribe',() => {

    let publishedMsg = "";

    eventbus.subscribe("event1",(msg) => {
        publishedMsg = msg;
    });
    eventbus.publish("event1","published message");

    expect(publishedMsg).toEqual("published message");
});

test('subscribe once', () => {

    let subOnce = 0;

    eventbus.subOnce("event2",(msg) => {
        subOnce+=msg;
    });
    eventbus.publish("event2",1);
    eventbus.publish("event2",1);

    expect(subOnce).toEqual(1);
});



test('publish/subscribe with custom scope',() => {

    let pubScope = 0;

    eventbus.subscribe("event3",function(b){
        pubScope += this.a + b;
    },{a:10});

    eventbus.publish("event3",20);

    expect(pubScope).toEqual(30);
});



test('publish sticky, then subscribe',() => {

    let publishSticky = 0;

    eventbus.pubSticky("event4",10,20,30);

    eventbus.subscribe("event4",function(a,b,c){
        publishSticky += a + b + c + this.d; 
    },{d:100});

    expect(publishSticky).toEqual(160);
});
