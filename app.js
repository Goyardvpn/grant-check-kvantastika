// URL опубликованного Google Apps Script Web App.
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyyKfQqpBuCSfLu8wVNMj1aAFagXipZT5dKTXprwEpME-pEQMeHeJJWn2XfrDNiunLx3A/exec";
const leadForm=document.querySelector("#leadForm");
const submitButton=document.querySelector("#submitLead");
const statusBox=document.querySelector("#formStatus");
const entry=document.querySelector("#grant");
function showDemo(address){
  const params=new URLSearchParams({school:address});
  window.location.href="result.html?"+params.toString();
}
leadForm.addEventListener("submit",async(event)=>{
  event.preventDefault();
  if(!leadForm.reportValidity())return;
  const data=Object.fromEntries(new FormData(leadForm).entries());
  data.consent=document.querySelector("#consent").checked;
  data.submittedAt=new Date().toISOString();
  data.source=window.location.href;
  if(!data.consent){statusBox.textContent="Для отправки необходимо подтвердить согласие.";return;}
  submitButton.disabled=true;
  submitButton.innerHTML="Отправляем заявку…";
  statusBox.textContent="Сохраняем данные…";
  try{
    // no-cors means the browser cannot read the Apps Script response.
    // Verify the test submission in the Google Sheet before using this with real leads.
    await fetch(GOOGLE_SCRIPT_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(data)});
    statusBox.textContent="Запрос отправлен. Открываем демонстрацию…";
    statusBox.className="form-status success";
    setTimeout(()=>showDemo(data.schoolAddress),700);
  }catch(error){
    statusBox.textContent="Не удалось отправить заявку. Проверьте подключение и попробуйте ещё раз.";
    statusBox.className="form-status error";
    submitButton.disabled=false;
    submitButton.innerHTML='Проверить доступность гранта <span>→</span>';
  }
});
