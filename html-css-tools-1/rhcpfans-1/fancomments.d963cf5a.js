function e(e){return e&&e.__esModule?e.default:e}var n;function t(e,n){const t=document.getElementById("comentarios");e.forEach((e=>{const o=document.createElement("div");o.classList.add("comentario"),n&&o.classList.add("typing-animation");const a=document.createElement("p");a.classList.add("nombre"),a.textContent=e.nombre,o.appendChild(a);const i=document.createElement("p");i.classList.add("comentario-texto"),i.textContent=e.comentario,o.appendChild(i);const d=document.createElement("p");d.classList.add("datetime"),d.textContent=new Date(e.datetime).toDateString(),o.appendChild(d);let s=t.firstChild;const m=document.createElement("li");m.appendChild(o),t.insertBefore(m,s)}))}n=JSON.parse('[{"nombre":"Juan","comentario":"Los Red Hot Chili Peppers son una de las mejores bandas de rock de todos los tiempos. ¡Su música es increíble!","datetime":"2023-03-28T12:00:00"},{"nombre":"María","comentario":"Me encanta su energía en el escenario y la química que tienen como banda. ¡Sus conciertos son una experiencia inolvidable!","datetime":"2023-03-28T14:30:00"},{"nombre":"Pedro","comentario":"Los Red Hot Chili Peppers son una leyenda viva del rock. ¡Su música es atemporal y siempre estará en mi corazón!","datetime":"2023-03-28T16:15:00"},{"nombre":"Ana","comentario":"La voz de Anthony Kiedis y el bajo de Flea son simplemente espectaculares. ¡No puedo esperar a verlos en vivo de nuevo!","datetime":"2023-03-28T18:00:00"},{"nombre":"Lucas","comentario":"Los Red Hot Chili Peppers son una de las bandas más influyentes de la historia del rock. ¡Su música es pura energía y diversión!","datetime":"2023-03-28T20:30:00"}]'),window.enviarComentario=function(){const e=document.getElementById("loading-container");e.classList.remove("loading-hidden"),e.classList.add("loading-visible"),setTimeout((function(){e.classList.remove("loading-visible"),e.classList.add("loading-hidden"),t([{nombre:document.getElementById("nombre").value,comentario:document.getElementById("comentario").value,datetime:new Date}],!0),document.getElementById("nombre").value="",document.getElementById("comentario").value=""}),3e3)},t(e(n),!1);
//# sourceMappingURL=fancomments.d963cf5a.js.map
