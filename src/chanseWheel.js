const container = document.getElementById("spinner-container");
const numSegments = 28;
const arcSize = 360 / numSegments;
const centerX = 220;
const centerY = 220;
const radius = 220;
const spinButton = document.getElementById("spinButton");

// رنگ‌های سفارشی (ترکیب آبی، مشکی و طلایی/زرد)
const segmentColors = [
  0x141820, // مشکی
  0x325cfe, // آبی کمی روشن‌تر
];

// --- راه‌اندازی PixiJS ---
const app = new PIXI.Application({
  width: 440,
  height: 440,
  background: 0x7381a5,
  transparent: true,
  antialias: true,
});
container.appendChild(app.view);

const wheelContainer = new PIXI.Container();
wheelContainer.x = centerX;
wheelContainer.y = centerY;

// --- اضافه کردن بک‌گراند (Sprite) به عنوان اولین لایه (زیرین) ---
// (👈 تغییر/اضافه شده)
// فرض بر این است که metal_texture.jpg در پوشه public قرار دارد.
try {
  const texture = PIXI.Texture.from("/public/metal_texture.jpg");
  const bgSprite = new PIXI.Sprite(texture);
  bgSprite.anchor.set(0.5);
  bgSprite.x = centerX;
  bgSprite.y = centerY;
  // این را قبل از اضافه کردن wheelContainer اضافه می‌کنیم تا پشت آن قرار گیرد.
  app.stage.addChild(bgSprite);
} catch (e) {
  console.warn(
    "Could not load background texture. Using default canvas background."
  );
  // اگر عکس لود نشد، از بک‌گراند خود اپ استفاده کن.
}

app.stage.addChild(wheelContainer); // wheelContainer حالا روی بک‌گراند قرار می‌گیرد

// --- رسم بخش‌های چرخ (Segments) ---
function drawWheel() {
  for (let i = 0; i < numSegments; i++) {
    const startAngle = i * arcSize - 90; // -90 برای شروع از بالا
    const endAngle = (i + 1) * arcSize - 90;

    // ساخت شکل گرافیکی بخش (Pie Slice)
    const slice = new PIXI.Graphics();

    // اعمال رنگ متناوب (ترکیب رنگ‌ها)
    slice.beginFill(segmentColors[i % segmentColors.length]);

    // اضافه کردن مرز طلایی (مشابه تصویر شما)
    //  slice.lineStyle(1, 0xffd700, 1); // 3px ضخامت، طلایی، 100% مات

    slice.moveTo(0, 0);
    slice.arc(
      0,
      0,
      radius,
      (startAngle * Math.PI) / 180,
      (endAngle * Math.PI) / 180
    );
    slice.lineTo(0, 0);
    slice.endFill();

    wheelContainer.addChild(slice);
  }
}

drawWheel();

// --- منطق چرخش و توقف با GSAP (بدون تغییر) ---

spinButton.addEventListener("click", () => {
  if (spinButton.disabled) return;

  spinButton.disabled = true;
  spinButton.textContent = "در حال چرخش...";

  // 1. محاسبه زاویه هدف تصادفی
  const targetSegmentIndex = Math.floor(Math.random() * numSegments);

  // این زاویه هدفیه که بخش مورد نظر در موقعیت نشانگر (بالا) قرار بگیره.
  let targetRotation =
    (numSegments - targetSegmentIndex) * arcSize - arcSize / 2;

  // 2. اضافه کردن چند دور کامل برای افکت چرخش (حداقل 5 دور)
  const fullSpins = 3;
  const totalRotation = fullSpins * 360 + targetRotation;

  // 3. انیمیشن با GSAP
  gsap.to(wheelContainer, {
    rotation: totalRotation, // چرخش کامل به همراه زاویه هدف
    duration: 5, // مدت زمان انیمیشن (5 ثانیه)
    ease: "power2.out", // سبک توقف تدریجی (آهسته شدن در انتها)
    onUpdate: function () {
      // در اینجا می‌توانیم افکت‌های بصری بیشتری اضافه کنیم (مثل افکت لرزش خفیف)
    },
    onComplete: function () {
      spinButton.disabled = false;
      spinButton.textContent = `برنده: بخش ${targetSegmentIndex + 1}`;

      // برای اینکه چرخش بعداً از این حالت خارج نشه، مقدار نهایی رو به عنوان حالت پایه تنظیم می‌کنیم.
      const currentRotation = wheelContainer.rotation % 360;
      wheelContainer.rotation =
        currentRotation >= 0 ? currentRotation : currentRotation + 360;
    },
  });
});
