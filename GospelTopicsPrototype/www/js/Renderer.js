/**
 * Created by michaelking on 11/15/14.
 */
te.renderer = {

    name: "Renderer",
    debug: true,

    TO_RADIANS: Math.PI / 180,
    grd: null,

    paperRender: function () {
        // Draw the view now:
        paper.view.draw();
    },
    render: function () {


        var d;
        var per = 0;

        //te.context.fillStyle = "#0000ff";
        //te.context.fillRect(0, 0, te.width, te.height);

        // te.tempContext.fillStyle = "#00ffff";
        //  te.tempContext.fillRect(0, 0, te.tempCanvas.width, te.tempCanvas.height);
        //te.tempContext.fillRect(0, 0, 20, 20);

        //te.tempContext.fill();

        var ctx = te.context;
        // ctx.clearRect(0, 0, te.width, te.height);
        ctx.globalAlpha = 1;
        if (this.grd == null) {
            var grd = ctx.createRadialGradient(te.width / 2, te.height / 2, 0, te.width / 2, te.height / 2, Math.max(te.width / 2, te.height / 2));
            grd.addColorStop(0, "#282828");
            grd.addColorStop(1, "#404040");
            this.grd = grd;
        }
        ctx.fillStyle = this.grd;
        ctx.fillRect(0, 0, te.width, te.height);


        if(d = te.nodesFlat.length) {
            for (var i = 0; i < te.nodesFlat.length; ++i) {
                d = te.nodesFlat[i];
                if (d.depth == 0) {
                    per = 1- d.children[0].kidPer;
                    break;
                }
            }
        }


        ////lines now 664 × 664
        var lineSixze = 664;
        ctx.globalAlpha = per;
        ctx.drawImage(te.dottedLinesImg, 0, 0, lineSixze, lineSixze, (te.width / 2) - (lineSixze/2)  + te.currentPosition.x , (te.height / 2)- (lineSixze/2) + te.currentPosition.y  , lineSixze * te.currentZoom * 2.0, lineSixze * te.currentZoom * 2.0);// d.radius, d.radius)

        ////end lines
        ////text now 768 × 226
        var th = 226;
        var tw = 768;

        var xloc = (te.width / 2) - (tw/2)  + te.currentPosition.x ;
        var yloc = (te.height * te.currentZoom * 2.0) - (th * te.currentZoom * 2.0) + te.currentPosition.y;
        ctx.drawImage(te.textImg, 0, 0, tw, th, xloc, yloc, tw * te.currentZoom * 2.0, th * te.currentZoom * 2.0);// d.radius, d.radius)
        ctx.globalAlpha = 1;
        ////end lines



        for (var i = 0; i < te.renderNodes.length; ++i) {
             d = te.renderNodes[i];
            if (d.kidPer > 0.5) {
                te.renderer.drawLineToParent(d, ctx)
            }
        }

        te.renderNodes = te.renderNodes.sort(this.compare);

        //clear old templetes
        for (var i = 0; i <  te.nodesFlat.length; ++i) {
            var kid =  te.nodesFlat[i];
            kid.template = null;
        }


        /*
         var d = te.renderNodes[0];
         var temp = this.getTemplete(d);
         //this.drawGridentCircle(d, ctx, d.x, d.y);
         ctx.drawImage(temp, 20, 20);
         return;
         */

        for (var i = 0; i < te.renderNodes.length; ++i) {
            d = te.renderNodes[i];

            if(this.debug)
            {
                te.renderer.drawCircle(d, ctx);
            }else {
                if (d.depth == 0) {
                    //this.drawCircle(d, ctx);
                    this.drawGridentCircle(d, ctx, d.x, d.y)
                } else {

                    if (d.parent.template == null) {
                        // console.log("building templete for:" + d.cluster + ", Depth:" + d.depth);
                        d.parent.template = this.getTemplete(d);
                    }
                    //console.log("cluster:" + d.cluster + ", Depth:" + d.depth);
                    ctx.drawImage(d.parent.template, d.x - d.radius, d.y - d.radius);
                }
            }

            //
            // draw the text
            //

            if (d.kidPer > 0.1) {
                var size = ((d.depth == 0) ? 32:(16 / Math.pow(2, d.depth))) * te.currentZoom;
                //ctx.font = Math.floor(size) + "px Arial";
                ctx.font = size + "px Conv_ZoramldsLat-Bold";// "px Arial";

                ctx.fillStyle = this.getTextColor(d);

                var splitName = d.display_name.split(" ");
                if (splitName.length > 2) {

                    var firstPart = splitName.splice(Math.ceil(splitName.length / 2));

                    ctx.fillText(firstPart.join(" "), Math.floor(d.x), Math.floor(d.y + d.radius + size + size));
                    ctx.fillText(splitName.join(" "), Math.floor(d.x), Math.floor(d.y + d.radius + size));

                } else {
                    //ctx.fillText(d.display_name, Math.floor(d.x), Math.floor(d.y + d.radius + size));
                    ctx.fillText(d.display_name, d.x, d.y + d.radius + size);
                }
            }
        }

        if(te.selectedNode != null)
        {
            ctx.save();
            var vr = te.selectedNode.radius * 0.25;
            var pSize = 0.65;
            var aDistane = ( vr *pSize);
            var tSize = Math.floor(vr * 1.00);
// Commented out to try to remove the View Buttons

            ctx.beginPath();
            ctx.globalAlpha = 1;
            ctx.lineWidth = 0.1 * vr;
            ctx.setLineDash([]);

            ctx.strokeStyle = "#FFFFFF";

            ctx.arc(te.selectedNode.x, te.selectedNode.y, vr, 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.lineJoin="round";
            ctx.lineCap="round";
            ctx.beginPath();
            //ctx.strokeStyle = "#FFFFFF";
            ctx.moveTo(te.selectedNode.x - ( aDistane/2), te.selectedNode.y - ( aDistane));

            ctx.lineTo(te.selectedNode.x +  ( aDistane/2), te.selectedNode.y );

            ctx.lineTo(te.selectedNode.x - (aDistane/2), te.selectedNode.y + ( aDistane));





            ctx.fillStyle = "#FFFFFF";//this.getTextColor(d);
            ctx.font =tSize + "px Conv_ZoramldsLat-Bold";// "px Arial";
            ctx.fillText("VIEW", te.selectedNode.x, te.selectedNode.y + vr + tSize + (vr * 0.25));
            ctx.stroke();


            //var vw = 78, vh = 100;
            //ctx.drawImage(te.viewBtnImg, 0, 0, vw, vh, te.selectedNode.x- vw/2, te.selectedNode.y-vh/2, vw, vh);// d.radius, d.radius)
            ctx.restore();
        }

        ctx.globalAlpha = 1 -per;
        ctx.drawImage(te.homeImg, 0, 0, 94, 95, te.homeBtnX, te.homeBtnY, te.homeSize, te.homeSize);// d.radius, d.radius)

        //

        /*
        if (this.debug) {
            //ctx.fillText(te.fpstxt, 150, 50);
            ctx.drawImage(te.homeImg, 0, 0, 94, 95, 40, 40, 94/2, 95/2);// d.radius, d.radius)

            this.drawCircleXY(te.currentPosition.x, te.currentPosition.y, 5, "#ff00ff", 1, ctx);
            this.drawCircleXY(te.currentPosition.x + (1024 * 2 * te.currentZoom), te.currentPosition.y + (768 * 2 * te.currentZoom), 5, "#ff00ff", 1, ctx)
            this.drawCircleXY(te.currentPosition.x + (1024 * 2 * te.currentZoom), te.currentPosition.y, 5, "#ff00ff", 1, ctx)
            this.drawCircleXY(te.currentPosition.x, te.currentPosition.y + (768 * 2 * te.currentZoom), 5, "#ff00ff", 1, ctx)

            //this.drawCircleXY(te.centerZoomPoint.x, te.centerZoomPoint.y, 5, "#ff0000", 1, ctx)


        }
        */

    },
    compare:function (a, b) {
        if (a.cluster < b.cluster) {
            return 1;
        }
        if (a.cluster > b.cluster) {
            return -1;
        }
        if (a.cluster == b.cluster) {
            if (a.depth < b.depth) {
                return 1;
            }
            if (a.depth > b.depth) {
                return -1;
            }
            return 0;
        }

    },

getTextColor: function (node) {
        var color = te.colorCat[node.cluster];

        if (node.depth == 0) {
            //color = "#FFFFFF";

            var bigint = parseInt(color.substr(1), 16);
            var r = (bigint >> 16) & 255;
            var disR = 255 - r;
            var g = (bigint >> 8) & 255;
            var disG = 255 - g;
            var b = bigint & 255;
            var disB = 255 - b;

            var per = node.children[0].kidPer;
            r = 255 - Math.floor(disR * per);
            g = 255 - Math.floor(disG * per);
            b = 255 - Math.floor(disB * per);


            color = this.rgbToHex(r, g, b);
        }
        return color;
    },
    rotateAndPaintImage: function (context, image, angleInRad, positionX, positionY, axisX, axisY) {
        context.translate(positionX, positionY);
        context.rotate(angleInRad);
        context.drawImage(image, -axisX, -axisY);
        context.rotate(-angleInRad);
        context.translate(-positionX, -positionY);
    },
    drawLineToParent: function (d, ctx) {

        if (d.parent == undefined || d.parent.id == "home") {
            return;
        }

        if (isNaN(d.parent.x)) {
            return;

            d.parent.x = d.parent.startPosition.x;
            d.parent.y = d.parent.startPosition.y;
        }

        ctx.beginPath();


        //if(d.kidPer < 1) {
        ctx.globalAlpha = d.kidPer;
        //}
        //ctx.strokeStyle = te.colorCat[d.cluster] + "CC";
        //ctx.lineWidth = 0.5;
        ctx.strokeStyle = "#8F8F8F";

        ctx.setLineDash([2,5]);
        ctx.lineWidth = te.maxRadius * 0.05;
        var radius = 75;
        var startAngle = 1.1 * Math.PI;
        var endAngle = 1.9 * Math.PI;
        var counterClockwise = false;

        ctx.moveTo(d.x, d.y);
        //ctx.arc(d.parent.x, d.parent.y, radius, startAngle, endAngle, counterClockwise);
        ctx.lineTo(d.parent.x, d.parent.y);
        ctx.stroke();


    },
    drawLineToParentOld: function (d, ctx) {

        if (d.parent == undefined || d.parent.id == "home") {
            return;
        }

        if (isNaN(d.parent.x)) {
            return;

            d.parent.x = d.parent.startPosition.x;
            d.parent.y = d.parent.startPosition.y;
        }

        ctx.beginPath();

        var lingrad = ctx.createLinearGradient(d.x, d.y, d.parent.x, d.parent.y);
        lingrad.addColorStop(0, d.lineColorStart);
        lingrad.addColorStop(0.9, d.lineColorEnd);

        //if(d.kidPer < 1) {
        ctx.globalAlpha = d.kidPer;
        //}
        //ctx.strokeStyle = te.colorCat[d.cluster] + "CC";
        //ctx.lineWidth = 0.5;
        ctx.strokeStyle = lingrad;
        ctx.lineWidth = te.maxRadius * 0.05;


        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.parent.x, d.parent.y);
        ctx.stroke();


    },
    drawCircle: function (d, ctx) {

        this.drawCircleXY(d.x, d.y, d.radius, te.colorCat[d.cluster], d.alpha, ctx);
    },
    getTemplete: function (d) {

        var tempCanvas = te.tempCanvas;// document.getElementsByName("temp");// document.createElement('temp'),
        var tempCtx = te.tempContext;// tempCanvas.getContext('2d');
        tempCanvas.width = d.radius * 2;
        tempCanvas.height = d.radius * 2;
        this.drawGridentCircle(d, tempCtx, d.radius, d.radius);
        return tempCanvas;

    },
    drawGridentCircle: function (d, ctx, locX, locY) {
        var alpha = d.alpha;

        var color = te.colorCat[d.cluster];
        //var grd = ctx.createRadialGradient(d.x, d.x, 0, d.x, d.y, d.radius*5);

        var grd = ctx.createRadialGradient(locX, locY, 0, locX, locY, d.radius);

        var colorValue = this.convertHex(color, alpha);
        // Add colors
        grd.addColorStop(0.000, colorValue);//  'rgba(0, 0, 0, 1.000)');
        grd.addColorStop(0.862, this.convertHex(color, alpha));//'rgba(201, 10, 10, 1.000)');
        grd.addColorStop(1.000, this.convertHex(color, 0));//'rgba(0, 0, 0, 0.000)');


        this.drawCircleXY(locX, locY, d.radius, grd, 1, ctx);
    },
    drawCircleXY: function (locX, locY, radius, color, alpha, ctx) {

        // Fill with gradient
        ctx.beginPath();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.arc(locX, locY, radius, 0, 2 * Math.PI, false);
        ctx.fill();


    },
    rgbToHex: function (rgb, g, b) {
        if (g == undefined || b == undefined) {
            if (typeof rgb == "string") {
                var result = /^rgb[a]?\(([\d]+)[ \n]*,[ \n]*([\d]+)[ \n]*,[ \n]*([\d]+)[ \n]*,?[ \n]*([.\d]+)?[ \n]*\)$/i.exec(rgb);
                return rgbToHex(parseInt(result[1]), parseInt(result[2]), parseInt(result[3]));
            }
            if (rgb.r == undefined || rgb.g == undefined || rgb.b == undefined) {
                return null;
            }
            return rgbToHex(rgb.r, rgb.g, rgb.b);
        }
        var r = rgb;

        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex:hex;
        }

        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    },
    convertHex: function (hex, opacity) {
        hex = hex.replace('#', '');
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);

        result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
        return result;
    },
    miniMap: function (ctx) {


        ctx.beginPath();
        ctx.strokeStyle = "#FF0000";
        ctx.lineWidth = 0.5;
        ctx.moveTo(0, te.horizonPoint.y);
        ctx.lineTo(te.simWidth, te.horizonPoint.y);
        ctx.stroke();

        //map

        //model range
        ctx.beginPath();
        ctx.strokeStyle = "#00cc00";
        //ctx.rect(this.mapStartX,this.mapStartY,te.modelRange * this.mapScale,te.modelRange * this.mapScale);
        ctx.moveTo(this.mapStartX, this.mapStartY);
        ctx.lineTo(this.mapStartX + (te.modelRange * this.mapScale), this.mapStartY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.mapStartX, this.mapStartY);
        ctx.lineTo(this.mapStartX, this.mapStartY - (10 * this.mapScale));
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.mapStartX + (te.modelRange * this.mapScale), this.mapStartY);
        ctx.lineTo(this.mapStartX + (te.modelRange * this.mapScale), this.mapStartY - (10 * this.mapScale));
        ctx.stroke();

        //selectionWidth
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0,255,0,0.3)';
        ctx.fillRect(this.mapStartX + (te.selectionStartX * te.renderer.mapScale), this.mapStartY, te.selectionWidth * this.mapScale, -500 * this.mapScale);

        //te.selectionSplitWidth
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0,0,255,0.3)';
        ctx.fillRect(this.mapStartX, this.mapStartY, te.selectionSplitWidth * this.mapScale, -500 * this.mapScale);


        var count = 0;
        //nodes
        te.nodes.forEach(function (d) {
            if (d.state == te.NODE_STATE_SHOW_KIDS && d != te.selectedNode) {
                ctx.beginPath();
                ctx.strokeStyle = te.colorCat[d.cluster];
                ctx.fillStyle = te.colorCat[count++];
                ctx.arc((d.startPosition.x * te.renderer.mapScale) + te.renderer.mapStartX, te.renderer.mapStartY - (d.startPosition.y * te.renderer.mapScale), 10 * te.renderer.mapScale, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.stroke();
            }


        });
        //current postion
        ctx.beginPath();
        ctx.strokeStyle = "#ff0000";
        ctx.arc((te.selectionStartX * te.renderer.mapScale) + te.renderer.mapStartX, te.renderer.mapStartY, 10 * te.renderer.mapScale, 0, 2 * Math.PI, false);

        ctx.stroke();


    },

    textCircle: function (text, x, y, radius, space, top) {
        var ctx = te.context;
        //space = space || 0;
        var numRadsPerLetter = (Math.PI - space * 2) / text.length;
        ctx.save();
        ctx.translate(x, y);
        var k = (top) ? 1:-1;
        ctx.rotate(-k * ((Math.PI - numRadsPerLetter) / 2 - space));
        for (var i = 0; i < text.length; i++) {
            ctx.save();
            ctx.rotate(k * i * (numRadsPerLetter));
            ctx.textAlign = "center";
            ctx.textBaseline = (!top) ? "top":"bottom";
            ctx.fillText(text[i], 0, -k * (radius));
            ctx.restore();
        }
        ctx.restore();
    }
};