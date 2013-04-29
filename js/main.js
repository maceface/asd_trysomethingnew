//	Dana Mace
//	ASD 1304
//	Part 2


/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  */
/* %%%%%%%%%%%%%%% Globals %%%%%%%%%%%%%%  */
/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  */

var populateIt = function(){
	// Retrieves JSON Objects from json.js and adds them to local storage if no default data is present.
	for(var n in json){
		var id = Math.floor(Math.random()*123456789);
		localStorage.setItem(id, JSON.stringify(json[n]));
	}
};

/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  */
/* %%%%%%%%% Get Local Storage %%%%%%%%%%  */
/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  */  

var getData = function(){
	if(localStorage.length === 0){
		alert("There are no logs in Local Storage so default logs have been added");
		populateIt();
	}
	$("#logList").empty();
    for (var i= 0, j=localStorage.length; i<j ; i++){
        var key = localStorage.key(i);
        var logs = JSON.parse(localStorage.getItem(key));
        console.log(logs);
        var makeSubList = $("<li></li>");
        var makeSubLi = $( "<h3>"+logs.gDate[1]+"</h3>"+
            "<p><strong>"+logs.gWhat[1]+"</strong></p>"+
            "<p>"+logs.gColor[1]+"</p>" +
            "<p>"+logs.checked[1]+"</p>"+
            "<p>"+logs.gTime[1]+"</p>");
        makeSubList.append(makeSubLi).appendTo("#logList");
        
       	
    }; // end for loop
  	$('#logList').listview('refresh');
};

// Saves form data into local
var saveData = function(key) {
	if(!key) {
		var id = Math.floor(Math.random()*12345678);
	}else{
		id = key;
	}
	getCheckboxValue();
	var log 			= {};
		log.gDate 		= ["Date:", $("#gDate").val()];
		log.gWhat		= ["What are you grateful for?:", $("#gWhat").val()];
		log.gColor		= ["Which color do you like best today?:", $("#gColor").val()];
		log.checked		= ["Which items do you like?:", $("input:checkbox[name=checked]:checked").val()];
		log.gTime		= ["What time is it?:", $("#gTime").val()];
			
	// JSON.stringify data into local
	localStorage.setItem(id, JSON.stringify(log));
	alert("Your gratitude has been logged");
	location.reload();
};

var getCheckboxValue = function(){
    if($('#checked').checked){
        var checkedValue = $('#checked').value;
   }
};

var deleteItem = function(){
	var ask = confirm(" Are you sure you want to throw this log out?");
	if(ask){
		localStorage.removeItem(this.key);
		alert("Your log has been thrown out!");
		window.location.reload();
	}else{
		alert("Your log was not thrown out!");

	}
};

var editItem = function(key) {
	// Gets data from log in Local Stor
	var value = localStorage.getItem(this.key);
	var item = JSON.parse(value);
	// Populates Form Fields with LocalStorage
	$('#gDate').val(item.gDate[1]);
	$('#gWhat').val(item.gWhat[1]);
	$('#gColor').val(item.gColor[1]);
	$('#checked').val(item.checked[1]);
	$('#gTime').val(item.gTime[1]);
	$('submit').value = "Save Changes";
	var editSubmit = $('submit');
	editSubmit.key = this.key;
};


// Clear Local Function
var chopLogs = function() {
	if (localStorage.length === 0) {
		alert("There are no logs chop.");
	}else{
		var chop = confirm("Are you sure you want to chop all your logs?");
	if (chop) {
		localStorage.clear();
		alert("All logs have been chopped!");
		window.location.reload();
		return false;
	}else{
		alert("You still have all your logs!.");
		}
	}
};

// jQuery
$('#homeIndex').on('pageinit', function(){
	// console.log("Index Page loaded")
	// Future code for Index page to be placed here.
});

$('#addLog').on('pageinit', function(){
	console.log("Add Log Page Loaded");
	var logIt = $('#addItem');
    var	errorsLink = $('#formErrorsLink');
    logIt.validate({
        invalidHandler: function(form, validator){
        	errorsLink.click();
        	var html = '';
        	for(var key in validator.submitted){
        		var label = $('label[for^="'+ key +'"]').not('[generated]');
        		var legend = label.closest('fieldset').find('.ui-controlgroup-label');
        		var fieldName = legend.length ? legend.text() : label.text();
        		html += '<li>' + fieldName + '</li>';
        	};
        	$("#formErrors ul").html(html);
        },
        submitHandler: function(){
            var data = logIt.serializeArray();
            console.log(data);
            saveData(data);
        }
    });
});
$('#iSpyLocal').on('pageinit', function(){
	// console.log("View iSpyLog page Loaded")
	$("#clearLog").click (chopLogs);

	$(".showDefaults").click (getData);
});
$("#jsonImports").on('pageinit',function(){
	 console.log("Import page Loaded")
	$('#jsonData').on("click", function(){
        $('#otherData').empty();
        $.getJSON('xhr/data.json', function(jsonData) {
        	 console.log(jsonData);
			var design = $('#design');
            design.empty().html('<b>JSON Data</b>: ').css("color", "red");
            for ( var i = 0, len = jsonData.fakeLogs.length; i < len; i++ ) {
                var things = jsonData.fakeLogs[i];
				console.log(things);
        	$('#otherData').append("<h3>"+ things.gDate[0] + " " + things.gDate[1] +"</h3>")
        				  .append("<p><strong>"+ things.gWhat[0] + " " + things.gWhat[1] +"</strong></p>")
        				  .append("<p>"+ things.gColor[0] + " " + things.gColor[1] +"</p>")
        				  .append("<p>"+ things.checked[0] + " " + things.checked[1] +"</p>")
        				  .append("<p>"+ things.gTime[0]		+ " " + things.gTime[1] +"</p>")
        				  .append("<hr />");
        	}
        });
	});
    $('#csv').on('click', function(){
    	$('#otherData').empty();
        $.get('xhr/data.csv', function(csv) {
             console.log(csv);
            var design = $('#design');
            design.empty().html('<b>CSV Data</b>: ').css("color", "red");
            var go = csv.split(/\r\n|\n/);
            var splitLogs = go[0].split('|');
            var stackEm = [];
            for (var i=1; i<go.length; i++) {
              	var data = go[i].split('|');
             	if (data.length == splitLogs.length) {
                   var loggedItems = [];
                   for (var j=0; j<splitLogs.length; j++) {
                       loggedItems.push(data[j]);
                       }
                       stackEm.push(loggedItems);
                       }
                }
			for (var k=0; k<stackEm.length; k++){
			var draw = stackEm[k];
            $('#otherData').append("<h3>"+ 'Date: ' + " " + draw[0] +"</h3>")
				  .append("<p><strong>"+ 'What are you grateful for?: '+draw[1]+"</strong></p>")
				  .append("<p>"+'Which color do you like best today?: '+draw[2]+"</p>")
				  .append("<p>"+'Which items do you like?: '+draw[3]+"</p>")
				  .append("<p>"+'What time is it?: '+draw[4]+"</p>")
				  .append("<hr />");
            }
        }, "text");
    });
});
