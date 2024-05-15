import{a as y,S as L,i as p}from"./assets/vendor-09d7c26e.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const t of s)if(t.type==="childList")for(const u of t.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&n(u)}).observe(document,{childList:!0,subtree:!0});function a(s){const t={};return s.integrity&&(t.integrity=s.integrity),s.referrerPolicy&&(t.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?t.credentials="include":s.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function n(s){if(s.ep)return;s.ep=!0;const t=a(s);fetch(s.href,t)}})();const g=r=>r.map(e=>`
    <li class="image-card">
        <a href="${e.largeImageURL}"
          ><img src="${e.webformatURL}" alt="${e.tags}"/>
        </a>
        <ul class="img-descr">
          <li class="descr-el">Likes <span>${e.likes}</span></li>
          <li class="descr-el">Views <span>${e.views}</span></li>
          <li class="descr-el">Comments <span>${e.comments}</span></li>
          <li class="descr-el"> Downloads <span>${e.downloads}</span></li>
        </ul>
      </li>`).join(""),w="43829548-da808e6ec6af8b5210a63f940",b="https://pixabay.com/api/",f=async(r,e)=>await y.get(b,{params:{key:w,q:r,image_type:"photo",orientation:"horizontal",safesearch:!0,page:e,per_page:15}}),h=new L(".gallery-list a",{captionsData:"alt",captionDelay:250}),l=document.querySelector(".gallery-list"),M=document.querySelector(".search-form"),o=document.querySelector(".loader"),i=document.querySelector(".loadMoreBtn");let d="",c,m;async function S(r){r.preventDefault();try{if(d=r.currentTarget.elements.userInput.value.trim(),i.classList.add("is-hidden"),d==="")return l.innerHTML="",r.currentTarget.reset(),p.warning({message:"Type your query, please!",position:"center",timeout:3e3});l.innerHTML="",c=1,o.classList.remove("is-hidden");const e=await f(d,c);console.log("responseObj: ",e);const a=e.data.hits;console.log("imgArray: ",a);const n=e.data.totalHits,s=e.config.params.per_page;if(m=Math.ceil(n/s),a.length===0)return console.log("No images found"),o.classList.add("is-hidden"),r.currentTarget.reset(),p.error({message:"Sorry, there are no images matching your search query. Please try again!",timeout:3e3,position:"topRight",backgroundColor:"#ef4040",messageColor:"#fafafb",messageSize:"16px",messageLineHeight:"1.5",iconColor:"#fafafb"});o.classList.add("is-hidden");const t=await g(a);l.innerHTML=t,m>1&&i.classList.remove("is-hidden"),r.target.reset(),h.refresh()}catch{return o.classList.add("is-hidden"),i.classList.add("is-hidden"),new Error("Oops, something went wrong 😞")}}async function O(){try{c++,o.classList.remove("is-hidden");const e=(await f(d,c)).data.hits,a=await g(e);o.classList.add("is-hidden"),l.innerHTML+=a;const s=document.querySelector(".image-card").getBoundingClientRect();if(window.scrollBy({top:s.height*2,behavior:"smooth"}),h.refresh(),c>=m)return i.classList.add("is-hidden"),p.info({position:"topRight",message:"We're sorry, there are no more pictures to load"})}catch{return o.classList.add("is-hidden"),i.classList.add("is-hidden"),new Error("Oops, something went wrong 😞")}}M.addEventListener("submit",S);i.addEventListener("click",O);
//# sourceMappingURL=commonHelpers.js.map
