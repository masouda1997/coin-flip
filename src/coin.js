import "./coin.css";

const coin = document.getElementById("coin");
const result = document.getElementById("result");

coin.addEventListener("click", () => {
  coin.classList.add("flip");
  setTimeout(() => {
    coin.classList.remove("flip");
    const outcome = Math.random() < 0.5 ? "برنده (شیر)" : "بازنده (خط)";
    result.textContent = `نتیجه: ${outcome}`;
  }, 1000);
});
