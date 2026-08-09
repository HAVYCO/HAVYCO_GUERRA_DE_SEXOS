const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const K={a:'hvgs_teamA',b:'hvgs_teamB',names:'hvgs_names',hist:'hvgs_hist',lic:'hvgs_lic',age:'hvgs_age'};
const st={a:JSON.parse(localStorage.getItem(K.a)||'[]'),b:JSON.parse(localStorage.getItem(K.b)||'[]'),names:JSON.parse(localStorage.getItem(K.names)||'{"a":"MUJERES","b":"HOMBRES"}'),hist:JSON.parse(localStorage.getItem(K.hist)||'[]'),lic:JSON.parse(localStorage.getItem(K.lic)||'null'),scoreA:0,scoreB:0,idxA:0,idxB:0,level:'suave',mode:'relampago',double:false,timer:null,prompt:null};
const content={
 suave:[
  "Menciona 5 países de Sudamérica en 15 segundos.",
  "¿Cuál es la capital de Ecuador?",
  "Haz una mímica de una profesión y deja que el otro equipo adivine.",
  "Nombra 4 películas famosas en 15 segundos.",
  "¿Qué equipo puede mencionar más frutas en 20 segundos?",
  "Imita un animal hasta que tu equipo lo adivine.",
  "Menciona 5 canciones conocidas sin repetir artista.",
  "¿Quién puede decir el abecedario al revés más lejos sin equivocarse?"
 ],
 atrevido:[
  "Elige a un representante: debe hacer una imitación de otro jugador.",
  "Cada equipo tiene 15 segundos para inventar el mejor piropo divertido y respetuoso.",
  "¿Quién puede contar la anécdota más vergonzosa en menos de 20 segundos?",
  "Duelo de miradas: gana quien aguante más sin reírse.",
  "Cada equipo debe elegir a alguien para hacer una pasarela de 10 segundos.",
  "Menciona 3 cosas que hacen atractiva a una persona sin repetir respuesta.",
  "Reto rápido: inventa una frase de conquista exageradamente dramática.",
  "Cada equipo elige a alguien para bailar 10 segundos."
 ],
 hot:[
  "Cada equipo elige a alguien para decir un cumplido coqueto y respetuoso al rival.",
  "Duelo: mantengan contacto visual 15 segundos; pierde quien se ría primero.",
  "Cada equipo debe proponer una cita ideal en menos de 20 segundos.",
  "¿Quién puede nombrar más canciones románticas en 15 segundos?",
  "Elige a alguien para recrear una escena romántica sin contacto físico obligatorio.",
  "Cada equipo debe decir 3 cualidades que considera irresistibles en una persona."
 ],
 picante:[
  "Duelo de frases: inventen la mejor invitación a una cita.",
  "Cada equipo elige a un jugador para hacer una entrada dramática y coqueta.",
  "¿Qué equipo puede crear el plan romántico más original en 20 segundos?",
  "Cada equipo tiene 15 segundos para decir 4 cumplidos sinceros.",
  "Reto de actuación: representen una escena de telenovela romántica durante 20 segundos.",
  "Duelo de sonrisas: gana quien haga reír primero al rival sin tocarlo."
 ],
 extremo:[
  "Batalla creativa: cada equipo prepara una declaración romántica de 20 segundos.",
  "Duelo de confianza: contacto visual 25 segundos si ambos jugadores aceptan.",
  "Cada equipo debe crear una escena de comedia romántica de 30 segundos.",
  "Reto de improvisación: inventen una historia romántica usando tres palabras elegidas por el rival.",
  "Cada equipo elige a una persona para una pasarela y pose final.",
  "Duelo de preguntas: cada equipo hace una pregunta atrevida pero respetuosa; el rival puede pasar."
 ]
};
function save(){localStorage.setItem(K.a,JSON.stringify(st.a));localStorage.setItem(K.b,JSON.stringify(st.b));localStorage.setItem(K.names,JSON.stringify(st.names));localStorage.setItem(K.hist,JSON.stringify(st.hist));localStorage.setItem(K.lic,JSON.stringify(st.lic))}
function pro(){return !!(st.lic&&st.lic.plan==='PRO'&&(!st.lic.expires||new Date(st.lic.expires+'T23:59:59')>=new Date()))}
function show(id){$$('.view').forEach(v=>v.classList.toggle('active',v.id===id));$$('.tab').forEach(v=>v.classList.toggle('active',v.dataset.view===id))}
$$('[data-view]').forEach(b=>b.onclick=()=>show(b.dataset.view));
function playerA(){return st.a.length?st.a[st.idxA%st.a.length]:'Sin jugadores'}function playerB(){return st.b.length?st.b[st.idxB%st.b.length]:'Sin jugadores'}
function render(){
 $('#teamANameLabel').textContent=st.names.a;$('#teamBNameLabel').textContent=st.names.b;$('#teamAName').value=st.names.a;$('#teamBName').value=st.names.b;$('#teamAScore').textContent=st.scoreA;$('#teamBScore').textContent=st.scoreB;$('#teamAPlayer').textContent=playerA();$('#teamBPlayer').textContent=playerB();$('#levelBadge').textContent=st.level.toUpperCase();$('#roundMode').textContent=modeTitle(st.mode);$('#licenseStatus').textContent=pro()?`Plan actual: PRO${st.lic.expires?' · vence '+st.lic.expires:''}`:'Plan actual: GRATIS';
 $('#teamAList').innerHTML=st.a.length?st.a.map((p,i)=>`<div class="row"><b>${i+1}. ${p}</b><button data-da="${i}">Eliminar</button></div>`).join(''):'<small>Sin jugadores.</small>';
 $('#teamBList').innerHTML=st.b.length?st.b.map((p,i)=>`<div class="row"><b>${i+1}. ${p}</b><button data-db="${i}">Eliminar</button></div>`).join(''):'<small>Sin jugadores.</small>';
 $$('[data-da]').forEach(b=>b.onclick=()=>{st.a.splice(Number(b.dataset.da),1);save();render()});$$('[data-db]').forEach(b=>b.onclick=()=>{st.b.splice(Number(b.dataset.db),1);save();render()});
 $('#historyList').innerHTML=st.hist.length?st.hist.slice().reverse().map(x=>`<div class="row"><div><b>${x.winner}</b><br><small>${x.mode} · ${x.level.toUpperCase()} · ${x.text}</small></div><small>${new Date(x.date).toLocaleTimeString()}</small></div>`).join(''):'<small>Sin rondas todavía.</small>';
}
function modeTitle(m){return({relampago:'PREGUNTA RELÁMPAGO',duelo:'DUELO 1 VS 1',mimica:'MÍMICA',quien:'¿QUIÉN SABE MÁS?',roba:'ROBA PUNTOS',final:'BATALLA FINAL'})[m]||m}
function chooseLevel(l){if(['hot','picante','extremo'].includes(l)&&!pro()){alert('Este nivel pertenece a PRO.');show('pro');return}st.level=l;$$('.level').forEach(b=>b.classList.toggle('active',b.dataset.level===l));render()}
$$('.level').forEach(b=>b.onclick=()=>chooseLevel(b.dataset.level));
$$('.mode-card').forEach(b=>b.onclick=()=>{let m=b.dataset.mode;if(['roba','final'].includes(m)&&!pro()){alert('Este modo pertenece a PRO.');show('pro');return}st.mode=m;$$('.mode-card').forEach(x=>x.classList.toggle('active',x===b));render()});
function newRound(){if(!st.a.length||!st.b.length){alert('Agrega jugadores a ambos equipos.');show('equipos');return}let arr=content[st.level],text=arr[Math.floor(Math.random()*arr.length)];$('#roundTitle').textContent=modeTitle(st.mode);$('#roundText').textContent=text;st.idxA=(st.idxA+1)%st.a.length;st.idxB=(st.idxB+1)%st.b.length;render()}
function award(team){
 let pts=st.double?2:1;if(st.mode==='roba'&&pro())pts=2;if(st.mode==='final'&&pro())pts=3;
 if(team==='A')st.scoreA+=pts;else st.scoreB+=pts;
 let winner=team==='A'?st.names.a:st.names.b;st.hist.push({winner,mode:modeTitle(st.mode),level:st.level,text:$('#roundText').textContent,date:new Date().toISOString()});
 $('#winnerTeam').textContent=`${winner} +${pts}`;$('#winnerModal').classList.remove('hidden');st.double=false;save();render()
}
$('#teamAWinBtn').onclick=()=>award('A');$('#teamBWinBtn').onclick=()=>award('B');$('#newRoundBtn').onclick=newRound;$('#skipRoundBtn').onclick=newRound;$('#doubleBtn').onclick=()=>{st.double=!st.double;$('#doubleBtn').textContent=st.double?'✌️ DOBLE ACTIVADO':'✌️ DOBLE O NADA'};
function addPlayer(team){let inp=team==='A'?$('#teamAPlayerInput'):$('#teamBPlayerInput'),arr=team==='A'?st.a:st.b;if(!pro()&&arr.length>=4){alert('El plan Gratis permite hasta 4 jugadores por equipo.');show('pro');return}let n=inp.value.trim();if(n){arr.push(n);inp.value='';save();render()}}
$('#addTeamAPlayer').onclick=()=>addPlayer('A');$('#addTeamBPlayer').onclick=()=>addPlayer('B');
$('#teamAName').onchange=()=>{st.names.a=$('#teamAName').value.trim()||'EQUIPO A';save();render()};$('#teamBName').onchange=()=>{st.names.b=$('#teamBName').value.trim()||'EQUIPO B';save();render()};
$('#startTimerBtn').onclick=()=>{clearInterval(st.timer);let s=Math.max(5,Number($('#roundSeconds').value)||20);$('#timer').textContent=s;st.timer=setInterval(()=>{s--;$('#timer').textContent=s;if(s<=0){clearInterval(st.timer);navigator.vibrate?.(200)}},1000)};
$('#clearHistoryBtn').onclick=()=>{if(confirm('¿Borrar historial?')){st.hist=[];save();render()}};
$('#resetGameBtn').onclick=()=>{if(confirm('¿Reiniciar puntajes e historial?')){st.scoreA=0;st.scoreB=0;st.hist=[];save();render();show('batalla')}};
$('#buyProBtn').onclick=()=>window.open('https://wa.me/593984423035?text='+encodeURIComponent('Hola, deseo adquirir HAVYCO Guerra de Sexos PRO. Por favor, envíeme los datos para realizar el depósito y activar mi licencia.'),'_blank');
$('#activateLicenseBtn').onclick=async()=>{try{let o=await verifyHVGS($('#licenseCode').value);st.lic={plan:'PRO',client:o.client||'',expires:o.expires||null,id:o.id||'',code:$('#licenseCode').value.replace(/\s+/g,'')};save();render();alert('HAVYCO Guerra de Sexos PRO activado correctamente.')}catch(e){alert(e.message||'Licencia inválida.')}};
$('#closeWinnerModal').onclick=()=>$('#winnerModal').classList.add('hidden');
$('#enterBtn').onclick=()=>{if(!$('#ageCheck').checked)return alert('Debes confirmar que eres mayor de 18 años.');localStorage.setItem(K.age,'1');$('#ageGate').classList.add('hidden')};if(localStorage.getItem(K.age)==='1')$('#ageGate').classList.add('hidden');
function online(){offlineBadge.classList.toggle('hidden',navigator.onLine)}addEventListener('online',online);addEventListener('offline',online);online();addEventListener('beforeinstallprompt',e=>{e.preventDefault();st.prompt=e;$('#installBtn').classList.remove('hidden')});$('#installBtn').onclick=async()=>{if(/iPhone|iPad|iPod/.test(navigator.userAgent))return alert('En iPhone: Safari > Compartir > Agregar a Inicio.');if(st.prompt){st.prompt.prompt();await st.prompt.userChoice;st.prompt=null;$('#installBtn').classList.add('hidden')}else alert('Usa el menú del navegador para instalar.')};
render();if('serviceWorker'in navigator)navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
