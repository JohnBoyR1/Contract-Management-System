must install: npm install @fortawesome/fontawesome-free (this is for styling icons on footer)


Action	        Angular Tool	            Purpose
Capture Input	ngModel or Reactive Forms	Gets the text from the HTML box.
Transport	    HttpClient	                Makes the actual "call" to the server.
Logic	        Service	                    Keeps the URL and logic out of the UI code.
Trigger	        .subscribe()	            Tells the app to start the request and wait for the answer.