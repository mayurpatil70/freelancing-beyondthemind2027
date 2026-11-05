export const VERTEX_SHADER = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

// Every time-based term repeats every 40s so the live render and the recorded loop video match.
export const fragmentShader = (octaves: number) => `#define OCT ${octaves}
precision highp float;
uniform vec2 uRes,uMouse,uCenter;uniform float uTime,uBreath,uIntro,uScroll,uSize;
#define TAU 6.2831853
#define W (TAU/40.)
float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float nz(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<OCT;i++){v+=a*nz(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
float ln(float d,float w){return smoothstep(w,0.,abs(d));}
float rep(float a,float n){float s=TAU/n;return mod(a+s*.5,s)-s*.5;}
float stars(vec2 uv,float sc,float th){vec2 sp=uv*sc,id=floor(sp),f=fract(sp)-.5;float h=h21(id);vec2 o=(vec2(h21(id+3.1),h21(id+7.7))-.5)*.7;float s=smoothstep(.09,0.,length(f-o));return step(th,h)*s*(.55+.45*sin(W*uTime*floor(4.+h*8.)+h*60.));}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  float rr=length(uv);
  vec3 col=mix(vec3(.028,.13,.105),vec3(.008,.05,.04),smoothstep(0.,.9,rr));
  vec2 drift=.25*vec2(cos(W*uTime),sin(W*uTime));
  float nb=fbm(uv*1.4+drift);
  float nb2=fbm(uv*2.6-drift*.5+nb);
  col+=vec3(.06,.055,.13)*smoothstep(.5,.95,nb2)*.9+vec3(.01,.07,.05)*nb;
  col+=vec3(.9,.82,.55)*(stars(uv+uMouse*.006,70.,.975)*.8+stars(uv+uMouse*.012+3.,38.,.985));
  vec2 c=uCenter+uMouse*vec2(.025,.018);
  float zoom=(1.+uScroll*2.6)*mix(.97,1.07,uBreath);
  vec2 p=(uv-c)/(uSize*zoom);
  p+=uMouse*.03*length(p);
  float r=length(p),a=atan(p.y,p.x);
  float px=1.6/(uRes.y*uSize*zoom);
  float g=0.;
  g+=ln(r-.17,px)*.7+ln(r-.30,px)*.55+ln(r-.315,px)*.3+ln(r-.60,px)*.7+ln(r-.62,px)*.35+ln(r-.96,px)*.55+ln(r-1.,px)*.3;
  float a1=a+uTime*.0392699;
  g+=ln(r-(.17+.13*pow(abs(cos(a1*4.)),.7)),px*1.3)*.95;
  g+=ln(r-(.17+.09*pow(abs(cos(a1*4.+.785)),.7)),px*1.2)*.55;
  float a2=a-uTime*.0392699;
  g+=ln(r-(.33+.22*pow(abs(cos(a2*8.)),1.4)),px*1.3)*.8;
  g+=ln(r-(.33+.15*pow(abs(cos(a2*8.)),1.4)),px*1.1)*.4;
  float sa=rep(a2,12.);vec2 q=r*vec2(cos(sa),sin(sa));
  g+=ln(length(q-vec2(.46,0.))-.12,px)*.45;
  float a3=a+uTime*.0130900;
  float t4=abs(fract(a3*24./TAU)-.5)*2.;
  g+=ln(r-(.63+.27*pow(1.-t4,2.2)),px*1.2)*.6;
  g+=ln(r-(.63+.18*pow(1.-t4,2.2)),px)*.3;
  sa=rep(a3,48.);q=r*vec2(cos(sa),sin(sa));
  g+=smoothstep(.011+px,.011,length(q-vec2(.93,0.)))*.9;
  sa=rep(a1,8.);q=r*vec2(cos(sa),sin(sa));
  g+=smoothstep(.016+px,.016,length(q-vec2(.235,0.)));
  g+=ln(sin(rep(a+uTime*.0087266,72.))*r,px*.8)*smoothstep(.62,.68,r)*smoothstep(.97,.9,r)*.22;
  g*=.8+.25*sin(a*6.+W*4.*uTime-r*9.);
  float R=uIntro*1.25;
  g*=1.-smoothstep(R-.14,R,r);
  g*=.62+.45*uBreath;
  float fade=1.-smoothstep(.55,1.,uScroll);
  vec3 gold=mix(vec3(.62,.46,.18),vec3(1.,.92,.66),clamp(g*1.2,0.,1.));
  col+=gold*g*.85*fade;
  col+=vec3(.83,.69,.22)*(exp(-r*3.2)*.22*(.6+.6*uBreath)+exp(-pow(r-.96,2.)*60.)*.05)*smoothstep(0.,.3,uIntro)*fade;
  float bp=.6+.4*sin(W*13.*uTime);
  col+=vec3(1.,.93,.7)*(exp(-r*r*1400.)*1.6+exp(-r*24.)*.35)*mix(bp,1.,uIntro)*fade;
  col*=1.-.5*smoothstep(.45,1.25,rr);
  gl_FragColor=vec4(col,1.);
}`;

export const BREATH_CYCLE = 10;
export const BREATH_IN = 4;

export function breathAt(t: number) {
  const c = t % BREATH_CYCLE;
  return c < BREATH_IN
    ? 0.5 - 0.5 * Math.cos((Math.PI * c) / BREATH_IN)
    : 0.5 + 0.5 * Math.cos((Math.PI * (c - BREATH_IN)) / (BREATH_CYCLE - BREATH_IN));
}
