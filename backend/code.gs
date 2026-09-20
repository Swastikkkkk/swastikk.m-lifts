/**
 * Swastik Lifts — backend (Google Apps Script)
 * ----------------------------------------------------------------------------
 * Receives coaching applications and lap times from the website and writes them
 * into a Google Sheet. Also serves the fastest-lap board back to the site.
 *
 * SETUP (about five minutes, all free):
 *   1. Go to sheets.new and make a blank spreadsheet. Name it "Swastik Lifts".
 *   2. In that sheet: Extensions > Apps Script. Delete whatever is in the editor
 *      and paste this whole file in.
 *   3. Change SECRET_KEY below to any random string of your own.
 *   4. Optional: put your email in NOTIFY_EMAIL to get a mail on each application.
 *   5. Click Deploy > New deployment > type "Web app".
 *        Execute as:      Me
 *        Who has access:  Anyone
 *      Deploy, approve the permission prompt, then copy the /exec web app URL.
 *   6. In index.html find the CONFIG block near the top of the script and set
 *      SCRIPT_URL to that URL and SECRET_KEY to the same string as here.
 *
 * After any edit to this file you must Deploy > Manage deployments > edit >
 * Version: New version, or the live URL keeps running the old code.
 */

var SECRET_KEY   = 'REMOVED_PUBLIC_TOKEN';  // must match SL_CFG.SECRET_KEY in index.html
var NOTIFY_EMAIL = 'swastikmohanty2635@gmail.com'; // e.g. 'you@gmail.com', or leave blank
var APPS_SHEET   = 'Applications';
var LAPS_SHEET   = 'Lap times';

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (!SECRET_KEY || body.key !== SECRET_KEY) return json({ ok: false, error: 'bad key' });

    if (body.type === 'lap') return json(saveLap_(body));
    return json(saveApplication_(body));
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.board) return json({ ok: true, laps: topLaps_(10) });
  return json({ ok: true, service: 'swastik-lifts', endpoints: ['?board=1', 'POST application', 'POST lap'] });
}

/* ------------------------------------------------------------------ writes */

function saveApplication_(body) {
  var sh = sheet_(APPS_SHEET);
  var answers = body.answers || [];
  // First write defines the columns, from whatever questions the form is asking.
  if (sh.getLastRow() === 0) {
    sh.appendRow(['Received'].concat(answers.map(function (a) { return a.label; })));
    sh.setFrozenRows(1);
  }
  var header = sh.getRange(1, 1, 1, Math.max(1, sh.getLastColumn())).getValues()[0];
  var byLabel = {};
  answers.forEach(function (a) { byLabel[a.label] = a.value; });

  var row = header.map(function (h, i) {
    if (i === 0) return new Date();
    return byLabel[h] !== undefined ? byLabel[h] : (body[h] !== undefined ? body[h] : '');
  });
  // Any brand new question gets appended rather than dropped.
  answers.forEach(function (a) {
    if (header.indexOf(a.label) === -1) {
      sh.getRange(1, sh.getLastColumn() + 1).setValue(a.label);
      row.push(a.value);
    }
  });
  sh.appendRow(row);

  if (NOTIFY_EMAIL) {
    try {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: 'New coaching application: ' + (byLabel['Full name'] || 'unnamed'),
        body: answers.map(function (a) { return a.label + ': ' + a.value; }).join('\n') +
              '\n\nSheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl()
      });
    } catch (err) { /* a failed notification must never fail the submission */ }
  }
  return { ok: true, saved: 'application' };
}

function saveLap_(body) {
  var ms = Number(body.ms);
  // Sanity bounds: a real lap of this circuit cannot be under 25s or over 10 minutes.
  if (!isFinite(ms) || ms < 25000 || ms > 600000) return { ok: false, error: 'implausible lap' };
  var sh = sheet_(LAPS_SHEET);
  if (sh.getLastRow() === 0) {
    sh.appendRow(['Set at', 'Name', 'Milliseconds', 'Lap time', 'Vehicle']);
    sh.setFrozenRows(1);
  }
  var name = String(body.name || 'Anon').replace(/[<>]/g, '').slice(0, 14);
  sh.appendRow([new Date(), name, ms, fmt_(ms), String(body.vehicle || '').slice(0, 12)]);
  return { ok: true, saved: 'lap', laps: topLaps_(10) };
}

/* ------------------------------------------------------------------- reads */

function topLaps_(n) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LAPS_SHEET);
  if (!sh || sh.getLastRow() < 2) return [];
  var rows = sh.getRange(2, 1, sh.getLastRow() - 1, 5).getValues();
  var best = {};   // one entry per name: their own quickest
  rows.forEach(function (r) {
    var name = String(r[1] || 'Anon'), ms = Number(r[2]);
    if (!isFinite(ms) || ms <= 0) return;
    if (!best[name] || ms < best[name].ms) best[name] = { n: name, ms: ms, veh: String(r[4] || '') };
  });
  return Object.keys(best).map(function (k) { return best[k]; })
    .sort(function (a, b) { return a.ms - b.ms; })
    .slice(0, n || 10);
}

/* ------------------------------------------------------------------- utils */

function sheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function fmt_(ms) {
  var m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000), c = Math.floor((ms % 1000) / 10);
  return m + ':' + ('0' + s).slice(-2) + '.' + ('0' + c).slice(-2);
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run this once from the editor to check the sheet wiring without the website. */
function selfTest() {
  Logger.log(saveApplication_({
    key: SECRET_KEY, type: 'application',
    answers: [{ label: 'Full name', value: 'Test Lifter' }, { label: 'Main goal', value: 'Get stronger' }]
  }));
  Logger.log(saveLap_({ key: SECRET_KEY, type: 'lap', name: 'Test', ms: 78500, vehicle: 'Car' }));
  Logger.log(topLaps_(5));
}
