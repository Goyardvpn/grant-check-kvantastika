// URL опубликованного Google Apps Script Web App.
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyyKfQqpBuCSfLu8wVNMj1aAFagXipZT5dKTXprwEpME-pEQMeHeJJWn2XfrDNiunLx3A/exec";
const leadForm=document.querySelector("#leadForm");
const submitButton=document.querySelector("#submitLead");
const statusBox=document.querySelector("#formStatus");
const checkingOverlay=document.querySelector("#checkingOverlay");
const checkingTitle=document.querySelector("#checkingTitle");
const checkingDescription=document.querySelector("#checkingDescription");
const checkingProgress=document.querySelector("#checkingProgress");
const checkingPercent=document.querySelector("#checkingPercent");
const checkingSteps=[...document.querySelectorAll(".checking-step")];

function showDemo(address){
  const params=new URLSearchParams({school:address});
  window.location.href="result.html?"+params.toString();
}
function showChecking(){
  checkingOverlay.classList.add("is-visible");
  checkingOverlay.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
}
function hideChecking(){
  checkingOverlay.classList.remove("is-visible");
  checkingOverlay.setAttribute("aria-hidden","true");
  document.body.style.overflow="";
}
function updateChecking(elapsed){
  const progress=Math.min(elapsed/10000,1);
  const percent=Math.round(progress*100);
  const activeStep=Math.min(Math.floor(progress*3),2);
  checkingProgress.style.width=percent+"%";
  checkingPercent.textContent=percent+"%";
  checkingSteps.forEach((step,index)=>{
    step.classList.toggle("done",index<activeStep);
    step.classList.toggle("active",index===activeStep);
  });
  if(progress<1){
    checkingTitle.textContent=["Проверяем данные","Обрабатываем адрес","Готовим результат"][activeStep];
    checkingDescription.textContent=[
      "Проверяем, что заявка заполнена корректно.",
      "Подготавливаем информацию для демонстрационного результата.",
      "Почти готово — формируем итоговый экран."
    ][activeStep];
  }else{
    checkingSteps.forEach(step=>{step.classList.remove("active");step.classList.add("done");});
    checkingTitle.textContent="Всё готово";
    checkingDescription.textContent="Демонстрационный результат подготовлен.";
  }
}
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

leadForm.addEventListener("submit",async(event)=>{
  event.preventDefault();
  if(!leadForm.reportValidity())return;
  const data=Object.fromEntries(new FormData(leadForm).entries());
  data.consent=document.querySelector("#consent").checked;
  data.submittedAt=new Date().toISOString();
  data.source=window.location.href;
  if(!data.consent){statusBox.textContent="Для отправки необходимо подтвердить согласие.";return;}

  submitButton.disabled=true;
  submitButton.innerHTML="Обрабатываем заявку…";
  statusBox.textContent="";
  showChecking();
  const startedAt=Date.now();
  const animation=(async()=>{
    while(Date.now()-startedAt<10000){
      updateChecking(Date.now()-startedAt);
      await wait(100);
    }
    updateChecking(10000);
  })();

  // Запрос и анимация идут независимо: быстрая ошибка сети не прячет экран мгновенно.
  const request=fetch(GOOGLE_SCRIPT_URL,{
    method:"POST",
    mode:"no-cors",
    headers:{"Content-Type":"text/plain;charset=utf-8"},
    body:JSON.stringify(data)
  }).then(()=>true).catch(()=>false);

  await animation;
  const sent=await request;
  if(sent){
    showDemo(data.schoolAddress);
  }else{
    hideChecking();
    statusBox.textContent="Не удалось отправить заявку. Проверьте подключение и попробуйте ещё раз.";
    statusBox.className="form-status error";
    submitButton.disabled=false;
    submitButton.innerHTML='Проверить доступность гранта <span>→</span>';
  }
});
