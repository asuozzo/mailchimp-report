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
  
  var id_col = sheet.getRange("A2:A").getValues();
  var id_col_list = [];
  for (var l=0; l< id_col.length; l++){
    id_col_list.push(id_col[l][0].toString());
  }
  var campaigns;
  var campaignIDs = [];
  
  while (REPORT_START_DATE<REPORT_END_DATE) {
    campaigns = apiCall(REPORT_START_DATE, REPORT_END_DATE)["campaigns"];
    
    for (var i=0; i< campaigns.length; i++){
      if (campaigns[i].send_time){
        var c = campaigns[i];
        var runReport = true;
        // if campaign has already been pulled this time around, don't run the report again.
        if (campaignIDs.indexOf(c.id) != -1) {
          runReport = false;
        };
        
        // if campaign hasn't yet been run, create a report
        if (runReport) {
          var report = [c.id.toString(), c.settings.subject_line, c.send_time, c.emails_sent, c.report_summary.opens, 
                      c.report_summary.unique_opens, c.report_summary.clicks, c.report_summary.open_rate,
                      c.report_summary.click_rate, c.archive_url, c.settings.folder_id];
          
         var newRow = true;
         
         // does the campaign's id match any others in the dataset?
          var inRow = id_col_list.indexOf(id)
          if (inRow != -1) {
              newRow = false;
              var row = inRow + 2;
          }
          if (newRow===true) {
            sheet.appendRow(report)
            var range = sheet.getRange("A2:A").getLastRow();
            var cell = sheet.getRange("A" + (range).toString())
            cell.setNumberFormat("@").setValue(id)
          } else {
            var range = sheet.getRange("A"+row.toString()+":K"+row.toString())
            range.setValues([report])
          }
          
          campaignIDs.push(id);
        }
      }
    }
    
    var newDATE = REPORT_START_DATE.setDate(REPORT_START_DATE.getDate() + 3);
    REPORT_START_DATE = new Date(newDATE);
    
    
    }
  }
