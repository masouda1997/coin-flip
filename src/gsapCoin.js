document.addEventListener("DOMContentLoaded", () => {
  const coin = document.getElementById("gsapCoin");
  const result = document.getElementById("gsapResult");

  function infiniteBounce() {
    idleBounceTween = gsap.to(coin, {
      y: coin.offsetTop - 490,
      duration: 1,
      ease: "bounce.out",
      repeat: -1,
      yoyo: true, // بازگشت به حالت قبل (بالا و پایین رفتن)
    });
  }
  function loadEntranceAnimation() {
    // ۱. تنظیم موقعیت اولیه: خارج از دید از سمت راست
    gsap.set(coin, {
      x: window.innerWidth,
      rotation: 0,
      y: 0, // مطمئن می‌شویم در ارتفاع وسط است
    });

    gsap.to(coin, {
      duration: 2.5,
      x: window.innerWidth / 2 - 64, // مرکز صفحه (نصف عرض سکه ۶۴ پیکسل)
      rotation: -720,
      ease: "power4.out", // حرکت نرم و قوی رو به جلو
      onComplete: () => {
        // ۳. تثبیت نهایی و ریست کردن چرخش برای پرتاب‌های بعدی
        gsap.to(coin, {
          rotation: 0, // چرخش را صفر می‌کند
          duration: 1,
          ease: "elastic.out(0.6, 0.4)", // یک لرزش کوچک نهایی
          infiniteBounce,
        });
      },
    });
  }

  loadEntranceAnimation();

  function flipCoin() {
    if (idleBounceTween) {
      idleBounceTween.kill();
      idleBounceTween = null;
      // اطمینان از اینکه سکه در موقعیت Y نهایی بماند
      gsap.set(coin, { y: 0 });
    }
    result.textContent = "";
    const chance = Math.random();
    const isTail = chance < 0.5;

    const tl = gsap.timeline({
      onComplete: () => {
        const outcome = isTail ? "🪙 خط اومد باختی" : "🪙   شیر اومد بردی ";
        setTimeout(() => {
          result.textContent = ` ${outcome}`;
          gsap.from(result, {
            scale: 0.5,
            opacity: 0,
            duration: 0.4,
            ease: "back.out(1.7)",
          });
          return;
        }, 400);
      },
    });

    tl.to(coin, {
      y: -200,
      rotationY: 900,
      rotationX: 155,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        const progress = tl.progress();
        if (
          (progress >= 0 && progress < 0.05) ||
          (progress >= 0.1 && progress < 0.15) ||
          (progress >= 0.2 && progress < 0.25) ||
          (progress >= 0.3 && progress < 0.55)
        ) {
          coin.style.backgroundImage = "url(../public/head.png)";
        }
        if (
          (progress >= 0.05 && progress < 0.1) ||
          (progress >= 0.15 && progress < 0.2) ||
          (progress >= 0.25 && progress < 0.3)
        ) {
          coin.style.backgroundImage = "url(../public/taile.png)";
        }
      },
    }).to(coin, {
      y: 0,
      rotationY: 1440,
      rotationX: 360,
      duration: 1,
      ease: "bounce.out",
      onUpdate: () => {
        const progress = tl.progress();
        console.log(progress);
        if (progress >= 0.55 && progress < 0.65) {
          coin.style.backgroundImage = "url(../public/taile.png)";
        }
        if (progress >= 0.65 && progress < 0.7) {
          coin.style.backgroundImage = "url(../public/head.png)";
        }
        if (progress >= 0.7) {
          coin.style.backgroundImage = isTail
            ? "url(../public/taile.png)"
            : "url(../public/head.png)";
        }
      },
    });
  }
  coin.addEventListener("click", flipCoin);
});
