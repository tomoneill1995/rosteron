#!/usr/bin/bash
#/Western/login.do;jsessionid=157A4DEC30971CD72493D05831188964"
username=XXXXX
pass=XXXXXXXX
date
wget --no-check-certificate  --save-cookies=cookies.cook --keep-session-cookies -O login https://ssgrosterweb.ssg.org.au/Western/
sessionid=`grep ";jsessionid=" login |awk -F"jsessionid=" '{print $2}' | cut -c 1-32`

wget --no-check-certificate  --load-cookies=cookies.cook --keep-session-cookies -O loggedin --post-data="username=$username&password=$pass&componentlistid=0&componentmaintid=-1&listflag=Y&maintflag=N&tabflag=N&dispatchaction=login&id=-1&id2=-1&actualid=id&daydate=date&starttime=time&availabilitydate=date&retrievelistflag=N&readflag=N&deleteflag=N&lockflag=N&printflag=N&aboutflag=N&searchclickedflag=N&clearclickedflag=N&showsearchflag=N&hidesearchflag=N&radioflag=N&inserttabflag=N&deletetabflag=N&ddwselectflag=N&savepromptflag=N&backflag=N&availinsertflag=N&homeflag=N&logoutflag=N&printmaintflag=N&indreqchangedflag=N&gridtodatechangedflag=Y&gridflag=N&copyflag=N&lockedflag=N&calendarflag=N&actionRequiredFlag=N&historicalFlag=N&availabilityflag=N&refreshFlag=N&indReqCalDisplayFlag=Y&insert=N&update=N&del=N&read=Y&save=N&saveas=N&copy=N&prt=N&email=N&imp=N&exp=N&sort=N&filter=N&occurencevalue=one&insertshowflag=N&updateshowflag=N&delshowflag=N&readshowflag=N&saveshowflag=N&saveasshowflag=N&copyshowflag=N&prtshowflag=N&emailshowflag=N&impshowflag=N&expshowflag=N&sortshowflag=N&filtershowflag=N&screenwidth=0&screenheight=0&wizardStepNo=0" "https://ssgrosterweb.ssg.org.au/Western/login.do;jsessionid=$sessionid"

wget --no-check-certificate  --load-cookies=cookies.cook --keep-session-cookies -O roster --post-data="componentlistid=201&componentmaintid=-1&listflag=Y&maintflag=N&tabflag=N&dispatchaction=retrieve&id=-1&id2=-1&actualid=id&daydate=date&starttime=time&availabilitydate=date&retrievelistflag=Y&readflag=N&deleteflag=N&lockflag=N&printflag=N&aboutflag=N&searchclickedflag=N&clearclickedflag=N&showsearchflag=N&hidesearchflag=N&radioflag=N&inserttabflag=N&deletetabflag=N&ddwselectflag=N&savepromptflag=N&backflag=N&availinsertflag=N&homeflag=N&logoutflag=N&printmaintflag=N&indreqchangedflag=N&gridtodatechangedflag=Y&gridflag=N&copyflag=N&lockedflag=N&calendarflag=N&actionRequiredFlag=N&historicalFlag=N&availabilityflag=N&refreshFlag=N&indReqCalDisplayFlag=Y&insert=N&update=N&del=N&read=Y&save=N&saveas=N&copy=N&prt=N&email=N&imp=N&exp=N&sort=N&filter=N&occurencevalue=one&insertshowflag=N&updateshowflag=N&delshowflag=N&readshowflag=N&saveshowflag=N&saveasshowflag=N&copyshowflag=N&prtshowflag=N&emailshowflag=N&impshowflag=N&expshowflag=N&sortshowflag=N&filtershowflag=N&screenwidth=0&screenheight=0&wizardStepNo=0" "https://ssgrosterweb.ssg.org.au/Western/rosteron.do;jsessionid=$sessionid"
grep -A 7 -e  "> [0-9][0-9]/[0-9][0-9]/"20[0-9][0-9] roster  |perl -n -e " s/<.*?>//g; s/[\n\r\s]//g; s/--/\n/g; print $_;print ' '">currentRoster

node quickstart.js











