/**
 * Google Apps Script endpoint for the Kvantastica grant demo lead form.
 * 1) Create a Google Sheet and copy its ID into SPREADSHEET_ID.
 * 2) Deploy this project as a Web app, execute as yourself, access: anyone.
 * 3) Paste the deployed /exec URL into GOOGLE_SCRIPT_URL in app.js.
 */
const SPREADSHEET_ID = "1BqeOWpeQYvB-FLFpOASfEcwE_Ufcm0MyV300SQb_aC";
const SHEET_NAME = "Заявки";

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json_({ ok: false, error: "empty_request" });
    }
    const data = JSON.parse(e.postData.contents);
    const required = ["firstName", "lastName", "email", "phone", "schoolAddress"];
    required.forEach(function (key) {
      if (!String(data[key] || "").trim()) throw new Error("missing_" + key);
    });
    if (data.consent !== true && data.consent !== "true") {
      throw new Error("consent_required");
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      let sheet = ss.getSheetByName(SHEET_NAME);
      if (!sheet) {
        sheet = ss.insertSheet(SHEET_NAME);
        sheet.appendRow(["Дата и время", "Имя", "Фамилия", "Email", "Телефон", "Адрес школы", "Согласие", "Источник"]);
        sheet.setFrozenRows(1);
      }
      sheet.appendRow([
        new Date(),
        safeCell_(data.firstName),
        safeCell_(data.lastName),
        safeCell_(data.email),
        safeCell_(data.phone),
        safeCell_(data.schoolAddress),
        "Да",
        safeCell_(data.source || "")
      ]);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: String(err.message || err) });
  }
}

function safeCell_(value) {
  const text = String(value == null ? "" : value).trim().slice(0, 500);
  // Prevent spreadsheet formula injection from user-submitted fields.
  return /^[=+@\-]/.test(text) ? "'" + text : text;
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}