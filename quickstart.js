var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var sleep=require('sleep');
var exec = require('child_process').exec;
var googleAuth = require('google-auth-library');
global.eventByDate={};

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/calendar','https://www.googleapis.com/auth/calendar.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';
//---------------read output from rosteron
var resources=[];
fs.readFile('currentRoster','utf-8',function(err,data){
	if (err) throw err;
	//console.log(data);
	var array_of_records = data.split("\n");
	array_of_records.forEach(function(item){
			var fields=item.trim().split(" ");
			dmy= fields[0].replace(/^\s+|\s+$/g,'').split("/");    
			var date=dmy[2]+"-"+dmy[1]+"-"+dmy[0];
console.log(date+";;;;");			
			var d=new Date(date);
console.log(d+";;;");
			var dateplus1=new Date (date);
			dateplus1.setDate(dateplus1.getDate()+1);
			var enddate = date;
			var ofs = d.toLocaleTimeString().substring(0,2);
			console.log(ofs+";;;;");
    			start=fields[1].replace(/^\s+|\s+$/g,'');
    			stop=fields[2].replace(/^\s+|\s+$/g,'');
			subject=fields[7].replace(/^\s+|\s+$/g,'');
  			loc=fields[5].replace(/^\s+|\s+$/g,'');
			//console.log(subject+" " +loc+" "+date+ " "+start+ " "+ stop +"\n ");

			if (subject.includes("Day-07"))        {colorID="5";}
			else if(subject.includes("vening-13")){colorID="2"}	
			else if (subject.includes("Leave")){colorID="8"}
			else if (subject.includes("ight") ){ colorID="11";enddate=dateplus1.toISOString().substr(0,10);
			}
			else {colorID="9"}

			resources.push({summary:subject,	
					   location:loc,
					   start:{dateTime:date+"T"+start+":00+10:00"},
					   end:{dateTime:enddate+"T"+stop+":00+10:00"},
					   reminders:{useDefault:false}, 
					   colorId:colorID
					   });

			//		

		});//forEach
});//readfile
//----------------
// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Google Calendar API.
  authorize(JSON.parse(content), listEvents);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the next 10 events on the user's primary calendar.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
//console.log("data: %j \n",resources);
  var calendar = google.calendar('v3');
  calendar.events.list({
    auth: auth,
    calendarId: 'i7t8ilm45fv5m3mt1ptghh25r0@group.calendar.google.com',
    timeMin: (new Date()).toISOString(),
    maxResults: 200,
    singleEvents: true,
    orderBy: 'startTime'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var events = response.items;
    if (events.length == 0) {
      console.log('No upcoming events found.');
    } else {
      console.log('Upcoming events:');
      for (var i = 0; i < events.length; i++) {
        var event = events[i];
	console.log(event);
        var start = event.start.dateTime || event.start.date;
	eventByDate[start]=event;
        console.log('%s - %s', start, event.summary);
	//console.log(eventByDate[start].start.dateTime);
      }
    }
//console.log("---------> %j",eventByDate);


 for (i=0; i<resources.length;i++){  
	res=resources[i];
	s=res.start.dateTime;
        if (eventByDate[s]){
	 console.log("event already in calendar:"+ s)
	}else{
	console.log("adding event"+ res.summary+" "+s+"  colorId: "+res.colorId);
 	 calendar.events.insert( { calendarId: 'i7t8ilm45fv5m3mt1ptghh25r0@group.calendar.google.com', resource:res, auth:auth },
	function(err, event) { if (err) { console.log('There was an error contacting the Calendar service: ' + err); }}); 
 	}
}
});
}

