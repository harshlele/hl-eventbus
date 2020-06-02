const bus = {};

module.exports = {
    publish: function(event, ...args){
        if(bus[event]){
            Object.values(bus[event]).forEach(callback => {
                callback.method(...args);
                if(callback.once){
                    this.unsubscribe(event,callback.id);
                }
            });
        }
        
    },

    subscribe: function(event,callback,once = false){
        if(!callback) return;
        
        if(!bus[event]){
            bus[event] = {};
        }
        let id = parseInt(Math.random() * 1000);
        bus[event][id] = {
            id:id,
            method:callback,
            once:once
        };

        if(bus.sticky && Object.hasOwnProperty.call(bus.sticky,event)){
            bus.sticky[event].forEach(s => {
                this.publish(event,...s.args);
            });
            delete bus.sticky[event];    
        }

        return id;
    },

    unsubscribe: function(event,id){
        for (const key in bus[event]){
            if(key == id){
                delete bus[event][key];
            }
        }
    },

    getAllSubscribers: function(event){
        return bus[event];
    },

    subOnce: function(event,callback){
        return this.subscribe(event,callback,true);
    },

    pubSticky: function(event,...args){
        if(!bus.sticky) bus.sticky = {};
        if(!bus.sticky[event]) bus.sticky[event] = [];

        bus.sticky[event].push({args:args});
    },

    getBus: function(){
        return bus;
    }
};

