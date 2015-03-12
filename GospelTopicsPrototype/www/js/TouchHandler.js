/**
 * Created by michaelking on 11/15/14.
 */
te.touch = {

    name:"Touch Handler",
    hammertime: null,
    debug:false,

    initMouseHandling: function () {
        te.dragged = null;
        //var canvasPort = $("#viewport");
        //var hammertime = new Hammer.Manager(canvasPort.get(0));
        //hammertime.add(new Hammer.Pan({ threshold: 5, pointers: 0 }));

        //var hammertime = new Hammer(te.canvas);
       // hammertime.on('panstart', te.touch.isStartDrag);
        //hammertime.on('panmove', te.touch.isDragging);
       // hammertime.on('panend', te.touch.isDropped);
      //  hammertime.on('tap', te.touch.isClicked);

      //  hammertime.on('pinchstart', te.touch.isPinched);
        //hammertime.add(new Hammer.Pan({threshold: 1, pointers: 0}));


        var mc = new Hammer.Manager(te.canvas);

        mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));

        mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
        mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(mc.get('pan'));
        mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc.get('pan'), mc.get('rotate')]);

        mc.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
        mc.add(new Hammer.Tap());

        mc.on("panstart", te.touch.isStartDrag);
        mc.on("panmove", te.touch.isDragging);
        mc.on("panend", te.touch.isDropped);

        //mc.on("rotatestart rotatemove", onRotate);
        mc.on("pinchstart pinchmove", te.touch.isPinched);
        mc.on("pinchend", te.touch.isPinchedEnd);


        //mc.on("swipe", onSwipe);
        mc.on("tap", te.touch.isClicked);
        mc.on("doubletap", te.touch.isClicked);


        this.hammertime = mc;
        //this.hammertime = hammertime;


    },
    isPinched:function(e)
    {

        if(e.pointers.length < 2)
        {
            te.zooming = false;
            return;
        }


        if(te.editMode)
        {
            var n = te.touch.getHit(e.center.x, e.center.y);
            if (n != null) {
                te.centerZoomPoint.x = e.center.x;
                te.centerZoomPoint.y = e.center.y;

                if(e.type == "pinchstart") {
                    //console.log("pinch scale", e.scale, "offsetDirection", e.offsetDirection);
                    te.startPinchPoint1 = new paper.Point(e.pointers[0].screenX, e.pointers[0].screenY);
                    te.startPinchPoint2 = new paper.Point(e.pointers[1].screenX, e.pointers[1].screenY);
                    te.startPinchZoom = n.radius;
                }

                var distanceStart = te.touch.getDistance2Points(te.startPinchPoint1.x, te.startPinchPoint1.y, te.startPinchPoint2.x, te.startPinchPoint2.y);
                var distanceEnd = te.touch.getDistance2Points(e.pointers[0].screenX, e.pointers[0].screenY, e.pointers[1].screenX, e.pointers[1].screenY);
                var per = distanceEnd / distanceStart;

                n.radius = te.startPinchZoom - ( (1- per) * 10);

                n.startRadius = n.radius/ te.currentZoom;
                te.needReDraw = true;
            }

            return;
        }
        ///end edit mode

        if(te.panning)
        {
            //te.pan();
            te.panning = false;

        }

        if(e.type == "pinchstart") {
            //console.log("pinch scale", e.scale, "offsetDirection", e.offsetDirection);
            te.startPinchPoint1 = new paper.Point(e.pointers[0].screenX, e.pointers[0].screenY);
            te.startPinchPoint2 = new paper.Point(e.pointers[1].screenX, e.pointers[1].screenY);
            te.startPinchZoom = te.currentZoom;
        }

        var distanceStart = te.touch.getDistance2Points(te.startPinchPoint1.x, te.startPinchPoint1.y, te.startPinchPoint2.x, te.startPinchPoint2.y);
        var distanceEnd = te.touch.getDistance2Points(e.pointers[0].screenX, e.pointers[0].screenY, e.pointers[1].screenX, e.pointers[1].screenY);
        var per = distanceEnd / distanceStart;

        /*
        te.touches = [];
        for (var i = 0; i < e.pointers.length; ++i) {
            te.touches.push(new paper.Point(e.pointers[i].screenX, e.pointers[i].screenY));
        }
        */
        te.selectedNode = null;
        te.zooming = true;
        te.zoom( te.startPinchZoom * e.scale, e.center.x, e.center.y );
        //te.zoom( te.startPinchZoom - (1- per), e.center.x, e.center.y );
       // console.log("currentZoom:"+te.currentZoom+", per:"+per + ", startZoom:"+ te.startPinchZoom + ", x:" + e.center.x + ", y:" + e.center.y);
    },
    isPinchedEnd:function(e)
    {
        te.zooming = false;

        te.vector.x = 0;
        te.vector.y = 0;

    },
    // Toggle children on click.
    isClicked: function (e) {

        console.log("clicked", e.tapCount, e.center.x, e.center.y);


        if(e.tapCount == 2)
        {
            te.renderer.debug = !te.renderer.debug;
            te.renderer.render();
           // te.editMode = !te.editMode;

        }

        var hitButton = false;
        // ctx.drawImage(te.homeImg, 0, 0, 94, 95, 40, 40, 94/2, 95/2);// d.radius, d.radius)
        //look for home hit

        if(e.center.x > te.homeBtnX && e.center.x < te.homeBtnX+te.homeSize && e.center.y > te.homeBtnY && e.center.y < te.homeBtnY+te.homeSize)
        {

            /*
             if(te.touch.debug)
             {
             te.touch.editMode = !te.touch.editMode;
             }else
             {
             te.homeBtnHit();
             }
             */
            te.homeBtnHit();
            hitButton = true;
            te.selectedNode = null;

        }else if(e.center.x > 40 && e.center.x < 100 && e.center.y > 40 && e.center.y < 88)
        {
            var kids = [];
            te.touch.devStringNode(te.rootJSON, kids);

            var home = {display_name:"home".display_name, id:"home", children:kids, startX:0, startY:0, startRadius:0};
            console.log(JSON.stringify(kids.pop()));
            hitButton = true;
        }







        var n = te.touch.getHit(e.center.x, e.center.y);
        if (n != null && !hitButton) {
           te.nodeHit(n, e.tapCount);
            console.log(n.display_name)
        }
        te.vector.x = 0;
        te.vector.y = 0;

    },
    devStringNode: function (node, ary) {
        var kids = [];
        if (node.children && node.children.length != 0) {

            for (var i = 0; i < node.children.length; ++i) {
                var kid = node.children[i];
                te.touch.devStringNode(kid, kids);

            }
        }

        ary.push({display_name:node.display_name, id:node.id, children:kids, startX:node.startX, startY:node.startY, startRadius:node.startRadius});
    },

    isStartDrag: function (e) {
        if(e.pointers.length > 1)
        {
            te.panning = false;
            return;
        }

        if(te.zooming)
        {
            return;
        }

        if(te.editMode)
        {

            te.dragged = te.touch.getHit(e.center.x, e.center.y);
            if(te.dragged)
            {
                te.startPanPoint = new paper.Point(te.dragged.x, te.dragged.y);
            }else
            {
                te.startPanPoint = new paper.Point(e.center.x, e.center.y);
            }
            return;
        }

        te.mouseX = e.center.x;
        te.mouseY = e.center.y;

        te.startPanPoint = new paper.Point(e.center.x, e.center.y);
        te.currentPanPoint = te.startPanPoint.clone();
        te.startPanPosition = te.currentPosition.clone();

        te.panning = true;
        te.pan();

        return false
    },
    isDragging: function (e)
    {
        if(e.pointers.length > 1)
        {
            te.panning = false;
            return;
        }
        te.mouseX = e.center.x;
        te.mouseY = e.center.y;



        if(te.editMode)
        {
            if (te.dragged !== null) {
                te.dragged.x = e.center.x;
                te.dragged.y = e.center.y;

                te.dragged.startX = (te.dragged.x - te.currentPosition.x)/te.currentZoom;
                te.dragged.startY = (te.dragged.y - te.currentPosition.y)/te.currentZoom;
                te.needReDraw = true;
            }
            return;
        }

        te.currentPanPoint.x = e.center.x;
        te.currentPanPoint.y = e.center.y;

        te.vector.x =  e.velocityX ;
        te.vector.y = e.velocityY;


        te.panning = true;
        te.pan();

        return false
    },

    isDropped: function (e) {

        if(te.editMode && te.dragged !== null)
        {

            var xdis =  (te.startPanPoint.x - e.center.x) / te.currentZoom;
            var ydis =  (te.startPanPoint.y - e.center.y) / te.currentZoom;

            te.touch.moveKids(te.dragged, xdis, ydis);
            te.updateModel();
            //te.needReDraw = true;
        }


        if(te.panning) {

            te.panning = false;
            te.vector.x = e.velocityX * 3.5;
            te.vector.y = e.velocityY * 3.5;
        }
        te.dragged = null;

        return false
    },

    getHit: function (px, py) {

        for (var i = 0; i < te.hitNodes.length; ++i) {
            var n = te.hitNodes[i];
            if (this.nodeIsHit(n, px, py)) {
                return n;
            }
        }

        return null;
    },
    nodeIsHit:function(n,px,py)
    {
        var distance = this.getDistance2Points(px,py, n.x, n.y);
        return (distance <= n.radius);
    },
    getDistance2Points:function(x1, y1, x2, y2)
    {
        var dx = x1 - x2;
        var dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    },
    moveKids: function (node, xdis, ydis) {
        if (node.hasKids) {
            for (var i = 0; i < node.allChildren.length; ++i) {
                var kid = node.allChildren[i];
                kid.startX -= xdis;
                kid.startY -= ydis;

                this.moveKids(kid, xdis, ydis);
            }
        }


    }

}