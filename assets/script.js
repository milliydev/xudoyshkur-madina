(function(){
  var T = {
    uz:{special:"Sizga maxsus taklifnoma",inv:"taklifnoma",open:"Taklifnomani ochish",greet:"Assalomu alaykum, aziz mehmon!",and:"va",
      heroText:"Farzandlarimizning fotiha to‘yi munosabati bilan sizni aziz mehmonimiz bo‘lishga taklif qilamiz.",
      monthGen:"noyabr",when:"dushanba, soat 17:00",cdKick:"Sanoq boshlandi",cdTitle:"Fotiha to‘yigacha qolgan vaqt",
      cdText:"Bu quvonchli kunni siz bilan birga kutamiz",d:"kun",h:"soat",m:"daqiqa",s:"soniya",done:"Bugun fotiha to‘yimiz!",
      calKick:"Belgilab qo‘ying",calTitle:"Muhim sana",month:"Noyabr 2026",addCal:"Taqvimga qo‘shish",
      wd:["Du","Se","Ch","Pa","Ju","Sh","Ya"],pKick:"Kechamiz",pTitle:"Fotiha to‘yi dasturi",
      p1:"Mehmonlarni kutib olish",p2:"Fotiha marosimi va duo",p3:"Bazm va tabriklar",p4:"Xayrlashuv",
      lKick:"Qayerda",lTitle:"Marosim manzili",openMap:"Xaritada ochish",place:"“Baxt” to‘yxonasi",
      addr:"Sizni “Baxt” to‘yxonasida kutamiz",wait:"Sizni intizorlik bilan kutamiz!",
      evt:"Xudoyshukur va Madinaning fotiha to‘yi"},
    ru:{special:"Особое приглашение для вас",inv:"приглашение",open:"Открыть приглашение",greet:"Дорогой гость!",and:"и",
      heroText:"Приглашаем вас разделить с нами радость фатиха-туя наших детей.",
      monthGen:"ноября",when:"понедельник, в 17:00",cdKick:"Отсчёт начался",cdTitle:"До фатиха-туя осталось",
      cdText:"Ждём этот радостный день вместе с вами",d:"дней",h:"часов",m:"минут",s:"секунд",done:"Сегодня наш фатиха-туй!",
      calKick:"Отметьте",calTitle:"Важная дата",month:"Ноябрь 2026",addCal:"Добавить в календарь",
      wd:["Пн","Вт","Ср","Чт","Пт","Сб","Вс"],pKick:"Наш вечер",pTitle:"Программа вечера",
      p1:"Встреча гостей",p2:"Обряд фатиха и благословение",p3:"Праздник и поздравления",p4:"Прощание с гостями",
      lKick:"Где",lTitle:"Место торжества",openMap:"Открыть карту",place:"Тойхана «Бахт»",
      addr:"Ждём вас в тойхане «Бахт»",wait:"С нетерпением ждём вас!",
      evt:"Фатиха-туй Худойшукура и Мадины"}
  };
  var lang = "uz";
  try{ var saved = localStorage.getItem("xm-lang"); if(saved && T[saved]) lang = saved; }catch(e){}

  var addrQuery = "Baxt to'yxonasi";
  var q = encodeURIComponent(addrQuery);
  document.getElementById("yandex").href = "https://yandex.uz/maps/?text=" + q;
  document.getElementById("google").href = "https://www.google.com/maps/search/?api=1&query=" + q;
  document.getElementById("mapTag").href = "https://www.google.com/maps/search/?api=1&query=" + q;

  function renderCal(){
    var c = document.getElementById("cal"), h = "";
    T[lang].wd.forEach(function(w){ h += '<div class="wd">'+w+'</div>'; });
    // 1 Nov 2026 is a Sunday -> 6 blanks (week starts Monday)
    for(var i=0;i<6;i++) h += '<div class="d"></div>';
    for(var d=1; d<=30; d++){
      if(d===9) h += '<div class="d hit"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.3 3 4.5 6.7 4.5c2.2 0 3.6 1.3 5.3 3.2 1.7-1.9 3.1-3.2 5.3-3.2 3.7 0 5.8 3.8 4.3 7.3C19.5 16.4 12 21 12 21z"/></svg><span>9</span></div>';
      else h += '<div class="d">'+d+'</div>';
    }
    c.innerHTML = h;
  }
  function setLang(l){
    lang = l;
    document.documentElement.lang = l;
    document.querySelectorAll("[data-i]").forEach(function(el){ var v = T[l][el.dataset.i]; if(typeof v==="string") el.textContent = v; });
    document.querySelectorAll(".lang button").forEach(function(b){ b.classList.toggle("on", b.dataset.lang===l); b.setAttribute("aria-pressed", b.dataset.lang===l); });
    renderCal();
    var g = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(T[l].evt) +
      "&dates=20261109T120000Z/20261109T170000Z&location=" + encodeURIComponent(T[l].addr);
    document.getElementById("gcal").href = g;
    try{ localStorage.setItem("xm-lang", l); }catch(e){}
  }
  document.querySelectorAll(".lang button").forEach(function(b){ b.addEventListener("click", function(){ setLang(b.dataset.lang); }); });
  setLang(lang);

  // countdown to 9 Nov 2026, 17:00 Tashkent (UTC+5)
  var target = new Date("2026-11-09T17:00:00+05:00").getTime();
  var el = {d:document.getElementById("cd-d"),h:document.getElementById("cd-h"),m:document.getElementById("cd-m"),s:document.getElementById("cd-s")};
  function pad(n){ return (n<10?"0":"")+n; }
  function tick(){
    var diff = Math.max(0, target - Date.now());
    var s = Math.floor(diff/1000);
    el.d.textContent = Math.floor(s/86400);
    el.h.textContent = pad(Math.floor(s%86400/3600));
    el.m.textContent = pad(Math.floor(s%3600/60));
    el.s.textContent = pad(s%60);
    if(diff===0) document.getElementById("doneMsg").hidden = false;
  }
  tick(); setInterval(tick, 1000);

  // music
  var bgm = document.getElementById("bgm"), mBtn = document.getElementById("musicBtn"), wantMusic = true, fadeT;
  function fadeIn(){
    clearInterval(fadeT); bgm.volume = 0;
    fadeT = setInterval(function(){ bgm.volume = Math.min(1, bgm.volume + 0.05); if(bgm.volume>=1) clearInterval(fadeT); }, 80);
  }
  function startMusic(){
    if(!wantMusic || !bgm.paused) return;
    var pr = bgm.play();
    if(pr && pr.then){ pr.then(function(){ fadeIn(); syncBtn(); }).catch(function(){}); } else { fadeIn(); }
  }
  function syncBtn(){ mBtn.classList.toggle("paused", bgm.paused); mBtn.setAttribute("aria-pressed", !bgm.paused); }
  bgm.addEventListener("play", syncBtn); bgm.addEventListener("pause", syncBtn);
  mBtn.addEventListener("click", function(){
    if(bgm.paused){ wantMusic = true; startMusic(); } else { wantMusic = false; bgm.pause(); }
  });
  // try right away; browsers usually wait for the first tap, so retry on any interaction
  startMusic();
  ["pointerdown","touchstart","keydown","click"].forEach(function(ev){
    document.addEventListener(ev, function once(e){
      if(e.target && e.target.closest && e.target.closest("#musicBtn")) return;
      startMusic();
    }, {passive:true});
  });

  // envelope
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function confetti(){
    if(reduce) return;
    var box = document.getElementById("confetti"), cols = ["#7a1a3d","#c9a465","#e8b8c7","#5c0f2c","#efdcae","#d4a0b0"];
    for(var i=0;i<90;i++){
      var p = document.createElement("i");
      p.style.left = Math.random()*100 + "vw";
      p.style.background = cols[i%cols.length];
      p.style.setProperty("--dx", (Math.random()*160-80) + "px");
      p.style.setProperty("--r", (Math.random()*900-450) + "deg");
      p.style.animationDuration = (2.4 + Math.random()*2.2) + "s";
      p.style.animationDelay = (Math.random()*0.8) + "s";
      if(Math.random()>.5){ p.style.width="6px"; p.style.height="6px"; p.style.borderRadius="50%"; }
      box.appendChild(p);
    }
    setTimeout(function(){ box.innerHTML = ""; }, 6000);
  }
  document.getElementById("openBtn").addEventListener("click", function(){
    startMusic();
    var intro = document.getElementById("intro");
    intro.classList.add("opening");
    document.getElementById("env").classList.add("open");
    setTimeout(confetti, reduce ? 0 : 1300);
    setTimeout(function(){
      intro.classList.add("gone");
      mBtn.classList.add("show");
      document.body.classList.remove("locked");
      window.scrollTo(0,0);
    }, reduce ? 50 : 3000);
  });
})();
