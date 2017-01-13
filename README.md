# Automatically send Mailchimp reports to Google Spreadsheet
Automation FTW! Pull Mailchimp report data into a Google Spreadsheet using Google Apps Script. This script runs automatically every 24 hours and pulls data from the last 60 days. For each entry, it looks at the column of campaign ids to see if the entry already exists; if it does, it updates that row rather than creating a new one.

Based on [this post](http://trevorfox.com/2014/03/automate-mailchimp-reporting-google-spreadsheets/), but uses Mailchimp API 3.0 and adds some custom bells and whistles.
