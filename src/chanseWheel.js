const container = document.getElementById("spinner-container");
const numSegments = 50;
const arcSize = 360 / numSegments;
const centerX = 220;
const centerY = 220;
const radius = 220;
const spinButton = document.getElementById("spinButton");
const segmentColors = [0x141820, 0x325cfe];

const slices = []; // ذخیره‌ی اسلایس‌ها برای دسترسی بعدی

// --- PixiJS ---
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

// تصویر پس‌زمینه
try {
  const texture = PIXI.Texture.from("/public/metal_texture.jpg");
  const bgSprite = new PIXI.Sprite(texture);
  bgSprite.anchor.set(0.5);
  bgSprite.x = centerX;
  bgSprite.y = centerY;
  app.stage.addChild(bgSprite);
} catch (e) {
  console.warn("Could not load background texture.");
}
app.stage.addChild(wheelContainer);

// 🌀 رسم چرخ
function drawWheel() {
  for (let i = 0; i < numSegments; i++) {
    const startAngle = (i * arcSize - 90) * (Math.PI / 180);
    const endAngle = ((i + 1) * arcSize - 90) * (Math.PI / 180);

    const slice = new PIXI.Graphics();
    slice.beginFill(segmentColors[i % segmentColors.length]);
    slice.lineStyle(2, 0xffd700, 1);
    slice.moveTo(0, 0);
    slice.arc(0, 0, radius, startAngle, endAngle);
    slice.lineTo(0, 0);
    slice.endFill();

    // ⬅️ ذخیره زوایا برای بازترسیم بعدی
    slice.startAngle = startAngle;
    slice.endAngle = endAngle;
    slice.index = i;

    wheelContainer.addChild(slice);
    slices.push(slice);
  }
}
drawWheel();

// 🎯 تابع هایلایت اسلایس برنده
function highlightSlice(slice, color = 0xffd700) {
  slice.clear();
  slice.beginFill(color);
  slice.lineStyle(2, 0xfbff38, 1);
  slice.moveTo(0, 0);
  slice.arc(0, 0, radius, slice.startAngle, slice.endAngle);
  slice.lineTo(0, 0);
  slice.endFill();
}

// 🎯 تابع بازگرداندن رنگ اصلی
function resetSlice(slice) {
  const baseColor = segmentColors[slice.index % segmentColors.length];
  slice.clear();
  slice.beginFill(baseColor);
  slice.lineStyle(2, 0xffd700, 1);
  slice.moveTo(0, 0);
  slice.arc(0, 0, radius, slice.startAngle, slice.endAngle);
  slice.lineTo(0, 0);
  slice.endFill();
}

// 🎡 منطق چرخش
spinButton.addEventListener("click", () => {
  if (spinButton.disabled) return;
  spinButton.disabled = true;
  spinButton.textContent = "در حال چرخش...";

  // حذف هایلایت قبلی
  slices.forEach(resetSlice);

  const targetSegmentIndex = Math.floor(Math.random() * numSegments);
  const targetRotation =
    (numSegments - targetSegmentIndex) * arcSize - arcSize / 2;
  const fullSpins = 3;
  const totalRotation = fullSpins * 360 + targetRotation;

  gsap.to(wheelContainer, {
    rotation: (totalRotation * Math.PI) / 180,
    duration: 3,
    ease: "power2.out",
    onComplete: function () {
      const winner = slices[targetSegmentIndex];

      spinButton.disabled = false;
      spinButton.textContent = `برنده: بخش ${targetSegmentIndex + 1}`;

      wheelContainer.removeChild(winner);
      wheelContainer.addChild(winner);

      highlightSlice(winner);

      // blink at end
      gsap.to(winner, {
        alpha: 0.6,
        yoyo: true,
        repeat: 3,
        duration: 0.2,
        onComplete: () => (winner.alpha = 1),
      });

      //  ثابت‌سازی زاویه نهایی
      wheelContainer.rotation %= Math.PI * 2;
    },
  });
});
