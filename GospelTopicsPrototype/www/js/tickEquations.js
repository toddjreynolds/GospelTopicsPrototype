/**
 * Created by michaelking on 11/7/14.
 */
te.tickEQ = {

    name: "TE Tick Equations",

    ticked: function (e) {
        te.nodes.forEach(te.tickEQ.collide(.01));
        te.nodes.forEach(te.tickEQ.gravity(0.1 * e.alpha));
        te.kidNodes.forEach(te.tickEQ.kidGravity(.1 * e.alpha));
        te.nodes.forEach(te.tickEQ.boundingBox);
    },
    boundingBox:function(d)
    {

        d.x = Math.max(10, Math.min(te.simWidth - te.clusterPadding, d.x));
        d.y = Math.max(150, Math.min(te.simHeight - te.clusterPadding, d.y));

    },

    kidFX: function (d, spot, ary) {

       if(d.tween == null || d.tween.isActive() == false)
       {

           var x = d.parent.x  + (-30 + (Math.random() * 60)) + d.linkDistance;
           var y = d.parent.y  + (-30 + (Math.random() * 60)) + d.linkDistance;
           d.tween = TweenLite.to(d, te.tweenTime, {x:x, y:y});
       }

    },

    // Move nodes toward cluster focus.
    kidGravity: function (alpha) {
        return function (d) {

            var k = 1;

            d.y += (d.parent.y - d.y + d.kidX) * d.kidStrength;
            d.x += (d.parent.x - d.x + d.kidY) * d.kidStrength;

            d.px = d.x;
            d.py = d.y;
            /*

            var x = d.x - d.parent.x,
                y = d.y - d.parent.y,
                l = Math.sqrt(x * x + y * y),
                r = d.radius + d.parent.radius;
            if (l != r) {
                l = (l - r) / l * alpha * k;
                d.x -= x *= l;
                d.y -= y *= l;
               // cluster.x += x;
               // cluster.y += y;
            }
            */


        };
    },
    // Move nodes toward cluster focus.
    gravity: function (alpha) {
        return function (d) {
            var cluster = te.clusters[d.cluster];
            if (cluster === d) {
                if (te.selectedTopic == d.cluster)
                {
                    d.y += (d.gy - d.y) * alpha;
                    d.x += (d.gx - d.x) * alpha;

                    // d.y += (te.simHeight / 2 - d.y) * alpha;
                   // d.x += (te.simWidth / 2 - d.x) * alpha;
                } else {

                    d.y += (d.cy - d.y) * alpha;
                    d.x += (d.cx - d.x) * alpha;
                }
            }else
            {
                d.y += (d.gy - d.y) * alpha;
                d.x += (d.gx - d.x) * alpha;

            }

        };
    },

    /*
     // Move d to be adjacent to the cluster node.
     function cluster2(alpha) {
     return function(d) {
     var cluster = clusters[d.cluster];
     if (cluster === d) return;
     var x = d.x - cluster.x,
     y = d.y - cluster.y,
     l = Math.sqrt(x * x + y * y),
     r = d.radius + cluster.radius;
     if (l != r) {
     l = (l - r) / l * alpha;
     d.x -= x *= l;
     d.y -= y *= l;
     cluster.x += x;
     cluster.y += y;
     }
     };
     }
     */
    cluster: function (alpha) {
        return function (d) {
            var cluster = te.clusters[d.cluster];
            var k = 1;
            // For cluster nodes, apply custom gravity.
            if (cluster === d) {
                //cluster = {x: width / 2, y: height / 2, radius: -d.radius};
                //k = .1 * Math.sqrt(d.radius);
                d.y += (d.cy - d.y) * alpha;
                d.x += (d.cx - d.x) * alpha;

            } else {

                return;
                var x = d.x - cluster.x,
                    y = d.y - cluster.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + cluster.radius;
                if (l != r) {
                    l = (l - r) / l * alpha * k;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    cluster.x += x;
                    cluster.y += y;
                }
            }
        };
    },

    // Resolves collisions between d and all other circles.
    collide: function (alpha) {
        var quadtree = d3.geom.quadtree(te.hitNodes);
        return function (d) {
            var r = d.radius + te.maxRadius + Math.max(te.padding, te.clusterPadding),
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
            quadtree.visit(function (quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== d)) {
                    var x = d.x - quad.point.x,
                        y = d.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? te.padding:te.clusterPadding);
                    if (l < r) {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        quad.point.x += x;
                        quad.point.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        };
    }
};