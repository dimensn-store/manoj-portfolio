function e(e,t){let n=e.getContext(`webgl`,{antialias:!1,alpha:!1,powerPreference:`low-power`});if(!n)return!1;let r=(e,t)=>{let r=n.createShader(e);return n.shaderSource(r,t),n.compileShader(r),r},i=n.createProgram();if(n.attachShader(i,r(n.VERTEX_SHADER,`attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`)),n.attachShader(i,r(n.FRAGMENT_SHADER,`precision mediump float;
uniform vec2 uRes; uniform float uTime; uniform float uSplit; uniform vec2 uMouse;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.03;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes; vec2 q=uv; q.x*=uRes.x/uRes.y;
  float t=uTime*.05;
  float f=fbm(q*1.4+vec2(t,-t*.7)+fbm(q*2.2-t));
  // light leak, pulled toward the pointer
  vec2 m=uMouse; m.x*=uRes.x/uRes.y;
  float leak=smoothstep(.45,1.,f+.25*(1.-length(q-m)));
  vec3 col=vec3(1.,.54,.12)*leak*.55 + vec3(.9,.22,.08)*smoothstep(.6,1.,f)*.35;
  // glow along the seam
  float d=abs(uv.x-uSplit);
  float edge=exp(-d*38.)*.55 + exp(-d*9.)*.12;
  col+=vec3(1.,.23,.19)*edge*(.75+.25*sin(uTime*1.7+uv.y*9.));
  // chromatic fringe right at the cut
  col.b+=exp(-abs(uv.x-uSplit-.004)*160.)*.18;
  // grain + vignette
  col+=(h(gl_FragCoord.xy+fract(uTime)*91.)-.5)*.06;
  col*=smoothstep(1.25,.35,length(uv-.5));
  gl_FragColor=vec4(col,1.);
}`)),n.linkProgram(i),!n.getProgramParameter(i,n.LINK_STATUS))return!1;n.useProgram(i),n.bindBuffer(n.ARRAY_BUFFER,n.createBuffer()),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW);let a=n.getAttribLocation(i,`p`);n.enableVertexAttribArray(a),n.vertexAttribPointer(a,2,n.FLOAT,!1,0,0);let o=e=>n.getUniformLocation(i,e),s=o(`uRes`),c=o(`uTime`),l=o(`uSplit`),u=o(`uMouse`),d=.5,f=()=>{e.width=Math.max(1,e.clientWidth*d),e.height=Math.max(1,e.clientHeight*d),n.viewport(0,0,e.width,e.height)};f(),addEventListener(`resize`,f);let p=.7,m=.5,h=p,g=m;return addEventListener(`pointermove`,t=>{let n=e.getBoundingClientRect();h=(t.clientX-n.left)/n.width,g=1-(t.clientY-n.top)/n.height}),(function r(i){t.visible&&!document.hidden&&(p+=(h-p)*.04,m+=(g-m)*.04,n.uniform2f(s,e.width,e.height),n.uniform1f(c,i/1e3),n.uniform1f(l,t.split/100),n.uniform2f(u,p,m),n.drawArrays(n.TRIANGLES,0,3)),requestAnimationFrame(r)})(0),!0}export{e as startReelGL};