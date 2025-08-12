(function(){
  const gallery = document.getElementById('gallery');
  const cards = Array.from(gallery.querySelectorAll('.card'));
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lb-image');
  const lbCaption = document.getElementById('lb-caption');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');
  const thumbsRow = document.getElementById('thumbs');

  let currentIndex = 0;
  let activeFilter = 'all';
  let appliedClass = '';

  function buildThumbs(){
    thumbsRow.innerHTML = '';
    cards.forEach((c,i)=>{
      const img = c.querySelector('img').cloneNode();
      img.dataset.i = i;
      img.alt = c.querySelector('img').alt || '';
      img.addEventListener('click',()=>openAt(i));
      thumbsRow.appendChild(img);
    });
  }

  buildThumbs();

  function openAt(index){
    currentIndex = index;
    const card = cards[index];
    const img = card.querySelector('img');
    lbImage.src = img.src;
    lbImage.alt = img.alt || '';
    lbCaption.textContent = card.querySelector('.meta')?.textContent || img.alt || '';
    Array.from(thumbsRow.children).forEach(t=>t.classList.toggle('active', Number(t.dataset.i)===index));
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    applyPreviewFilter();
    lbClose.focus();
  }

  function closeLightbox(){
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
  }

  function showNext(){
    let i = currentIndex;
    for(let k=1;k<=cards.length;k++){
      const candidate = (i + k) % cards.length;
      if(isCardVisible(cards[candidate])){ openAt(candidate); break; }
    }
  }

  function showPrev(){
    let i = currentIndex;
    for(let k=1;k<=cards.length;k++){
      const candidate = (i - k + cards.length) % cards.length;
      if(isCardVisible(cards[candidate])){ openAt(candidate); break; }
    }
  }

  cards.forEach((card, i)=>{
    card.addEventListener('click',()=>openAt(i));
    card.addEventListener('keydown', (ev)=>{ if(ev.key==='Enter' || ev.key===' ') openAt(i) });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbNext.addEventListener('click', showNext);
  lbPrev.addEventListener('click', showPrev);
  lightbox.addEventListener('click', (e)=>{ if(e.target===lightbox) closeLightbox(); });

  document.addEventListener('keydown', (e)=>{
    if(lightbox.classList.contains('open')){
      if(e.key === 'ArrowRight') showNext();
      if(e.key === 'ArrowLeft') showPrev();
      if(e.key === 'Escape') closeLightbox();
    }
  });

  const catButtons = Array.from(document.querySelectorAll('.btn.toggle'));
  catButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      catButtons.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.cat;
      applyFilter();
    });
  });

  function isCardVisible(card){
    if(activeFilter === 'all') return true;
    return card.dataset.cat === activeFilter;
  }

  function applyFilter(){
    cards.forEach(c=>{
      if(isCardVisible(c)){
        c.style.display = '';
        c.inert = false;
      } else {
        c.style.display = 'none';
        c.inert = true;
      }
    });
  }

  const btnNone = document.getElementById('filter-none');
  const btnGray = document.getElementById('filter-gray');
  const btnSepia = document.getElementById('filter-sepia');
  const btnSat = document.getElementById('filter-sat');
  const filterBtns = [btnNone, btnGray, btnSepia, btnSat];

  function clearFilterBtns(){ filterBtns.forEach(b=>b.classList.remove('primary')) }

  function applyPreviewFilter(){
    const preview = lbImage;
    preview.className = '';
    if(appliedClass) preview.classList.add(appliedClass);
  }

  btnNone.addEventListener('click', ()=>{
    appliedClass='';
    clearFilterBtns();
    btnNone.classList.add('primary');
    gallery.className = 'grid';
  });

  btnGray.addEventListener('click', ()=>{
    appliedClass='f-grayscale';
    clearFilterBtns();
    btnGray.classList.add('primary');
    gallery.className = 'grid f-grayscale';
  });

  btnSepia.addEventListener('click', ()=>{
    appliedClass='f-sepia';
    clearFilterBtns();
    btnSepia.classList.add('primary');
    gallery.className = 'grid f-sepia';
  });

  btnSat.addEventListener('click', ()=>{
    appliedClass='f-saturate';
    clearFilterBtns();
    btnSat.classList.add('primary');
    gallery.className = 'grid f-saturate';
  });

  btnNone.classList.add('primary');
  applyFilter();

  const observer = new MutationObserver(()=>{
    if(lightbox.classList.contains('open')) applyPreviewFilter();
  });
  observer.observe(gallery, {attributes:true, attributeFilter:['class']});
})();
