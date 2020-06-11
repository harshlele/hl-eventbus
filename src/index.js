const bus = {};

module.exports = {
    /**
     * @param {string} event - event name
     * @param  {...any} args - variable number of arguments that you want to pass to the subscribing function
     */
    publish: function(event, ...args){
        if(bus[event]){
            Object.values(bus[event]).forEach(subscriber => {
                if(!subscriber.scope) subscriber.method(...args);
                else subscriber.method.call(subscriber.scope,...args);

                if(subscriber.once){
                    this.unsubscribe(event,subscriber.id);
                }
            });
        }
        
    },

    /**
     * @param {string} event - event name
     * @param {Function} callback - function to run when event is fired
     * @param {boolean} once - if true, function will be run only for the first publish
     * @param {Object} scope - custom scope that the callback function 
     * @returns {Number} id - the id of the subscription. used for unsubscribing
     */
    subscribe: function(event,callback,scope=null,once = false){
        if(!callback) return;
        
        if(!bus[event]){
            bus[event] = {};
        }
        let id = parseInt(Math.random() * 1000);
        bus[event][id] = {
            id:id,
            method:callback,
            scope:scope,
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

    /** 
     * @param {string} event - event name
     * @param {Number} id - id of the function that you want to remove
     */
    unsubscribe: function(event,id){
        for (const key in bus[event]){
            if(key == id){
                delete bus[event][key];
            }
        }
    },

    /**
     * @param {string} event - event name
     * @returns {Object} bus[event] - Object containing all subscribers registered for passed event
     */
    getAllSubscribers: function(event){
        return bus[event];
    },

    /**
     * @param {string} event - event name
     * @param {Function} callback - function that will be run when passed in event is published
     * @returns {Number} id - the id of the subscription
     */
    subOnce: function(event,callback,scope=null){
        return this.subscribe(event,callback,scope,true);
    },

    /**
     * @param {string} event - event name
     * @param  {...any} args - variable number of arguments that you want to pass to the subscribing function
     */
    pubSticky: function(event,...args){
        if(!bus.sticky) bus.sticky = {};
        if(!bus.sticky[event]) bus.sticky[event] = [];

        bus.sticky[event].push({args:args});
    },

    /**
     * @returns {Object} bus - object where all subscribers are stored
     */
    getBus: function(){
        return bus;
    }
};

