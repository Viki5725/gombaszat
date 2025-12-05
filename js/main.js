mobilMenuInditas();
turaUrlapEllenorzes();
galeriaInditas();
userGalleryInit();

//mobil menü indítása
function mobilMenuInditas() {

    const gomb = document.querySelector(".menu-gomb");
    const menu = document.querySelector(".fo-menu");

    if (!gomb || !menu) {
        return;
    }

    gomb.addEventListener("click", function () {
        menu.classList.toggle("nyitva");
    });
}

//túra űrlap ellenőrzése/validálása
function turaUrlapEllenorzes() {

    const urlap = document.getElementById("tura-urlap");

    if (!urlap) {
        return;
    }

    const nevMezo = document.getElementById("nev");
    const emailMezo = document.getElementById("email");
    const telefonMezo = document.getElementById("telefon");
    const turaSelect = document.getElementById("tura");
    const tudasszintSelect = document.getElementById("tudasszint");
    const letszamMezo = document.getElementById("letszam");
    const felszerelesRadios = urlap.querySelectorAll('input[name="felszereles"]');


    urlap.addEventListener("submit", function (esemeny) {
       
        torolHibak(urlap);

        let ervenyes = true;

        //név nagy kezdőbetűs ellenőrzése
        const nev = nevMezo.value.trim().split(/\s+/);
        let nevHelyes = nev.length > 0 && nev.every(function (szo) {
            return szo[0] === szo[0].toUpperCase();
        });
        if (!nevHelyes) {
            hibauzenetHozzaad(nevMezo);
            ervenyes = false;
        }

        //email formátum ellenőrzése
        const email = emailMezo.value.trim();
        const emailMinta = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailMinta.test(email)) {
            hibauzenetHozzaad(emailMezo);
            ervenyes = false;
        }

        //telefon formátum ellenőrzése
        const telefon = telefonMezo.value.trim();
        const telefonMinta = /^(?:\+36|06)[0-9\s-]{7,}$/;
        if (!telefonMinta.test(telefon)) {
            hibauzenetHozzaad(telefonMezo);
            ervenyes = false;
        }

        //túra kiválasztás ellenőrzése
        if (!turaSelect.value) {
            hibauzenetHozzaad(turaSelect);
            ervenyes = false;
        }

        //tudásszint kiválasztás ellenőrzése
        if (!tudasszintSelect.value) {
            hibauzenetHozzaad(tudasszintSelect);
            ervenyes = false;
        }

        //felszerelés választás ellenőrzése
        let vanFelszerelesValasztas = false;
        felszerelesRadios.forEach(function (radio) {
            if (radio.checked) {
                vanFelszerelesValasztas = true;
            }
        });
        if (!vanFelszerelesValasztas) {
            if (felszerelesRadios[0]) {
                hibauzenetHozzaad(felszerelesRadios[0]);
            }
            ervenyes = false;
        }

        //létszám ellenőrzése (1-10 között)
        const letszam = Number(letszamMezo.value);
        if (!Number.isInteger(letszam) || letszam < 1 || letszam > 10) {
            hibauzenetHozzaad(letszamMezo);
            ervenyes = false;
        }

        //ha nem érvényes bármelyik űrlap mező, akkor megakadályozzuk az űrlap elküldését
        if (!ervenyes) {
            esemeny.preventDefault();
        }
    });
}

//hibaüzenet és hiba helyének jelzése
function hibauzenetHozzaad(mezo) {

    mezo.classList.add("hibas-mezo");

    const urlapHiba = document.getElementById("urlap-hiba");
    if (urlapHiba) {
        urlapHiba.style.display = "block";  
    }
}

//hibák törlése az űrlap újraellenőrzése előtt
function torolHibak(urlap) {

    let hibasMezok = urlap.querySelectorAll(".hibas-mezo");

    hibasMezok.forEach(function (m) {
        m.classList.remove("hibas-mezo");
    });

    const urlapHiba = document.getElementById("urlap-hiba");
    if (urlapHiba) {
        urlapHiba.style.display = "none";
    }
}

//képgaléria
function galeriaInditas() {

    const galerias = document.querySelectorAll(".js-galeria");
    const ablak = document.getElementById("galeria-ablak");

    if (!galerias || galerias.length === 0 || !ablak) {
        return;
    }

    const ablakKep = document.getElementById("ablak-kep");
    const ablakFelirat = document.getElementById("ablak-felirat");
    const zarGomb = document.getElementById("ablak-zar");

    //galéria képre kattintás eseménykezelő
    galerias.forEach(function (galeria) {
        galeria.addEventListener("click", function (esemeny) {
        const cel = esemeny.target;

        if (cel.tagName && cel.tagName.toLowerCase() === "img") {
            const nev = cel.getAttribute("data-gomba-nev");
            const full = cel.getAttribute('data-full');

            ablakKep.src = full ? full : cel.src;
            ablakKep.alt = cel.alt;
            ablakFelirat.textContent = nev ? nev : cel.alt;

            ablak.classList.add("nyitva");
        }
        });
    });

    //galéria ablak bezáró gomb eseménykezelő
    zarGomb.addEventListener("click", function () {
        ablak.classList.remove("nyitva");
    });
}

//galéria lapozása
function userGalleryInit() {
    const widget = document.querySelector('.user-gallery');

    if (!widget) {
        return;
    }

    const track = widget.querySelector('.gallery-track');
    const originalElems = Array.from(track.querySelectorAll('.galeria-elem'));
    const prev = widget.querySelector('.gallery-nav--left');
    const next = widget.querySelector('.gallery-nav--right');

    if (!track || !originalElems.length) {
        return;
    }
    
    //kezdeti beállítások
    for (let i = originalElems.length - 1; i >= 0; i--) {
    const cloneBefore = originalElems[i].cloneNode(true);
    track.insertBefore(cloneBefore, track.firstChild);
    }
    originalElems.forEach((el) => {
    const cloneAfter = el.cloneNode(true);
    track.appendChild(cloneAfter);
    });

    //változók
    const allElems = Array.from(track.querySelectorAll('.galeria-elem'));
    const totalCount = originalElems.length;
    let itemWidth = 0;
    let currentIndex = 0;
    const offsetIndex = totalCount;
    let isTransitioning = false;

    //elemek szélességének újraszámolása
    function recalcItemWidth() {
        if (allElems.length > 1) {
            itemWidth = allElems[1].offsetLeft - allElems[0].offsetLeft;
            if (!itemWidth || itemWidth <= 0) {
                itemWidth = allElems[0].offsetWidth;
            }
        } else if (allElems.length === 1) {
            itemWidth = allElems[0].offsetWidth;
        } else {
            itemWidth = 0;
        }
    }
    
    
    //lapozás frissítése
    function update(animate) {
        recalcItemWidth();
        if (animate !== false) {
            track.style.transition = 'transform 0.4s ease';
        } else {
            track.style.transition = 'none';
        }
        const offsetPx = (offsetIndex + currentIndex) * itemWidth;
        track.style.transform = `translateX(${-offsetPx}px)`;
    }

    //végtelenített lapozás
    function onTransitionEnd() {
        isTransitioning = false;
        if (currentIndex >= totalCount) {
            currentIndex = currentIndex - totalCount;
            update(false);
        } else if (currentIndex < 0) {
            currentIndex = currentIndex + totalCount;
            update(false);
        }
    }

    track.addEventListener('transitionend', onTransitionEnd);

    //visszagomb működése
    if (prev) {
     prev.addEventListener('click', function () { 
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex--;
        update(true);
    });
    }
    
    //előre gomb működése
    if (next) {
        next.addEventListener('click', function () { 
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        update(true);
    });
    }

    //ablak átméretezés
    window.addEventListener('resize', function () {
        update(false);
    });

    update(false);
}