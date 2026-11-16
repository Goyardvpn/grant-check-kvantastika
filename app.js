const $ = (selector) => document.querySelector(selector);
const input = $("#school");
const hero = $("#hero");
const checking = $("#checking");
const result = $("#result");
const progress = $("#progress");
const status = $("#status");

function show(section) {
  [hero, checking, result].forEach((el) => el.classList.add("hidden"));
  section.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

$("#clear").addEventListener("click", () => {
  input.value = "";
  $("#clear").style.display = "none";
  input.focus();
});

input.addEventListener("input", () => {
  $("#clear").style.display = input.value ? "block" : "none";
});

function runCheck() {
  const school = input.value.trim();
  if (school.length < 3) {
    input.setCustomValidity("Введите название школы или адрес (минимум 3 символа).");
    input.reportValidity();
    input.addEventListener("input", () => input.setCustomValidity(""), { once: true });
    return;
  }

  $("#checkingName").textContent = school;
  $("#resultName").textContent = school;
  progress.style.width = "0%";
  status.textContent = "Подготавливаем запрос…";
  show(checking);

  const stages = [
    ["32%", "Обрабатываем введённые данные…"],
    ["68%", "Готовим информацию о специальном предложении…"],
    ["100%", "Демонстрация завершена…"]
  ];

  stages.forEach(([width, message], index) => {
    window.setTimeout(() => {
      progress.style.width = width;
      status.textContent = message;
    }, 650 * (index + 1));
  });

  window.setTimeout(() => show(result), 2450);
}

$("#check").addEventListener("click", runCheck);
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") runCheck();
});
$("#back").addEventListener("click", () => show(hero));