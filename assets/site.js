(function(){
  // Sleutel met inkepingspatroon 3-5-2-6-4 en een rode laser die over het blad loopt
  var code=[3,5,2,6,4], svg=document.getElementById('key'), NS='http://www.w3.org/2000/svg';
  if(svg){
  var x0=250, x1=600, top=92, base=150, step=7, w=(x1-40-x0)/code.length;
  var d='M'+x0+' '+top+' L'+(x1-28)+' '+top+' L'+x1+' '+(top+22)+' L'+(x1-10)+' '+(base-6)+' L'+(x1-40)+' '+base;
  for(var i=code.length-1;i>=0;i--){
    var xs=x0+40+i*w, depth=base+4+code[i]*step;
    d+=' L'+(xs+w*0.78)+' '+base+' L'+(xs+w*0.5)+' '+depth+' L'+(xs+w*0.22)+' '+base;
  }
  d+=' L'+x0+' '+base+' Z';
  function el(n,a,p){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);(p||svg).appendChild(e);return e}
  var defs=el('defs',{});
  var g=el('linearGradient',{id:'steel',x1:0,y1:0,x2:0,y2:1},defs);
  el('stop',{offset:'0','stop-color':'var(--steel-1)'},g);
  el('stop',{offset:'.55','stop-color':'var(--steel-2)'},g);
  el('stop',{offset:'1','stop-color':'var(--steel-3)'},g);
  var lg=el('linearGradient',{id:'beam',x1:0,y1:0,x2:1,y2:0},defs);
  el('stop',{offset:'0','stop-color':'#d3202f','stop-opacity':0},lg);
  el('stop',{offset:'.5','stop-color':'#ff3344','stop-opacity':1},lg);
  el('stop',{offset:'1','stop-color':'#d3202f','stop-opacity':0},lg);
  var f=el('filter',{id:'glow',x:'-50%',y:'-50%',width:'200%',height:'200%'},defs);
  el('feGaussianBlur',{stdDeviation:4},f);
  var cp=el('clipPath',{id:'blade'},defs); el('path',{d:d},cp);

  // kop
  el('circle',{cx:150,cy:121,r:86,fill:'url(#steel)',stroke:'var(--steel-3)','stroke-width':2});
  el('circle',{cx:150,cy:121,r:70,fill:'none',stroke:'rgba(255,255,255,.18)','stroke-width':1});
  el('circle',{cx:118,cy:121,r:22,fill:'var(--surface)',stroke:'var(--steel-3)','stroke-width':2});
  el('rect',{x:228,y:100,width:30,height:42,rx:6,fill:'url(#steel)',stroke:'var(--steel-3)','stroke-width':2});
  // blad
  el('path',{d:d,fill:'url(#steel)',stroke:'var(--steel-3)','stroke-width':2,'stroke-linejoin':'round'});
  el('line',{x1:x0+10,y1:116,x2:x1-50,y2:116,stroke:'rgba(0,0,0,.35)','stroke-width':3});
  el('line',{x1:x0+10,y1:119,x2:x1-50,y2:119,stroke:'rgba(255,255,255,.25)','stroke-width':1});
  // laser
  var lz=el('g',{'clip-path':'url(#blade)'});
  var beam=el('g',{'class':'laser'},lz);
  el('rect',{x:x0-6,y:top-10,width:14,height:130,fill:'url(#beam)',filter:'url(#glow)'},beam);
  el('rect',{x:x0,y:top-10,width:2,height:130,fill:'#ff3344'},beam);
  // diepte-markers
  for(var j=0;j<code.length;j++){
    var cx=x0+40+j*w+w*0.5;
    el('line',{x1:cx,y1:base+4+code[j]*step+6,x2:cx,y2:212,stroke:'var(--line)','stroke-width':1});
    var t=el('text',{x:cx,y:234,'text-anchor':'middle','font-family':'IBM Plex Mono, monospace','font-size':16,fill:'var(--muted)'});
    t.textContent=code[j];
  }

  }

  // open/gesloten (tijd in Nederland), di t/m za 09:00–17:00
  try{
    var parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Amsterdam',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
    var get=function(t){return (parts.find(function(p){return p.type===t})||{}).value};
    var map={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}, day=map[get('weekday')], mins=parseInt(get('hour'),10)*60+parseInt(get('minute'),10);
    var isOpenDay=day>=2&&day<=6, open=isOpenDay&&mins>=540&&mins<1020;
    var names=['zondag','maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag'];
    var st=document.getElementById('status'), tx=document.getElementById('status-text');
    if(st&&tx){ if(open){ st.classList.add('open'); tx.innerHTML='<b>Nu open</b> · tot 17:00'; }
    else{
      var next=day, today=isOpenDay&&mins<540;
      if(!today){ do{ next=(next+1)%7 }while(next<2) }
      tx.textContent='Gesloten · '+(today?'vandaag':names[next])+' vanaf 09:00 open';
    } }
    var row=document.querySelector('#hours tr[data-d="'+day+'"]'); if(row) row.classList.add('today');
  }catch(e){}

  // Google Maps pas laden na klik (geen cookies vooraf). In een voorbeeldweergave opent de link Google Maps.
  var mb=document.getElementById('map-btn'), mp=document.getElementById('map');
  var preview=/claude|claudeusercontent/.test(location.hostname);
  if(mb && !preview){
    mb.addEventListener('click',function(e){
      e.preventDefault();
      var f=document.createElement('iframe');
      f.src='https://www.google.com/maps?q=Pieter+Jelle+Troelstraweg+7,+Maassluis&z=16&output=embed';
      f.title='Kaart: Pieter Jelle Troelstraweg 7, Maassluis'; f.loading='lazy'; f.referrerPolicy='no-referrer-when-downgrade';
      mp.appendChild(f); mp.classList.add('loaded');
    });
  }
})();
