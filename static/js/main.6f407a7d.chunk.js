(this["webpackJsonpwebsite-react"]=this["webpackJsonpwebsite-react"]||[]).push([[0],{11:function(t,e,a){t.exports=a.p+"static/media/bsSplashCard.8fb75179.png"},13:function(t,e,a){t.exports=a(20)},18:function(t,e,a){},19:function(t,e,a){},20:function(t,e,a){"use strict";a.r(e);var n=a(0),i=a.n(n),r=a(9),s=a.n(r),o=(a(18),a(2)),c=a(3),u=a(5),l=a(4),h=a(1),d=a(6),f=(a(19),a(7)),m=a(10),p=a.n(m),b=Math.floor(360*Math.random()),w=0,v=function(t){function e(t){var a;return Object(o.a)(this,e),(a=Object(u.a)(this,Object(l.a)(e).call(this,t))).setup=function(t,e){t.createCanvas(t.windowWidth,t.windowHeight).parent(e),t.colorMode(t.HSB,360,100,100),t.background(360),a.initFil(),t.frameRate(20),t.noStroke(),a.initRules(),a.initHues(),t.background(0)},a.draw=function(t){a.setRules();for(var e=0,n=a.state.boxNum,i=0,r=Object(f.a)(a.state.fil),s=[],o=t.windowWidth/n,c=Math.floor(o),u=t.windowHeight/c,l=0;l<u;l++){for(var h=0;h<n;h++)e=0===h?4*r[n-1]+2*r[0]+r[1]:h===n-1?4*r[h-1]+2*r[h]+r[0]:4*r[h-1]+2*r[h]+r[h+1],i=Math.floor(a.state.hues[e]),r[h]?t.fill((i+b)%360,100,0):t.fill((h/(t.windowWidth/o)*100+(l/(t.windowHeight/c)*100+i+b+100*Math.sin(w)))%360,a.state.sats[e]-l/(t.windowHeight/c)*40,100),t.rect(o*(h-.5),c*(l+.8),o+2,c+2),s[h]=a.state.rules[e];r=[].concat(s)}a.calcNil(),(w+=.00511111*t.TWO_PI)>t.TWO_PI&&(w=0)},a.initFil=function(){a.setState((function(){for(var t=[],e=0;e<a.state.boxNum;e++)t[e]=0;return t[Math.floor(t.length/2)]=1,{fil:t}}))},a.initHues=function(){a.setState((function(){for(var t=[],e=0;e<8;e++)t[e]=360*Math.random();return{hues:t}}))},a.setRules=function(){a.setState((function(){return{rules:a.props.rules,hues:a.props.hues,sats:a.props.sats}}))},a.initRules=function(){a.setState((function(){for(var t=[],e=0;e<8;e++)t[e]=Math.floor(2*Math.random());return{rules:t}}))},a.onWindowResize=function(t){t.resizeCanvas(t.windowWidth,t.windowHeight)},a.calcNil=function(){a.setState((function(t){var e=a.state.boxNum,n=Object(f.a)(t.fil),i=[],r=a.state.rules;i[0]=r[4*n[e-1]+2*n[0]+n[1]],i[e-1]=r[4*n[e-2]+n[e-1]+n[0]];for(var s=1;s<n.length-1;s++)i[s]=r[4*n[s-1]+2*n[s]+n[s+1]];return{fil:i}}))},a.state={rules:a.props.rules,hues:a.props.hues,sats:a.props.sats,fil:[],boxNum:100},a.initFil=a.initFil.bind(Object(h.a)(a)),a.initRules=a.initRules.bind(Object(h.a)(a)),a.calcNil=a.calcNil.bind(Object(h.a)(a)),a}return Object(d.a)(e,t),Object(c.a)(e,[{key:"render",value:function(){return i.a.createElement(p.a,{setup:this.setup,draw:this.draw,windowResized:this.onWindowResize})}}]),e}(n.Component),g=a(11),k=a.n(g),M=a(12),O=a.n(M),j=function(t){function e(t){var a;return Object(o.a)(this,e),(a=Object(u.a)(this,Object(l.a)(e).call(this,t))).state={rules:[1,0,1,1,0,1,1,0],hues:[0,30,60,90,120,150,180,210],sats:[100,100,100,100,20,30,40,50],isBlur:!0},a.changeBlur=a.changeBlur.bind(Object(h.a)(a)),a.changePattern=a.changePattern.bind(Object(h.a)(a)),a}return Object(d.a)(e,t),Object(c.a)(e,[{key:"changeBlur",value:function(t){this.state.isBlur?document.getElementById("LiveBackDrop").style.filter="blur(0px)":document.getElementById("LiveBackDrop").style.filter="blur(6px)",this.setState((function(t){return{isBlur:!t.isBlur}}))}},{key:"onHover",value:function(t){}},{key:"changePattern",value:function(t){this.setState((function(){for(var t=[],e=[],a=[],n=0;n<8;n++)t[n]=Math.floor(2*Math.random()),e[n]=Math.floor(360*Math.random()),a[n]=Math.floor(100*Math.random());return{rules:t,hues:e,sats:a}}))}},{key:"render",value:function(){return i.a.createElement("div",{id:"App"},i.a.createElement("div",{id:"LiveBackDrop",className:"LiveBackDrop",onMouseMove:this.handleMouseMove},i.a.createElement(v,{canvasParentRef:"LiveBackDrop",sats:this.state.sats,rules:this.state.rules,hues:this.state.hues})),i.a.createElement("div",{id:"UI",className:"UI"},i.a.createElement("div",{className:"splashCard"},i.a.createElement("img",{src:k.a,onClick:this.changePattern,alt:"title card of site"})),i.a.createElement("div",{id:"construct",className:"construct",onClick:this.changeBlur},i.a.createElement(O.a,{className:"constructR",text:["welcome to my website","it's not ready quite yet, sorry about that","feel free to click my name and generate some new patterns","you can reach me at bradjste@gmail.com in the meantime"],speed:50,eraseDelay:800}))))}}]),e}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(i.a.createElement(j,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()}))}},[[13,1,2]]]);
//# sourceMappingURL=main.6f407a7d.chunk.js.map