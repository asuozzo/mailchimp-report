function triggerReport() {
  ScriptApp.newTrigger('chimpReport')
      .timeBased()
      .everyHours(24)
      .create();
}

function chimpReport() {

 var API_KEY = "xxxxxxxxxxxx";

 var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();  
  
  var dc = API_KEY.slice(-3);
  var api = 'https://'+ dc +'.api.mailchimp.com/3.0';
  var campaignList = '/campaigns';
  
  var apiCall = function(REPORT_START_DATE, REPORT_END_DATE){
    fetchurl = api+"/campaigns?apikey="+API_KEY+"&since_send_time="+REPORT_START_DATE.toISOString()+"&before_send_time="+REPORT_END_DATE.toISOString();
    var apiResponse = UrlFetchApp.fetch(fetchurl);
    //return apiResponse;
    var json = JSON.parse(apiResponse);
    return json;
    };
  
  var REPORT_END_DATE = new Date();
  today = new Date();
  start = new Date().setDate(today.getDate()-60);
  var REPORT_START_DATE = new Date(start);
  Logger.log(REPORT_START_DATE)
  
  var campaigns;
  
  while (REPORT_START_DATE<REPORT_END_DATE) {
    campaigns = apiCall(REPORT_START_DATE, REPORT_END_DATE)["campaigns"];
    id_col = sheet.getRange("A2:A").getValues();
    
    for (var i=0; i< campaigns.length; i++){
      if (campaigns[i].send_time){
        var c = campaigns[i];
        var report = [c.id, c.settings.subject_line, c.send_time, c.emails_sent, c.report_summary.opens, 
                      c.report_summary.unique_opens, c.report_summary.clicks, c.report_summary.open_rate,
                      c.report_summary.click_rate, c.archive_url, c.settings.folder_id];
        var newRow = true;
        for (n=0;n<id_col.length;n++) {
          if (id_col[n][0].toString() === c.id.toString()){
            newRow = false;
            var row = 2 + n
            break;
          }
        }
        if (newRow===true) {
          sheet.appendRow(report)
        } else {
          var range = sheet.getRange("A"+row.toString()+":K"+row.toString())
          range.setValues([report])
        }
      }
    }
    Logger.log(REPORT_START_DATE)
    var newDATE = REPORT_START_DATE.setDate(REPORT_START_DATE.getDate() + 3);
    REPORT_START_DATE = new Date(newDATE);
    Logger.log(REPORT_START_DATE)
    
    }
  }
