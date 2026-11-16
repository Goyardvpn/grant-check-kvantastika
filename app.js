const entry=document.querySelector("#entryScreen");
const form=document.querySelector("#schoolForm");
const addressInput=document.querySelector("#schoolAddress");
const schoolResult=document.querySelector("#schoolResult");
const loading=document.querySelector("#loadingScreen");
const result=document.querySelector("#resultScreen");
const bar=document.querySelector("#progressBar");
const value=document.querySelector("#progressValue");
const copy=document.querySelector("#loadingCopy");
const replay=document.querySelector("#replayButton");
let timer=null;
let selectedAddress="";
function runCheck(){
  clearInterval(timer);
  entry.hidden=true;
  result.style.display="none";
  result.setAttribute("aria-hidden","true");
  loading.hidden=false;
  loading.style.display="flex";
  bar.style.width="0%";
  value.textContent="0%";
  copy.textContent="Подготавливаем результат проверки…";
  let progress=0;
  timer=setInterval(()=>{
    progress=Math.min(100,progress+2);
    bar.style.width=progress+"%";
    value.textContent=progress+"%";
    if(progress===28)copy.textContent="Проверяем параметры предложения…";
    if(progress===66)copy.textContent="Формируем персональный результат…";
    if(progress>=100){
      clearInterval(timer);
      setTimeout(()=>{
        loading.hidden=true;
        loading.style.display="none";
        schoolResult.textContent="Адрес школы: "+selectedAddress;
        result.style.display="block";
        result.setAttribute("aria-hidden","false");
      },300);
    }
  },48);
}
form.addEventListener("submit",(event)=>{
  event.preventDefault();
  const address=addressInput.value.trim();
  if(address.length<3){addressInput.setCustomValidity("Введите адрес школы (не менее 3 символов).");addressInput.reportValidity();return;}
  addressInput.setCustomValidity("");
  selectedAddress=address;
  runCheck();
});
addressInput.addEventListener("input",()=>addressInput.setCustomValidity(""));
replay.addEventListener("click",runCheck);