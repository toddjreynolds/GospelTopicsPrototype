/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        console.log('initialize');
        this.bindEvents();

    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {

        console.log('bindEvents');

     //   if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
           // document.addEventListener("deviceready", app.onDeviceReady, false);
     //   } else {

            $( document ).ready( app.onBrowserReady );

            /*
            window.onload = function()
            {
                app.onBrowserReady();
            }
        */


/*
            window.onload = function() {
                // Get a reference to the canvas object
                var canvas = document.getElementById('world');
                // Create an empty project and a view for the canvas:
                paper.setup(canvas);
                // Create a Paper.js Path to draw a line into it:
                var path = new paper.Path();
                // Give the stroke a color
                path.strokeColor = 'black';
                var start = new paper.Point(400, 400);
                // Move to start and draw a line from there
                path.moveTo(start);
                // Note that the plus operator on Point objects does not work
                // in JavaScript. Instead, we need to call the add() function:
                path.lineTo(start.add([ 200, -50 ]));
                // Draw the view now:
                paper.view.draw();
            }
 */

      //  }
        //document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onBrowserReady:function()
    {
        app.receivedEvent('deviceready');

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {

        console.log('onDeviceReady');
        if (typeof StatusBar !== 'undefined') {
            console.log('Has StatusBar');
            StatusBar.hide();
        }
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        te.init();
        console.log('Received Event: ' + id);
    }
};
