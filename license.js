const HVGS_PUBLIC_KEY=`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAn5eHwyWTR74hPnpSk9aM
d9xfii+l9gNdRwS26zpvtMc5Vt3BDn5Qe+J+Zo8/u7h7enb9vBCV5MNSOHqaipfH
1ELDBMr0dnHpkeDfCkxw2tuBN9DahOUh5gpN8lP0CT2tHAo8YSdDqljTwEyZBIcd
HXAi+lxD4YSS4BU69IALvwh6YvER/0EJpQDtQlN+AZ4pg/wv5yk8SiGKbbB6zvdi
73pJt8nnJpdE+XVEwUEO7gHNEG8SIuHOVUpyXi2ikR2etOh+9LGq3f77TrZQVSBx
nYAogOH3C20a3sippzHow/FynXM4yIU/ebwuMb5FTaaYACg4QkBLpRuh4DAhPbPn
vQIDAQAB
-----END PUBLIC KEY-----`;
function gsB64(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const b=atob(s);return Uint8Array.from(b,c=>c.charCodeAt(0))}
function gsPem(p){const b=p.replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\s+/g,'');const x=atob(b);return Uint8Array.from(x,c=>c.charCodeAt(0)).buffer}
async function verifyHVGS(raw){
 const c=String(raw||'').replace(/\s+/g,'').trim(),p=c.split('.');
 if(p.length!==3||p[0]!=='HVGS1')throw new Error('Formato de licencia inválido.');
 const d=gsB64(p[1]),sig=gsB64(p[2]);
 const key=await crypto.subtle.importKey('spki',gsPem(HVGS_PUBLIC_KEY),{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
 const ok=await crypto.subtle.verify({name:'RSASSA-PKCS1-v1_5'},key,sig,d);
 if(!ok)throw new Error('Firma de licencia inválida.');
 const o=JSON.parse(new TextDecoder().decode(d));
 if(o.product!=='GUERRA_SEXOS')throw new Error('La licencia no corresponde a esta aplicación.');
 if(o.expires&&new Date(o.expires+'T23:59:59')<new Date())throw new Error('La licencia está vencida.');
 return o;
}
