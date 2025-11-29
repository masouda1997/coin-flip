document.addEventListener("DOMContentLoaded", () => {
  const coin = document.getElementById("gsapCoin");
  const result = document.getElementById("gsapResult");

  function infiniteBounce() {
    // از 'bounce.out' برای شبیه‌سازی افتادن و کمی ارتعاش استفاده می‌کنیم
    idleBounceTween = gsap.to(coin, {
      y: coin.offsetTop - 490,
      duration: 1,
      ease: "bounce.out",
      repeat: -1, // تکرار بی‌پایان
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

    // ۲. انیمیشن حرکت به وسط و قل خوردن
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

  // اجرای انیمیشن ورود بلافاصله پس از لود شدن محتوا
  loadEntranceAnimation();

  function flipCoin() {
    if (idleBounceTween) {
      idleBounceTween.kill();
      idleBounceTween = null;
      // اطمینان از اینکه سکه در موقعیت Y نهایی بماند
      gsap.set(coin, { y: 0 });
    }
    result.textContent = "";

    gsap
      .timeline()
      .to(coin, {
        y: -200,
        rotationY: 720, // چرخش حول محور افقی
        rotationX: 180, // کمی محور عمودی برای زیبایی
        duration: 0.8,
        ease: "power2.out",
      })
      .to(coin, {
        y: 0,
        rotationY: 1440,
        rotationX: 360,
        duration: 1.2,
        ease: "bounce.out",
        onComplete: () => {
          const chance = Math.random();
          console.log(chance);
          const outcome =
            chance < 0.5 ? "🪙 خط اومد باختی" : "🪙   شیر اومد بردی ";
          if (chance < 0.5) {
            coin.textContent = "";
            coin.style.backgroundImage = "url(../public/taile.png)";
          } else {
            coin.textContent = "";
            coin.style.backgroundImage = "url(../public/head.png)";
          }
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
  }

  // کلیک روی سکه → پرتاب اجرا شود
  coin.addEventListener("click", flipCoin);
});
