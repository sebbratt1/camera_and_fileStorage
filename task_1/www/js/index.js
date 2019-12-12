//global variables
var filetext  = "";
var fileBinding;
var fileEntry;
var fileSystem;
var buttonType;


console.log("setting up events");

//setup event listeners
$(document).on("pagecreate","#pageone", onPageCreated);

//setup listener for device API load
document.addEventListener("deviceready", onDeviceReady, false);

// once jQuery page 'pageone' has been created 
function onPageCreated() {

     console.log("page created");
	
	//setup buttons
	$('#writeFile').on("click", setupWriteFile);
	$('#deleteFile').on("click", setupDeleteFile);
	
}

function onDeviceReady() {
	console.log("device ready");
	
    
    //following allows you to gain access to the supported platform specific locations that are shared by all applications (useful for stioring images, music etc. )
    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, gotFS, fail);
}

//get access to file and CREATE if does not exists
function gotFS(p_fileSystem) {
    fileSystem = p_fileSystem;
 	fileSystem.getFile("test.txt", {create: true, exclusive: false}, gotFileEntry, fail);
	
}

//get file entry
function gotFileEntry(fileEntry) {
	
	console.log("got file entry");
	this.fileEntry = fileEntry
	fileEntry.file(gotFile, fail);
}

//get file itself
function gotFile(file){
    console.log("got file");

	switch(buttonType)
	{
		case "write":
			writeFile();
			break;
			
		case "read":
			readAsText(file);
			break		
	}
	
}

//READ text from file - assumes that the file contains 
function readAsText(file) {
    console.log("readAsText");
	
	var reader = new FileReader();
	
	//assigns a callback function to be run once the file has been completely read
	reader.onloadend = function(evt) {
	
		//store the new string in 'filetext'
		filetext = evt.target.result;
	
        $('#textarea').val(filetext);
        
    };
	
	//begin reading the file
   	reader.readAsText(file);
}

function setupWriteFile()
{
	buttonType = "write";
	gotFS(fileSystem);
	

}

function setupDeleteFile()
{
	buttonType = "delete";
	deleteFile();
}



//UDPATE file contents - called when submit button is pressed
function writeFile()
{	
    console.log("writeFile: "  + fileEntry.fullPath);
    
    filetext = $('#textarea').val();
    
	fileEntry.createWriter(
		function (writer) { 
			writer.write(filetext);
		}, 
		fail
	);
}



// DELETE file contents - called when delete button is pressed
function deleteFile()
{
	fileEntry.remove();
    console.log("file deleted");
	
}

function fail(error) {
	alert("Cannot use file: " + error.message);
}


