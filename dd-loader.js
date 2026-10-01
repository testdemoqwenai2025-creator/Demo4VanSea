(function(){
  var dpO=document.getElementById('dp-overlay');
  var dpP=document.getElementById('dp-panel');
  var dpT=document.getElementById('dp-title');
  var dpB=document.getElementById('dp-body');
  var dpC=document.getElementById('dp-close');
  if(!dpP||!dpO){return;}

  function openDP(t,s,b){dpT.textContent=t;dpB.innerHTML=b;dpP.classList.add('open');dpO.classList.add('open');document.body.style.overflow='hidden';}
  function closeDP(){dpP.classList.remove('open');dpO.classList.remove('open');document.body.style.overflow='';}

  function dpClick(id){var d=window.__DD_DATA[id];if(!d)return;openDP(d.t,d.s,d.b);}

  // Use capture phase to intercept clicks before the IIFE handler
  document.addEventListener('click',function(e){
    var c=e.target.closest('[data-detail]');
    if(c&&window.__DD_DATA&&window.__DD_DATA[c.getAttribute('data-detail')]){
      dpClick(c.getAttribute('data-detail'));
      e.stopImmediatePropagation();
    }
  },true);

  if(dpC)dpC.addEventListener('click',closeDP);
  if(dpO)dpO.addEventListener('click',closeDP);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeDP();});

  fetch('dd-data.json').then(function(r){return r.json();}).then(function(data){
    window.__DD_DATA=data;
  }).catch(function(e){});
})();
