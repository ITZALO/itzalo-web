  // Mobile menu toggle
  (function(){
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('mobileMenu');
    if(!toggle || !menu) return;
    function closeMenu(){
      menu.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded','false');
    }
    function openMenu(){
      menu.classList.add('open');
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded','true');
    }
    toggle.addEventListener('click', function(){
      if(menu.classList.contains('open')) closeMenu(); else openMenu();
    });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', function(){
      if(window.innerWidth > 1040) closeMenu();
    });
  })();

  // Primeros trabajos: carousel arrows + one-time scan sweep per card.
  (function(){
    var track = document.getElementById('jobsTrack');
    if(!track) return;
    var prev = document.getElementById('jobsPrev');
    var next = document.getElementById('jobsNext');
    function step(dir){
      var card = track.querySelector('.job-card');
      var gap = 22;
      var amount = card ? (card.getBoundingClientRect().width + gap) : 300;
      track.scrollBy({ left: dir * amount, behavior: 'smooth' });
    }
    if(prev) prev.addEventListener('click', function(){ step(-1); });
    if(next) next.addEventListener('click', function(){ step(1); });

    if('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add('scan-play');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: .4 });
      track.querySelectorAll('.job-card').forEach(function(card){ io.observe(card); });
    }
  })();

  // FAQ accordion — one open at a time.
  (function(){
    var items = document.querySelectorAll('.faq-item');
    if(!items.length) return;
    items.forEach(function(item){
      var btn = item.querySelector('.faq-q');
      if(!btn) return;
      btn.addEventListener('click', function(){
        var wasOpen = item.classList.contains('open');
        items.forEach(function(i){
          i.classList.remove('open');
          var b = i.querySelector('.faq-q');
          if(b) b.setAttribute('aria-expanded','false');
        });
        if(!wasOpen){
          item.classList.add('open');
          btn.setAttribute('aria-expanded','true');
        }
      });
    });
  })();

  // Primeros trabajos: click/tap a photo (or press Enter/Space on it) to open it enlarged.
  (function(){
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxCaption = document.getElementById('lightboxCaption');
    var closeBtn = document.getElementById('lightboxClose');
    if(!lightbox || !lightboxImg) return;
    var lastFocused = null;

    function openFrom(photoEl){
      var img = photoEl.querySelector('img');
      if(!img) return;
      lastFocused = photoEl;
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt || '';
      var title = photoEl.closest('.job-card');
      title = title ? title.querySelector('.job-body h4') : null;
      lightboxCaption.textContent = title ? title.textContent : '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }
    function close(){
      lightbox.hidden = true;
      document.body.style.overflow = '';
      lightboxImg.src = '';
      if(lastFocused) lastFocused.focus();
    }

    document.querySelectorAll('.job-photo').forEach(function(photo){
      photo.addEventListener('click', function(){ openFrom(photo); });
      photo.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          openFrom(photo);
        }
      });
    });
    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', function(e){
      if(e.target === lightbox) close();
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && !lightbox.hidden) close();
    });
  })();

  // Subtle reveal-on-scroll. Safe by default: elements stay fully visible
  // unless JS runs and IntersectionObserver is supported.
  (function(){
    if(!('IntersectionObserver' in window)) return;
    var els = document.querySelectorAll('.reveal');
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.remove('reveal-hidden');
          entry.target.classList.add('reveal-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .15, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function(el){
      var r = el.getBoundingClientRect();
      if(r.top > window.innerHeight * .2){
        el.classList.add('reveal-hidden');
      }
      io.observe(el);
    });
  })();
