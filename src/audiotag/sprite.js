/*global define, RSVP*/
define([],function( ) {
    'use strict';

    var Sprite = function( id, context ) {
            this.id = id;
            this.context = context;
        }
    ;

    Sprite.prototype = {
        play: function() {
            this.context.playSprite(this.id);
        },
        stop: function() {
            this.context.stop();
        },
        getLength: function() {
            throw "Not Yet Implemented";
        },
        loop: function() {
            throw "Not Yet Implemented";
        }
    };

    return Sprite;

} );