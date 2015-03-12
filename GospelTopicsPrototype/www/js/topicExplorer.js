/**
 * Created by michaelking on 11/5/14.
 */

var te =
{
    name: "TopicExplorer",

    //4BB1E2
    jsonFileName: "topics10.json",//"topics4.json",//"topics2_good.json",topics2_dev  ["#FFFFFF", "#51be97", "#45b0e4", "#C2537D", "#7ACDD5", "#E67644", "#A3B26F", "#7F6FB0", "#4473B9", "#EF5659", "#F89E24"],
    //colorCat: ["#FFFFFF",  "#45b0e4", "#C2537D", "#7ACDD5", "#E67644", "#A3B26F", "#7F6FB0", "#4473B9", "#EF5659", "#F89E24"],
    colorCat: ["#FFFFFF",  "#4BB1E2", "#C0557D", "#7DCDD4", "#E4764B", "#A3B172", "#7F71AE", "#4576B7", "#ED565C", "#F89E24"],
    fpstxt: "",
    running: true,

    selectedTopic: 0,
    selectedNode: null,
    viewState: 0,

    mouseX: 0,
    mouseY: 0,

    //sim vars
    width: 0,
    height: 0,
    simWidth: 0,
    simHeight: 0,
    tweenTime: 0.75,

    deadZone: 0,// middle part of the donought;
    bannerOnTopHeight: 105,//the html header mast height

    //size of circles
    maxRatio: 0.03,
    minRatio: 0.40,

    maxRadius: 0,

    minRadius: 16,//16
    minRadiusKid:8, // 8

    maxDepth:0,

    rootJSON: null,
    //all nodes in the selected node dataset
    nodes: [],
    //all nodes that should be painted to the screen
    renderNodes: [],
    //all nodes that are touchable
    hitNodes: [],
    //all nodes flat
    nodesFlat:null,

    canvas: null,
    context: null,
    //helpers
    nodeUtils: null,
    tickEQ: null,
    stats: null,
    time0: null,
    time1: null,


    fps: null,
    fpsCount: 0,
    fpsAverage: 0,

    hammerTime: null,

    touches:null,

    vector: null,

    startPinchPoint1:null,
    startPinchPoint2:null,
    startPinchZoom:0,

    startPanPoint: null,
    startPanPosition:null,
    currentPanPoint: null,


    panning: false,
    zooming:false,
    debugLbl: null,
    damp: 0.97,
    nodeHistory: [],
    selectedNodeLbl: null,
    editMode:false,
    dragged:null,

    homeImg: null,
    dottedLinesImg:null,
    
    // Changed from null to false to try to hide the view buttons
    viewBtnImg:false,
    textImg:null,


    zoomLowerLimit:0.5,
    zoomUpperLimit:50.0,

    //currentZoom goes from 0. to 1
    currentZoom:0.5,
    currentPosition:null,

    centerZoomPoint:null,

    needReDraw:true,

    homeBtnX:700,
    homeBtnY:950,
    homeSize:45,

    init: function ()
    {




        te.homeImg = document.getElementById('homeImg');
        te.dottedLinesImg = document.getElementById('dottedLines');
        te.viewBtnImg = document.getElementById('viewImg');
        te.textImg = document.getElementById('textImg');


        this.selectedNodeLbl = document.getElementById('selectedNodeLbl');
        this.time0 = Date.now();

        // var canvas = document.getElementById('world');

        te.canvas = $("#world").attr("width", this.simWidth).attr("height", this.simHeight)[0];
        te.context = this.canvas.getContext("2d");

        te.tempCanvas = $("#temp").attr("width", this.simWidth).attr("height", this.simHeight)[0];
        te.tempContext = this.tempCanvas.getContext("2d");

        te.touches = [];

        te.currentPosition = new paper.Point(0, 0);
        te.vector = new paper.Point(0, 0);// new paper.Point(view.size.width * Math.random(), view.size.height * Math.random());
        te.centerZoomPoint = new paper.Point(0, 0);



        window.addEventListener('orientationchange', te.doOnOrientationChange);



        $.getJSON(te.jsonFileName, {}).done(te.jsonLoaded);


    },
    doOnOrientationChange: function () {

        te.width = $(window).width();
        //te.height = $(window).height();
        //te.width = window.innerWidth;
        //te.height = window.innerHeight;
        if(te.width > $(window).height())
        {
            te.width = 1024;
            te.height = 768;
        }else
        {
            te.width = 768
            te.height = 1024;
        }
        te.simWidth = te.width;
        te.simHeight = te.height;


        $("#world").attr("width", te.simWidth).attr("height", te.simHeight);
        $("#temp").attr("width", te.simWidth).attr("height", te.simHeight);

        console.log("doOnOrientationChange: width:" + te.width + " height:" + te.height);

        te.context.textAlign = "center";
       // te.context.font = "16px ZoramldsLat-Bold";
        te.needReDraw = true;

    },

    jsonLoaded: function (data, textStatus, jqXHR) {

        te.doOnOrientationChange();

        te.rootJSON = data;
        //we do this just to set inital values
        te.nodeUtils.initNodes();
        //te.nodes = te.nodeUtils.initNodes();
        //te.nodeUtils.showLanding();
        //te.update();
        te.touch.initMouseHandling();

        te.updateModel();

        TweenLite.ticker.addEventListener("tick", te.tick);

    },
    zoom:function(amount, locX, locY)
    {

        //console.log("zoom:" + amount+ ", locX:"+ locX+ ", locY:"+ locY );

        te.centerZoomPoint.x = locX;
        te.centerZoomPoint.y = locY;


        // Get the position of the mouse with respect to
        //  the origin of the map (or image or whatever).
        // Let us call these the map coordinates
        var mouse_x = locX - te.currentPosition.x;
        var mouse_y = locY - te.currentPosition.y;

        var lastzoom = te.currentZoom || 0.001;

        // your zoom function
        te.currentZoom = (amount);

        te.currentZoom = Math.max(te.zoomLowerLimit, Math.min(te.zoomUpperLimit, te.currentZoom));

        // Get the position of the mouse
        // in map coordinates after scaling
        var newx = mouse_x * (te.currentZoom/lastzoom);
        var newy = mouse_y * (te.currentZoom/lastzoom);

        // reverse the translation caused by scaling
        te.currentPosition.x += mouse_x - newx;
        te.currentPosition.y += mouse_y - newy;
        if(isNaN(te.currentPosition.x))
        {
            console.log("isNaN");
        }
        te.checkLimits();
        te.updateModel();

    },
    pan:function()
    {

        if (te.panning && !te.zooming) {
            te.currentPosition.x = te.startPanPosition.x - (te.startPanPoint.x - te.currentPanPoint.x );
            te.currentPosition.y = te.startPanPosition.y - (te.startPanPoint.y - te.currentPanPoint.y );
            te.checkLimits();
            te.updateModel();
        }

    },

    checkLimits:function()
    {
        //te.currentPosition.x = Math.max(0, te.currentPosition.x);
        //te.currentPosition.y = Math.max(0, te.currentPosition.y);

    },



    updateModel: function () {


        te.nodes = [];
        te.hitNodes = [];
        if(this.nodesFlat == null) {
            this.nodesFlat= te.nodeUtils.flatKids(te.rootJSON);// [te.rootJSON.children[0]];// te.nodeUtils.flatKids(te.rootJSON);
        }
        te.renderNodes = [];
        var kidInView = false;
        var parentInView = false;

        //we have to update all node locations first
        for (var i = 0; i < this.nodesFlat.length; ++i) {
            var kid = this.nodesFlat[i];
            //te.nodeUtils.changeStateOnNode(kid, te.NODE_STATE_SHOW_KIDS, true)
            kid.radius = kid.startRadius * te.currentZoom;
            kid.x = (kid.startX * te.currentZoom) + te.currentPosition.x;
            kid.y = (kid.startY * te.currentZoom) + te.currentPosition.y;

        }

        for (var i = 0; i < this.nodesFlat.length; ++i)
        {
            var kid = this.nodesFlat[i];
            kidInView = te.nodeIsInView(kid);
            parentInView = te.nodeIsInView(kid.parent) ;

            //
            if(kidInView || parentInView) {
                if (kid.radius > te.minRadius) {

                    kid.kidPer = 1;
                    kid.alpha = 1;
                    te.hitNodes.push(kid);
                    te.renderNodes.push(kid);

                }else if (kid.radius >=  te.minRadiusKid) {
                    var parent = kid.parent;
                    if(parent) {

                         var per = 1 - ((kid.radius - te.minRadiusKid) / (te.minRadius - te.minRadiusKid));
                        var xDistance =  (parent.startX + kid.kidX) - kid.startX;
                        var yDistance =  (parent.startY + kid.kidY) - kid.startY;
                        var alphaDistance = 1 - kid.kidAlpha;

                        kid.x = (((per * xDistance) + kid.startX) * te.currentZoom) + te.currentPosition.x;
                        kid.y = (((per * yDistance) + kid.startY) * te.currentZoom) + te.currentPosition.y;
                        kid.alpha = (alphaDistance * (1-per)) + kid.kidAlpha;

                        kid.kidPer = 1- per;
                        te.hitNodes.push(kid);
                        te.renderNodes.push(kid);

                    }

                    //te.hitNodes.push(kid);
                    //te.renderNodes.push(kid);
                }
            }
        }
       // te.nodeUtils.changeStateOnNode(node, te.NODE_STATE_SELECTED, true);


        /*
        if (node == te.rootJSON) {
            te.selectedNodeLbl.innerHTML = "";

        } else {
            te.selectedNodeLbl.innerHTML = node.display_name;
            $("#selectedNodeLbl").css('color', te.colorCat[node.cluster]);

        }
        */

        te.needReDraw = true;

    },
    nodeIsInView:function(kid)
    {
        var inViewLeftRight = (kid.x - kid.radius < te.simWidth) && (kid.x + kid.radius  > 0 );
        var inViewTopBottom = (kid.y - kid.radius < te.simHeight) && (kid.y + kid.radius > 0 );

        return (inViewLeftRight && inViewTopBottom);
    },

    tick: function (e) {

        if (!te.running || !te.needReDraw) {

            return;
        }


        te.renderer.render();


        if (!te.panning && !te.zooming)
        {

            if (Math.abs(te.vector.x) < 0.1 && Math.abs(te.vector.y) < 0.1) {
                te.vector.x = 0;
                te.vector.y = 0;
                te.needReDraw = false;
            }else {

                te.currentPosition.x -= te.vector.x;
                te.vector.x *= te.damp;

                te.currentPosition.y -= te.vector.y;
                te.vector.y *= te.damp;
                te.checkLimits();
                te.updateModel();
            }

        }



        te.time1 = Date.now();
        te.fpsCount++;
        te.fpsAverage += (te.time1 - te.time0);

        te.time0 = te.time1;
        if (te.fpsCount > 60) {
            //te.fps.text(Math.round(1000 / (te.fpsAverage / te.fpsCount)));
            te.fpstxt = (Math.round(1000 / (te.fpsAverage / te.fpsCount)));
            te.fpsCount = 0;
            te.fpsAverage = 0;

            //te.debugLbl.text(te.selectionStartX + ", " + te.selectionSplitWidth);

        }

    },


    dragWasDropped: function () {


        var distance = te.touch.getDistance2Points(te.startPanPoint.x, te.startPanPoint.y, te.mouseX, te.mouseY);
        if (distance > 100 && te.nodeHistory.length > 1) {
            te.nodeHistory.pop();
            te.selectNode(te.nodeHistory.pop());

        } else {
            te.selectNode(te.nodeHistory.pop());
        }

    },
    nodeHit:function(node, count)
    {
        if(count < 2) {



            var zoomRage = te.zoomUpperLimit - te.zoomLowerLimit;
            var zoomPart = zoomRage/(te.maxDepth+14);
            var gotoZoom = ((node.depth+1) * zoomPart);

            //var willBeKidx = te.currentPosition.x + (node.startX * te.currentZoom)
            //var willBeKidy = te.currentPosition.y +  (node.startY * te.currentZoom);
            var willBeKidx =  (node.startX * gotoZoom)
            var willBeKidy =  (node.startY * gotoZoom);


            var centerX = te.simWidth / 2;
            var centerY = te.simHeight / 2;
            //var xspot = te.currentPosition.x + (centerX - node.x);
            //var yspot = te.currentPosition.y + (centerY - node.y);

            var xspot =  (centerX - willBeKidx);
            var yspot =  (centerY - willBeKidy);

            var ttime = 0;
            TweenLite.to(te.currentPosition, te.tweenTime + ttime, {x: xspot, y: yspot, onUpdate: te.updateModel});
            TweenLite.to(te, te.tweenTime + ttime, {currentZoom:gotoZoom, onUpdate:te.updateModel});


            te.selectedNode = node;
        }

    },

    homeBtnHit: function () {

        TweenLite.to(te.currentPosition, te.tweenTime, {x:0, y:0});
        TweenLite.to(te, te.tweenTime, {currentZoom:te.zoomLowerLimit, onUpdate:te.updateModel});
    }

};
te.VIEW_LANDING = 1;
te.VIEW_TOPIC_SELECTED = 2;

te.NODE_STATE_SELECTED = "NODE_STATE_SELECTED";
te.NODE_STATE_SHOW_KIDS = "NODE_STATE_SHOW_KIDS";
te.NODE_STATE_CHILD = "NODE_STATE_CHILD";
te.NODE_STATE_DYING = "NODE_STATE_DYING";
te.NODE_STATE_BEGIN = "NODE_STATE_BEGIN";