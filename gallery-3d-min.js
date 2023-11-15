function createGalleryBtn(e,t){let n=document.createElement("button"),r=new Image;return r.src=`./buttons/${e}.svg`,r.alt=t,r.title=t,n.appendChild(r),n}const galleries=document.querySelectorAll("[data-artwork]");galleries.forEach((e,t)=>{let n=e.getAttribute("data-artwork"),r=e.getAttribute("data-artwork-desc"),l=e.getAttribute("data-rows").split(",").map(e=>+e);e.classList.add("gallery-3d");let s=document.createElement("div");s.classList.add("gallery-3d__img-wrapper");let i=document.createElement("div");i.classList.add("gallery-3d__loader");let a=document.createElement("img");a.setAttribute("alt",r),a.classList.add("gallery-3d__img"),s.appendChild(a),e.appendChild(s);let c=document.createElement("p");c.classList.add("gallery-3d__desc"),c.textContent=`${t+1}. ${r}`,e.appendChild(c);let o=document.createElement("hr");o.classList.add("gallery-3d__hr"),e.appendChild(o);let d=!1,u=0,h=1,m=[],v=[],g,y,f=[];function p(){v[u]&&(a.src=v[u].currentSrc)}function L(){v=m.filter(e=>e.currentSrc.includes(`row-0${h}`)),(P||d)&&(v=v.filter(e=>e.currentSrc.includes("highres"))),p()}function E(e){return f.some(t=>t.includes(`row-0${h}_${e}`))}function $(t,r){return new Promise(l=>{let c=new Image;c.src=`./obrotowe/${n}/${"highres"===r?"highres/":""}${n}-row-0${h}_${t<10?"00":"0"}${t}.jpg`,c.onload=function(){m.push(c),g++,1===m.length&&(a.src=m[0].currentSrc),g===y&&(f.push(`row-0${h}_${r}`),m.sort((e,t)=>{let n=e.currentSrc,r=t.currentSrc;return n.localeCompare(r)}),L(r),s.removeChild(i),e.classList.remove("gallery-3d--loading")),l()}})}async function w(t){s.appendChild(i),e.classList.add("gallery-3d--loading");let n=[];y=l[h-1],g=0;for(let r=1;r<=y;r++)n.push($(r,t));await Promise.all(n)}w("lowres");let b=0;function _(){--u<0&&(u=l[h-1]-1),p()}function k(){++u===l[h-1]&&(u=0),p()}function z(){h<l.length&&(h++,(P||d)&&!E("highres")?w("highres"):E("highres")||E("lowres")?L():w("lowres"))}function C(){h>1&&(h--,(P||d)&&!E("highres")?w("highres"):L())}let B=document.createElement("div");B.classList.add("gallery-3d__buttons");let G=createGalleryBtn("left","obr\xf3ć w lewo"),X=createGalleryBtn("right","obr\xf3ć w prawo"),S=createGalleryBtn("up","obr\xf3ć do g\xf3ry"),x=createGalleryBtn("down","obr\xf3ć w d\xf3ł"),j=createGalleryBtn("zoomin","powiększ"),A=createGalleryBtn("zoomout","pomniejsz"),q=createGalleryBtn("play","uruchom automatyczne obracanie"),Y=createGalleryBtn("fullscreenon","uruchom w pełnym ekranie"),D=createGalleryBtn("fullscreenoff","zamknij pełny ekran");B.append(G,X,S,x,j,A,q,Y),s.appendChild(B),D.classList.add("gallery-3d__btn-x"),s.appendChild(D);let F=q.querySelector("img"),O=Y.querySelector("img"),R=!1,T;function N(){R=!0,F.src="./buttons/pause.svg",F.title="zatrzymaj automatyczne obracanie",T=setInterval(()=>{k()},200)}function H(){R=!1,F.src="./buttons/play.svg",F.title="uruchom automatyczne obracanie",clearInterval(T)}function I(){!1===R?N():H()}function J(){R&&H(),_()}function K(){R&&H(),k()}let M=1.5,P=!1,Q=0,U=0,V,W,Z=0,ee=0;function et(){a.style.transformOrigin="50% 50%"}function en(){a.style.transform=`scale(${M})`}function er(e){let t=s.getBoundingClientRect(),n=e.clientX-t.left,r=e.clientY-t.top;a.style.transformOrigin=`${n}px ${r}px`}function el(){let e=s.getBoundingClientRect(),t=e.width*M,n=e.height*M;V=(t-e.width)/2-10,W=(n-e.height)/2-10}function es(e){s.removeEventListener("mousemove",er),Q=e.touches[0].clientX,U=e.touches[0].clientY,ea(e)}function ei(e){e.preventDefault();let t=e.touches[0].clientX-Q,n=e.touches[0].clientY-U,r=Z+t,l=ee+n;Math.abs(r)>V&&(Z=r=r>0?V:-1*V),Math.abs(l)>W&&(ee=l=l>0?W:-1*W),a.style.transform=`translate(${r}px, ${l}px) scale(${M})`}function ea(e){Z+=e.changedTouches[0].clientX-Q,ee+=e.changedTouches[0].clientY-U}function ec(){P?M<3&&(M+=.5,en(),el()):(P=!0,s.addEventListener("mousemove",er),s.addEventListener("mouseleave",et),s.addEventListener("touchstart",es),s.addEventListener("touchmove",ei),s.addEventListener("touchend",ea),en(),el(),P&&!E("highres")?w("highres"):d&&!E("highres")?w("highres"):E("highres")||E("lowres")?L():w("lowres"))}function eo(){P&&(P=!1,a.style.transform="none",M=1.5,s.removeEventListener("mousemove",er),s.removeEventListener("mouseleave",et),s.removeEventListener("touchstart",es),s.removeEventListener("touchmove",ei),s.removeEventListener("touchend",ea))}function ed(){let e=b<0;e?_():k()}function eu(e){Math.abs(b=e.clientX-Q)>=10&&(ed(e),Q=e.clientX)}function eh(e){Math.abs(b=e.touches[0].clientX-Q)>=10&&(ed(e),Q=e.touches[0].clientX)}function em(){document.fullscreenElement?(s.classList.remove("gallery-3d_img-wrapper--fullscreen"),document.exitFullscreen()):e.requestFullscreen().then(()=>{s.classList.add("gallery-3d_img-wrapper--fullscreen"),E("highres")||w("highres")}).catch(e=>{alert(`Nie można przejść w tryb pełnoekranowy: ${e.message}`)})}function ev(){d?(s.classList.remove("gallery-3d_img-wrapper--fullscreen"),c.style.display="block",o.style.display="block",Y.style.display="block",D.style.display="none"):(c.style.display="none",o.style.display="none",Y.style.display="none",D.style.display="block"),d=!d,O.src=`buttons/${d?"fullscreenoff":"fullscreenon"}.svg`,O.title=`${d?"wyłącz":"włącz"} tryb pełnego ekranu`}a.addEventListener("dragstart",function(e){e.preventDefault()}),a.addEventListener("mousedown",function(e){a.style.cursor="grabbing",R&&H(),Q=e.clientX,a.addEventListener("mousemove",eu)}),a.addEventListener("mouseup",function(){a.style.cursor="grab",a.removeEventListener("mousemove",eu)}),a.addEventListener("mouseleave",function(){a.style.cursor="grab",a.removeEventListener("mousemove",eu)}),a.addEventListener("touchstart",function(e){Q=e.touches[0].clientX,P||a.addEventListener("touchmove",eh)}),a.addEventListener("touchend",function(){a.removeEventListener("touchmove",eh)}),a.addEventListener("touchcancel",function(){a.removeEventListener("touchmove",eh)}),document.addEventListener("fullscreenchange",ev),G.addEventListener("click",J),X.addEventListener("click",K),S.addEventListener("click",z),x.addEventListener("click",C),j.addEventListener("click",ec),A.addEventListener("click",eo),q.addEventListener("click",I),Y.addEventListener("click",em),D.addEventListener("click",em)});