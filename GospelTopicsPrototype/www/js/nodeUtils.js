/**
 * Created by michaelking on 11/7/14.
 */



te.nodeUtils = {

    changeStateOnNode: function (node, state, tweenIt)
    {

        if (node.state == state) return;


        node.tweenPer = 0;

        node.tweenStartx = node.x;
        node.tweenStarty = node.y;

        switch (state) {


            case te.NODE_STATE_SHOW_KIDS :

                node.tween(te.tweenTime, {alpha:1, radius:node.finalRadius, tweenPer:1.0});
                break;
            case te.NODE_STATE_DYING :
                node.tween(te.tweenTime/2, {x:te.horizonPoint.x, y:te.horizonPoint.y,alpha:0, radius:0, tweenPer:1.0});
                //node.tween(te.tweenTime/2, {x:node.parent.x, y:node.parent.y,alpha:0, radius:0, tweenPer:1.0});
                break;
            case te.NODE_STATE_CHILD :
                // node.tween = TweenLite.to(node, te.tweenTime, {radius: 0.01, weight: 100, charge: 0.01, alpha:0, linkDistance:te.linkDistance, linkStrength:0.0});
                var parentRadius = node.parent.finalRadius
                node.kidX = (Math.random() * (parentRadius * 4)) - (parentRadius * 2);
                node.kidY = (Math.random() * (parentRadius * 4)) - (parentRadius * 2);
                node.tween(te.tweenTime, {
                    radius: te.minRadius * Math.random(),
                    alpha: 0.3 * Math.random(),
                    x: node.kidX,
                    y: node.kidY,
                    tweenPer:1.0
                });

                break;
            case te.NODE_STATE_SELECTED :
                node.tween(te.tweenTime, {alpha:1, radius:40, x:te.horizonPoint.x, y:te.horizonPoint.y, tweenPer:1.0});

                break;

        }

        node.state = state;

    },

    getYval: function (family)
    {
        var range =  (te.horizonPoint.y  - te.deadZone - (te.maxRadius)) / 2;// Math.min( te.horizonPoint.y - te.bannerOnTopHeight - te.deadZone - (te.maxRadius), te.horizonPoint.x - te.deadZone - (te.maxRadius));
        if(family) {

            return te.deadZone + (Math.random() * range);
        }else
        {
            return te.deadZone + (Math.random() * range) + range;
        }

    },








    /////////////old part
    showLanding: function () {
        this.closeAll();
        var rootAry = te.rootJSON;
        for (var j = 0; j < rootAry.length; ++j) {
            this.showKidsOnNode(rootAry[j]);
        }
    },
    openNode: function (node) {

        te.selectedTopic = node.cluster;

        this.closeOtherTopics(node);
        this.singleLine(node);
        if (node.hasKids) {
            node.children = node.allChildren.slice(0);

            for (var i = 0; i < node.children.length; ++i) {
                this.showKidsOnNode(node.children[i]);
            }
        }


        this.changeStateOnNode(node, te.NODE_STATE_OPEN);

    },
    singleLine: function (node) {
        if (node.parent && node.parent != null && node.parent.children) {

            for (var i = 0; i < node.parent.children.length; ++i) {
                var sib = node.parent.children[i];
                if (sib != node) {
                    sib.children = null;
                    this.changeStateOnNode(sib, te.NODE_STATE_SHOW_KIDS);
                }
            }

        }
    },
    showKidsOnNode: function (node) {
        this.closeChildren(node);
        if (node.hasKids) {
            //node.children = node.allChildren.slice(0);
            for (var i = 0; i < node.allChildren.length; ++i) {

                this.changeStateOnNode(node.allChildren[i], te.NODE_STATE_IS_KID_SHOWING);
            }
        }
        node.children = null;
        this.changeStateOnNode(node, te.NODE_STATE_SHOW_KIDS);
    },
    closeOtherTopics: function (node) {
        var rootAry = te.rootJSON;
        for (var j = 0; j < rootAry.length; ++j) {
            if (j != node.cluster) {
                this.showKidsOnNode(rootAry[j]);
            }
        }
    },
    closeAll: function () {
        var rootAry = te.rootJSON;
        for (var j = 0; j < rootAry.length; ++j) {
            this.closeChildren(rootAry[j]);
        }
    },
    closeChildren: function (node) {
        if (node.hasKids) {
            for (var k = 0; k < node.allChildren.length; ++k) {
                this.closeChildren(node.allChildren[k]);
            }
            node.children = null;
        }

        this.changeStateOnNode(node, te.NODE_STATE_CLOSED);
    },

    // Returns a list of all nodes under the root.
    flatten: function (rootAry) {
        var nodes = [];
        for (var j = 0; j < rootAry.length; ++j) {
            this.getChildren(rootAry[j], nodes);

        }
        return nodes;
    },
    getChildren: function (node, nodes) {
        if (node.children && node.children.length != 0) {
            for (var i = 0; i < node.children.length; ++i) {
                this.getChildren(node.children[i], nodes);
            }
        }
        nodes.push(node);
    },

    flatKids: function (rootAry) {
        var nodes = [];
        for (var j = 0; j < rootAry.children.length; ++j) {
            this.getKids(rootAry.children[j], nodes);

        }
        return nodes;
    },
    // Returns a list of all kids
    getKids: function (node, fillAry) {
        if (node.hasKids) {
            for (var i = 0; i < node.allChildren.length; ++i) {
                this.getKids(node.allChildren[i], fillAry);
            }
        }
       // if (node.state == te.NODE_STATE_IS_KID_SHOWING)fillAry.push(node);
        fillAry.push(node);
    },




    updateHitNodes: function () {

        te.hitNodes = new Array();
        for (var i = 0; i < te.nodes.length; ++i) {
            var n = te.nodes[i];
            if (n.state == te.NODE_STATE_OPEN || n.state == te.NODE_STATE_KID_IS_OPEN || n.state == te.NODE_STATE_SHOW_KIDS) {
                te.hitNodes.push(n);
            }
        }
    },
    updatePositions: function (hitNodeID) {
        if (te.selectedNode == null)return;
        var hitNodeID = te.selectedNode.id;

        if (te.positions[hitNodeID] != undefined) {

            for (var i = 0; i < te.nodes.length; ++i) {
                var n = te.nodes[i];
                for (var j = 0; j < te.positions[hitNodeID].length; ++j) {
                    var pos = te.positions[hitNodeID][j];
                    if (n.id == pos.id) {
                        n.gx = pos.x;
                        n.gy = pos.y;
                    }
                }
            }
        }
    },
    ///////////////////////
    //
    //init nodes
    //
    //
    ///////////////////////

    initNodes: function () {
        var rootAry = te.rootJSON.children;

        for (var j = 0; j < rootAry.length; ++j) {
            var parentNode = rootAry[j];
            parentNode.parent = te.rootJSON;
            // te.clusters[j] = parentNode;
            this.initNodeWithChildren(parentNode, (j + 1), j, 0);

            this.setKidValues(parentNode);
        }
        this.initNode(te.rootJSON, 0, 0);
    },

    capitalizeFirstLetter:function(str) {
        str = str.toLowerCase();
        var words = str.split(" ");
        var noCap = "a|an|and|at|or|we|the|of|this|for|that|is|in".split("|");
        for(var i = 0;i<words.length;++i)
        {
            var word = words[i];

            if($.inArray(word, noCap) == -1 || i == 0)
            {
                words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1)
            }
        }
    return words.join(" ");
    },

    initNodeWithChildren: function (node, clusterID, index, depth) {
        if (node.children && node.children.length != 0) {
            node.hasKids = true;
            for (var i = 0; i < node.children.length; ++i) {
                var kid = node.children[i];
                this.initNodeWithChildren(kid, clusterID, i, depth + 1);
                kid.parent = node;
            }
        } else {
            node.hasKids = false;
        }
        te.maxDepth = Math.max(te.maxDepth, depth);
        this.initNode(node, clusterID, index, depth)
    },

    setKidValues:function(node)
    {

        if (node.children && node.children.length != 0) {

            for (var i = 0; i < node.children.length; ++i) {
                var kid = node.children[i];

                var parentRadius = kid.parent.startRadius;
                kid.kidX =  (Math.random() * (parentRadius * 4)) - (parentRadius * 2);
                kid.kidY =  (Math.random() * (parentRadius * 4)) - (parentRadius * 2);
                kid.kidAlpha = 0.3 * Math.random();
                kid.kidRadius = te.startRadius * Math.random() * 0.3;
               // console.log(kid.display_name, kid.kidX, kid.kidY);

                this.setKidValues(kid);
            }
        }
    },

    initNode: function (node, clusterID, index, depth) {


        node.fixed = false;
        node.relatedNodes = [];

        //if (!node.id) node.id = node.  nodes.length;
        node.cluster = clusterID;
        node.alpha = 1;
        node.depth = depth;
        
        if (node.allChildren == null && node.hasKids) {
            node.allChildren = node.children.slice(0);
        }

        node.display_name =this.capitalizeFirstLetter(node.display_name);
        node.template = null;


         //this is position in the dataset
        var devDis = 52;
        if(!node.startX)
        {
            node.startX = 300 + (depth * devDis);// Math.random()* 600;
        }
        if(!node.startY)
        {
            node.startY = 300 + (depth * devDis);// Math.random()* 600;
        }
        if(!node.startRadius)
        {
            //var size = [64, 32, 16, 8, 4, 2];

           var size = (depth == 0)?   64 : (32 / Math.pow(2, depth));

            node.startRadius = size

        }

        node.x = node.startX;
        node.y = node.startY;
        node.radius = node.startRadius;


        node.tween = this.tweenF;

        //setup line colors

        var colorObj = this.RGBtoRGBA(te.colorCat[clusterID]);
        colorObj.a *= 0.5
        node.lineColorStart ='rgba(' + colorObj.r + ', ' + colorObj.g + ', ' + colorObj.b + ', ' + colorObj.a + ')' ;
        node.lineColorEnd =  'rgba(' + colorObj.r + ', ' + colorObj.g + ', ' + colorObj.b + ', 0)' ;


        node.state = te.NODE_STATE_BEGIN;
        //this.changeStateOnNode(node, te.NODE_STATE_CLOSED, false);
    },
    findNode:function(node, id)
    {


        if(node.id == id)
        {
            return node;
        }

        if (node.children && node.children.length != 0) {

            for (var i = 0; i < node.children.length; ++i) {
                var kid = node.children[i];
                var foundNode = this.findNode(kid, id );
                if(foundNode != null)
                {
                    return foundNode;
                }
            }
        }
        return null;
    },

    RGBtoRGBA: function (r, g, b)
    {

        if ((g == void 0) && (typeof r == 'string')) {
            r = r.replace(/^\s*#|\s*$/g, '');
            if (r.length == 3) {
                r = r.replace(/(.)/g, '$1$1');
            }
            g = parseInt(r.substr(2, 2), 16);
            b = parseInt(r.substr(4, 2), 16);
            r = parseInt(r.substr(0, 2), 16);
        }

        var min, a = ( 255 - (min = Math.min(r, g, b)) ) / 255;

        return {
            r: r = 0 | ( r - min ) / a,
            g: g = 0 | ( g - min ) / a,
            b: b = 0 | ( b - min ) / a,
            a: a = (0 | 1000 * a) / 1000,
            rgba: 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')'
        }
    },
    tweenF: function (time, params) {
        if (this._tween != undefined) {
            this._tween.kill();
        }
        this._tween = TweenLite.to(this, time, params);


    }
};