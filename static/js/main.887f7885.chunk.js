(this["webpackJsonpwebsite-react"]=this["webpackJsonpwebsite-react"]||[]).push([[0],[,,,,,,,,,,,function(t,e,n){t.exports=n.p+"static/media/bsSplashCard.5267e537.png"},function(t,e,n){t.exports=n(20)},,,,,function(t,e,n){},function(t,e,n){},function(t,e,n){t.exports=n.p+"static/media/web2Back.33dea0c2.png"},function(t,e,n){"use strict";n.r(e);var a=n(0),i=n.n(a),r=n(9),s=n.n(r),o=(n(17),n(2)),c=n(3),u=n(5),l=n(4),h=n(1),d=n(6),f=(n(18),n(7)),p=n(10),m=n.n(p),b=Math.floor(360*Math.random()),v=0,w=function(t){function e(t){var n;return Object(o.a)(this,e),(n=Object(u.a)(this,Object(l.a)(e).call(this,t))).setup=function(t,e){t.createCanvas(t.windowWidth,t.windowHeight).parent(e),t.colorMode(t.HSB,360,100,100),t.background(360),n.initFil(),t.frameRate(30),t.noStroke(),n.initRules(),n.initHues(),t.background(0)},n.draw=function(t){n.setRules();for(var e=0,a=n.state.boxNum,i=0,r=Object(f.a)(n.state.fil),s=[],o=t.windowWidth/a,c=Math.floor(o),u=t.windowHeight/c,l=0;l<u;l++){for(var h=0;h<a;h++)e=0==h?4*r[a-1]+2*r[0]+r[1]:h==a-1?4*r[h-1]+2*r[h]+r[0]:4*r[h-1]+2*r[h]+r[h+1],i=Math.floor(n.state.hues[e]),r[h]?t.fill((i+b)%360,100,0):t.fill((h/(t.windowWidth/o)*100+(l/(t.windowHeight/c)*100+i+b+100*Math.sin(v)))%360,n.state.sats[e]-l/(t.windowHeight/c)*40,100),t.rect(o*(h-.5),c*(l+.8),o+2,c+2),s[h]=n.state.rules[e];r=[].concat(s)}n.calcNil(),(v+=.00511111*t.TWO_PI)>t.TWO_PI&&(v=0)},n.initFil=function(){n.setState((function(){for(var t=[],e=0;e<n.state.boxNum;e++)t[e]=0;return t[Math.floor(t.length/2)]=1,{fil:t}}))},n.initHues=function(){n.setState((function(){for(var t=[],e=0;e<8;e++)t[e]=360*Math.random();return{hues:t}}))},n.setRules=function(){n.setState((function(){return{rules:n.props.rules,hues:n.props.hues,sats:n.props.sats}}))},n.initRules=function(){n.setState((function(){for(var t=[],e=0;e<8;e++)t[e]=Math.floor(2*Math.random());return{rules:t}}))},n.onWindowResize=function(t){t.resizeCanvas(t.windowWidth,t.windowHeight)},n.calcNil=function(){n.setState((function(t){var e=n.state.boxNum,a=Object(f.a)(t.fil),i=[],r=n.state.rules;i[0]=r[4*a[e-1]+2*a[0]+a[1]],i[e-1]=r[4*a[e-2]+a[e-1]+a[0]];for(var s=1;s<a.length-1;s++)i[s]=r[4*a[s-1]+2*a[s]+a[s+1]];return{fil:i}}))},n.state={rules:n.props.rules,hues:n.props.hues,sats:n.props.sats,fil:[],boxNum:60},n.initFil=n.initFil.bind(Object(h.a)(n)),n.initRules=n.initRules.bind(Object(h.a)(n)),n.calcNil=n.calcNil.bind(Object(h.a)(n)),n}return Object(d.a)(e,t),Object(c.a)(e,[{key:"render",value:function(){return i.a.createElement(m.a,{setup:this.setup,draw:this.draw,windowResized:this.onWindowResize})}}]),e}(a.Component),g=n(11),M=n.n(g),k=(n(19),function(t){function e(t){var n;return Object(o.a)(this,e),(n=Object(u.a)(this,Object(l.a)(e).call(this,t))).x=50,n.y=50,n.state={rules:[1,0,1,1,0,1,1,0],hues:[0,30,60,90,120,150,180,210],sats:[100,100,100,100,20,30,40,50]},n.changeBlur=n.changeBlur.bind(Object(h.a)(n)),n.changePattern=n.changePattern.bind(Object(h.a)(n)),setInterval(n.changeBlur,1e4),n}return Object(d.a)(e,t),Object(c.a)(e,[{key:"changeBlur",value:function(t){this.state.isBlur?document.getElementById("LiveBackDrop").style.filter="blur(0px)":document.getElementById("LiveBackDrop").style.filter="blur(6px)",this.setState((function(t){return{isBlur:!t.isBlur}}))}},{key:"onHover",value:function(t){}},{key:"changePattern",value:function(t){this.setState((function(){for(var t=[],e=[],n=[],a=0;a<8;a++)t[a]=Math.floor(2*Math.random()),e[a]=Math.floor(360*Math.random()),n[a]=Math.floor(100*Math.random());return{rules:t,hues:e,sats:n}}))}},{key:"render",value:function(){return i.a.createElement("div",{id:"App"},i.a.createElement("div",{id:"LiveBackDrop",className:"LiveBackDrop",onMouseMove:this.handleMouseMove},i.a.createElement(w,{canvasParentRef:"LiveBackDrop",sats:this.state.sats,rules:this.state.rules,hues:this.state.hues})),i.a.createElement("div",{id:"UI",className:"UI"},i.a.createElement("div",{className:"splashCard"},i.a.createElement("img",{src:M.a,onClick:this.changePattern,alt:"title card of site"}))))}}]),e}(a.Component));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(i.a.createElement(k,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()}))}],[[12,1,2]]]);
//# sourceMappingURL=main.887f7885.chunk.js.map