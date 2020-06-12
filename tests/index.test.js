let eventbus;
let publisher;

beforeEach(() => {
    eventbus = require('../src/index.js');
    publisher = require("./publisher.js");
});

describe('basic publish/subscribe',() => {

    let publishedMsg = "";

    test('subscribe',() => {
        eventbus.subscribe("event1",(msg) => {
            publishedMsg = msg;
        });
        expect(publishedMsg).toEqual("");
    });

    test('publish',() => {
        publisher.publishTestMessage("event1","Test Message");
        expect(publishedMsg).toEqual("Test Message");
    });
    
});

test('subscribe once', () => {

    let subOnce = 0;

    eventbus.subOnce("event2",(msg) => {
        subOnce+=msg;
    });
    publisher.publishTestMessage("event2",1);
    publisher.publishTestMessage("event2",1);

    expect(subOnce).toEqual(1);
});



test('publish/subscribe with custom scope',function(){

    let pubScope = 0;    

    this.a = 10;

    eventbus.subscribe("event3",function(b){
        pubScope += this.a + b;
    },this);

    publisher.publishTestMessage("event3",20);

    expect(pubScope).toEqual(30);
});



test('publish sticky, then subscribe',function() {

    let publishSticky = 0;

    eventbus.pubSticky("event4",10,20,30);

    this.d = 100;

    eventbus.subscribe("event4",function(a,b,c){
        publishSticky += a + b + c + this.d; 
    },this);

    expect(publishSticky).toEqual(160);
});
