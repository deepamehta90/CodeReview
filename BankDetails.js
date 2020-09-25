var from = "noreply@india.nec.com";
var userName="";
var userEmail="";
var userCode ="";
var listBankName = "";
var listAccountNo = "";
var listIFSC ="";
var listID="";

//for restricting special characters
var specialKeys = new Array();
        specialKeys.push(8); //Backspace Character
        specialKeys.push(9); //Tab Character
        specialKeys.push(46); //Delete Character
        specialKeys.push(36); //Home Character
        specialKeys.push(35); //End Character
        specialKeys.push(37); //Left Character
        specialKeys.push(39); //Right Character
        function IsAlphaNumeric(e) {
            var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
            var ret = ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode));
            return ret;            
             if (event.keyCode == 32) {
        return false;
    }
        }

$(document).ready(function () {
   $('#txtAccountNumber').keypress(function (e) {
            //if the letter is not digit then display error and don't type anything
            if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                //display error message
                $(".errmsg").html("Digits Only").show().fadeOut("slow");
                return false;
            }
        });
        $('#txtAccountNumber').bind("paste", function (e) {
            e.preventDefault();
        });
        $('#txtAccountNumber').bind('mouseenter', function (e) {
            var val = $(this).val();
            if (val != '0') {
                val = val.replace(/[^0-9]+/g, "")
                $(this).val(val);
            }
        });
        
  //change the text to upper case:IFSC
  $("#txtIFSC").keyup(function() { 
      this.value = this.value.toLocaleUpperCase(); 
  }); 

	GetUserProfileProperties();

	$("#btnSubmit").click(function() {
	/*dialog = bootbox.dialog({
    message: '<p><i class="fa fa-spin fa-spinner"></i>Please wait till the request submits...</p>'
});
dialog.init(function(){
    setTimeout(function(){
        
    }, 3000);
});*/
	validateMandatoryFields();	
	});
});

 function changeValue(dropdown) {
                var option = dropdown.options[dropdown.selectedIndex].value,
                field = document.getElementById('txtAccountNumber');

                if (option == 'HDFC Bank') {
                    field.maxLength = 14;
                } 
                else if (option == 'ICICI Bank') {
                    field.maxLength = 12;
                } 
                else if (option == 'Kotak Mahindra Bank') {
                    field.maxLength = 10;
                } 
                else{}
            }
            
function fileValidation() { 
            var fileInput =  
                document.getElementById('file'); 
              
            var filePath = fileInput.value; 
          
            // Allowing file type 
            var allowedExtensions =  
                    /(\.jpg|\.jpeg|\.png)$/i; 
              
            if (!allowedExtensions.exec(filePath)) { 
                bootbox.alert('Invalid file type. Enter only image file(.jpg, .jpeg, .png)'); 
                fileInput.value = ''; 
                return false; 
            }  
            else  
            { 
              
                // Image preview 
                if (fileInput.files && fileInput.files[0]) { 
                const fi = document.getElementById('file');
                const fsize = fi.files[0].size;
                const fileSize = Math.round((fsize / 1024));
                
                  if (fileSize >= 8192) { 
                    bootbox.alert("File too Big, please select a file less than 8 MB"); 
                } else {                  
                   var reader = new FileReader(); 
                    reader.onload = function(e) {
                    document.getElementById("blah").style.display = "block";
                    $('#blah').attr('src', e.target.result); 
                    };                       
                    reader.readAsDataURL(fileInput.files[0]); 
                    }
                } 
            } 
        } 

function GetUserProfileProperties(){ 
         $.ajax({  
			url: _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties",	
            async: false,  
            headers: { Accept: "application/json;odata=verbose" },  
            success: function (data) {  
                try {   
                var properties = data.d.UserProfileProperties.results;
				userEmail =  data.d.Email;
				$('#txtEmployeeEmail').val(userEmail);

                     for (var i = 0; i < properties.length; i++) {  

                        var property = properties[i];
                        
                        if (property.Key == "Employeeid") {
                            userCode = property.Value;  
							$('#txtEmployeeCode').val(userCode);
                        }  

                         if (property.Key == "PreferredName") {      //Changed here to display name
                            userName = property.Value; 
                            $('#txtEmployeeName').val(userName);
                       }
                    }
                    debugger;
                    if(userEmail == null || userEmail == "" || userCode == null || userCode == "" || userName == null || userName == "")
                    {
	                    	bootbox.alert("Error while fetching User Details. Kindly raise an incident at NECTI IT Helpdesk (NECTIIThelpdesk@india.nec.com).", 							function(){ 
	   						window.location.href = "/sites/Finance/ExpenseClaimSystem/";});
                    }
                    else
                    {
                    		checkUserInList(userEmail);	
                    }	
                } catch (err2) {  
                console.log("Error while fetching user data from SP User Profile"+err2);
                }  
            },  
            error: function (jQxhr, errorCode, errorThrown) {  
                bootbox.alert("Error while fetching User Details: "+errorThrown);  
            }  
        });
}

function checkUserInList(userEmail)
{
debugger;
var requestURL = _spPageContextInfo.webAbsoluteUrl +  "/_api/Web/Lists/GetByTitle('EmployeeData')/Items?$filter=EmpEmail eq '"+userEmail+"'";

$.ajax({
        url: requestURL ,
        type: "GET",
        async: false,
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function (data) {
             numofItems = data.d.results.length;
             
             if(numofItems == 1)
             {
             
             if(data.d.results[0].ID == null)
	             {
	             	listID = "";
	             }
	             else
	             {
	             	listID= data.d.results[0].ID;
	             }
             
	             //ListColumn::HtmlFieldName
	             //BankName::ddlBankName
	             if(data.d.results[0].BankName == null || data.d.results[0].BankName == "Please Select")
	             {
	             	document.getElementById('ddlBankName').value = "Please Select";
	             }
	             else
	             {
	             	document.getElementById('ddlBankName').value = data.d.results[0].BankName; 
	             	listBankName = data.d.results[0].BankName; 
	             }
	                          
	             //txtAccountNumber::AccountNo
	             if(data.d.results[0].AccountNo == null)
	             {
	             	$('#txtAccountNumber').val("");
	             }
	             else
	             {
	             	$('#txtAccountNumber').val(data.d.results[0].AccountNo);
	             	listAccountNo = data.d.results[0].AccountNo;
	             }
	             
	             //txtIFSC::IFSC
	             if(data.d.results[0].IFSC == null)
	             {
	             	$('#txtIFSC').val("");
	             }
	             else
	             {
	             	$('#txtIFSC').val(data.d.results[0].IFSC);  
	             	listIFSC = data.d.results[0].IFSC;
	             }
             }
             else if(numofItems == 0)
             {

             }
             else
             {
             bootbox.alert("Multiple records found.Please contact BA Team.", function(){ 
				window.location.href = "/sites/Finance/ExpenseClaimSystem/";  });           
            }
        },
        error: function (error) {

            bootbox.alert("Error in checking user entry in list. Kindly raise an incident at NECTI IT Helpdesk."+JSON.stringify(error));
        }
    });
}

//validate mandatory fields
function validateMandatoryFields()
{
var isValid = true;
            bankname = $('#ddlBankName').val();
            bankac = $('#txtAccountNumber').val();
            ifsc = $('#txtIFSC').val();
            name = $('#txtEmployeeName').val();
            email = $('#txtEmployeeEmail').val();
            code = $('#txtEmployeeCode').val();

            $('#displayerrorbankname').remove();
            $('#displayerrorbankac').remove();
            $('#displayerrorifsc').remove();
            $('#displayerrorname').remove();
            $('#displayerroremail').remove();
            $('#displayerrorcode').remove();
            $('#displayerrorattachment').remove();

            if (bankname == "Please Select") {

                $('#banknameDiv select').after('<div id = "displayerrorbankname" class="error">Please select this Bank Name.</div>');

                isValid = false;
            }            
            
            if (bankac.trim() == "") {
                $('#bankacDiv input').after('<div id = "displayerrorbankac" class="error">Please enter Account Number</div>');
                isValid = false;
            }
            else if(bankname == "Please Select" && (bankac.trim().length < 10 || bankac.trim().length > 14))
            {
            	$('#bankacDiv input').after('<div id = "displayerrorbankac" class="error">Please enter valid account number.</div>');
                	isValid = false;
            }
            else
            {
            	if(bankname.toLowerCase().trim() == "hdfc bank" && bankac.trim().length != 14)
            	{
            		$('#bankacDiv input').after('<div id = "displayerrorbankac" class="error">Please enter valid 14 digits account number.</div>');
                	isValid = false;
            	}
            	else if(bankname.toLowerCase().trim() == "icici bank" && bankac.trim().length != 12)
            	{
            		$('#bankacDiv input').after('<div id = "displayerrorbankac" class="error">Please enter valid 12 digits account number.</div>');
                	isValid = false;
            	}
            	else if(bankname.toLowerCase().trim() == "kotak mahindra bank" && bankac.trim().length != 10)
            	{
            		$('#bankacDiv input').after('<div id = "displayerrorbankac" class="error">Please enter valid 10 digits account number.</div>');
                	isValid = false;
            	}
				else{}
	        }
            
            if (ifsc == "") {
                $('#ifscDiv input').after('<div id = "displayerrorifsc" class="error">Please enter IFSC.</div>');
                isValid = false;
            }
             else
            {
	            if(ifsc.length != 11)
	            {
	            $('#ifscDiv input').after('<div id = "displayerrorifsc" class="error">Please enter valid 11 digit IFSC Code</div>');
	            isValid = false;
	            }
            }

            if (name == "" ) {
                $('#nameDiv input').after('<div id = "displayerrorname" class="error">Kindly raise a ticket at NECTI IT Helpdesk</div>');
                isValid = false;
            }
            else if(name != userName)
            {
             $('#nameDiv input').after('<div id = "displayerrorname" class="error">Employee Name cannot be changed.</div>');
                isValid = false;
            }
            
            
             if (email == "") {
                $('#emailDiv input').after('<div id = "displayerroremail" class="error">Kindly raise a ticket at NECTI IT Helpdesk</div>');
                isValid = false;
            }
            else if (email != userEmail) {
                $('#emailDiv input').after('<div id = "displayerroremail" class="error">Employee Email cannot be changed.</div>');
                isValid = false;
            }
            
            
 		if (code == "") {
                $('#codeDiv input').after('<div id = "displayerrorcode" class="error">Kindly raise a ticket at NECTI IT Helpdesk</div>');
                isValid = false;
         }
         else if (code != userCode) {
                $('#codeDiv input').after('<div id = "displayerrorattachment" class="error">Employee Code cannot be changed</div>');
                isValid = false;
            }
            
        if (document.getElementById("file").files.length === 0) {  
        $('#attachmentdiv input').after('<div id = "displayerrorcode" class="error">Kindly attach image of the cheque</div>');
                isValid = false;
}                   

			
	if(isValid == true)
	{
		$(".modal1").show();
		setTimeout(function() {
            submitDetails();
        }, 50);
     }
     
     }

function submitDetails()
{
debugger;
if(listID == "")
{
addNewItem();
}
else
{
updateExistingItem(listID);
}
/* $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl +  "/_api/Web/Lists/GetByTitle('EmployeeData')/Items?$filter=EmpEmail eq '"+userEmail+"'",
        type: "GET",
        async: false,
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function (data) {
             numofItems = data.d.results.length;
             	
             if(numofItems == 1)
             {
	            itmID=data.d.results[0].ID;
	            subject = "Bank Details Updated Successfully";
	            updateExistingItem(itmID); 
	          }
	          else if(numofItems == 0)
	            {
	            addNewItem();
				subject = "Bank Details Submitted Successfully";
				sendEmail(from, to, cc, body, subject);
				bootbox.alert("Details Submitted Successfully!", function(){ 
    				window.location.href = "/sites/Finance/ExpenseClaimSystem/";
				}); 

	            }
             else
             {
             	bootbox.alert("Multiple records found.Please contact BA Team.", function(){ 
window.location.href = "/sites/Finance/ExpenseClaimSystem/";  });
             }
                   
             },
        error: function (err) {
            bootbox.alert(JSON.stringify(error)+"checkUserEntryInList");
        }
    }); */
}

function updateExistingItem(itmID)
{
debugger;
$.ajax({
              url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('EmployeeData')/items("+itmID+")",
              type: "POST",
              async: false,
              data: JSON.stringify({
                  '__metadata': { type: "SP.Data.EmployeeDataListItem" },
                  "EmpName": $('#txtEmployeeName').val(),
                  "EmpEmail": $('#txtEmployeeEmail').val(),
                  "EmpCode": $('#txtEmployeeCode').val(),
                  "BankName": $('#ddlBankName').val(),
                  "AccountNo": $('#txtAccountNumber').val(),
                  "IFSC": $('#txtIFSC').val(),
                  "PrevBankName": listBankName,
                  "PrevAccountNo": listAccountNo,
                  "PrevIFSC": listIFSC,
                   }),
              headers: {
            "Accept": "application/json;odata=verbose",  
            "Content-Type": "application/json;odata=verbose",  
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),  
            "IF-MATCH": "*",  
            "X-HTTP-Method": "MERGE"  
                            },
              success: function(data){  
                     debugger;
                                   if (document.getElementById("file").files.length === 0) { }
                                   else{
                              //     var itemId =  data.d.ID;  
                var fileInput = $('#file');
                var fileCount = fileInput[0].files.length;  
		                for(var i=0;i<fileCount;i++)
		                {
		                	var fileArray = [];
		                    fileArray.push(fileInput[0].files[0]);
		                    uploadFileSP("EmployeeData", itmID, fileArray, fileCount);
		                }                   
                                   }                                                                                                                    
                            },
              error: function(data){
                                bootbox.alert("Error Occured while updating."+err)
                            }
          });
}

function addNewItem()
{

debugger;
var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('EmployeeData')/items";

var item = {
                  "__metadata": {
                      "type": "SP.Data.EmployeeDataListItem"
                  },
                  "EmpName": $('#txtEmployeeName').val(),
                  "EmpEmail": $('#txtEmployeeEmail').val(),
                  "EmpCode": $('#txtEmployeeCode').val(),
                  "BankName": $('#ddlBankName').val(),
                  "AccountNo": $('#txtAccountNumber').val(),
                  "IFSC": $('#txtIFSC').val(),
               };    

              $.ajax({
                  url: url ,
                  type: "POST",
                  async: false,
                  contentType: "application/json;odata=verbose",
                  data: JSON.stringify(item),
                  headers: {
                      "Accept": "application/json;odata=verbose",
                      "X-RequestDigest": $("#__REQUESTDIGEST").val()
                  },
                  success: function(data) {
                  var itemId =  data.d.ID;  
 				if (document.getElementById("file").files.length === 0) { }
                                   else{
                              //     var itemId =  data.d.ID;  
                var fileInput = $('#file');
                var fileCount = fileInput[0].files.length;  
		                for(var i=0;i<fileCount;i++)
		                {
		                	var fileArray = [];
		                    fileArray.push(fileInput[0].files[0]);
		                    uploadFileSP("EmployeeData", itemId , fileArray, fileCount);
		                }                   
                                   } 
                  },
                  error: function(err) {
                  bootbox.alert("Error Occured while submitting."+err)
                  }
              });
}

	//send mail
	function sendEmail(from, to, cc, body, subject) {
	//to = "kriti.saran@india.nec.com";
	//cc = "Sophiya.bhatia@india.nec.com";
	debugger;
	  	var appWebUrl = window.location.protocol + "//" + window.location.host 
	                + _spPageContextInfo.webServerRelativeUrl;
	    var hostUrl = _spPageContextInfo.siteAbsoluteUrl;
	    var constructedURL = appWebUrl + "/_api/SP.Utilities.Utility.SendEmail";         
	    var formDigest = document.getElementById("__REQUESTDIGEST").value;
	        $.ajax({
	            contentType: 'application/json',
	            url: constructedURL ,
	            async: false,
	            type: 'POST',
	            data: JSON.stringify({
	                'properties': {
	                    '__metadata': {
	                        'type': 'SP.Utilities.EmailProperties'
	                    },
	                    'From': from,
	                    'To': {
	                        'results': [to]
	                    },
	                    'CC': {
	                    	'results': [cc] 
	                    },
	                    'Subject': subject,
	                    'Body': body
	                }
	            }),
	            headers: {
	            	
	                "Accept": "application/json;odata=verbose",
	                "content-type": "application/json;odata=verbose",
	                "X-RequestDigest": formDigest
	            },
	            success: function(data) {
					bootbox.alert("Details Updated Successfully and mail sent!", function(){ 
    				window.location.href = "/sites/Finance/ExpenseClaimSystem/";
				});
	            },
	            error: function(err) {
					saveErrorList(pageName, loggedInUserEmail, "sendEmail()", err);
	            }
	        });
	        }
	        
	        
	        function getFileBuffer(file) {
var deferred = $.Deferred();
var reader = new FileReader();
reader.onload = function (e) {
    deferred.resolve(e.target.result);
}
reader.onerror = function (e) {
console.log(e);
    deferred.reject(e.target.error);
    console.log(e.target.error);
}
reader.readAsArrayBuffer(file);
return deferred.promise();
}



function uploadFileSP(listName, id, fileArray, fileCount) {
var FilesCount = 0;
var deferred = $.Deferred();
var uploadStatus = "";
var file = fileArray[0];
var getFile = getFileBuffer(file);

getFile.done(function (buffer, status, xhr) {
debugger;
    var bytes = new Uint8Array(buffer);
    var content = new SP.Base64EncodedByteArray();
   // var queryUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/lists/GetByTitle('" + listName + "')/items(" + id + ")/AttachmentFiles/add(FileName='" + file.name + "')";
   var d = new Date();
var month = parseInt(d.getMonth())+1;
var todayDate = month +"/"+d.getDate()+"/"+d.getFullYear();

var fileNameToBeUploaded= userCode + "_"+ $('#txtAccountNumber').val()+"_"+todayDate;
var queryUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/lists/GetByTitle('" + listName + "')/items(" + id + ")/AttachmentFiles/add(FileName='" + fileNameToBeUploaded + "')";
    var uploadCount = 0;
    $.ajax({
        url: queryUrl,
        type: "POST",
        processData: false,
        contentType: "application/json;odata=verbose",
        data: buffer,
        headers: {
            "accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
        },
        success: function (data) {
            FilesCount++;
            uploadStatus = FilesCount;
            fileArray.shift();
            if (fileArray.length > 0) {
                uploadFileSP(listName , id, fileArray, fileArray.length);
            }
            else {
            to = $('#txtEmployeeEmail').val();
			cc = "";
				
body="<table width='100%' border=3 style='border-color:white;font-weight: normal;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:13px;'>"+
"<tr><td colspan=4 style='background-color: #8e8b8b; color:white; height: 40px;font-size:15px;padding-left: 1%;' valign='center'><b>Expense Claim System:</b> Bank Details Submitted</td></tr>"+
"<tr><td style='background-color:#7d7dda;;padding-left: 1%; color:white; width:25%' valign='to'>USER <br/><br/>"+$('#txtEmployeeName').val()+"<br/>"+$('#txtEmployeeCode').val()+"</td>"+
"<td style='background-color:#5ea25e;;padding-left: 1%; color:white;width:25%' valign='top'>BANK NAME <br/><br/>"+$('#ddlBankName').val()+"</td>"+
"<td style='background-color:#bdb9b9;;padding-left: 1%; color:white;width:25%' valign='top'>A/C No<br/><br/>"+$('#txtAccountNumber').val()+"</td>"+
"<td style='background-color: #3f51b5;;padding-left: 1%; color:white;width:25%' valign='top'>IFSC<br/><br/>"+$('#txtIFSC').val()+"</td>"+
"</tr>"+
"<tr><td colspan=4 style='background-color:white;;padding-left: 1%; color:black; height:35px;' valign=center><b>Date: "+todayDate+"</b></td></tr>"+
"<tr><td colspan=4 style='background-color:white;;padding-left: 1%; color:black'><br/>Dear User,<br/><br/>Your bank details have been submitted successfully.<br/><br/> <a href='"+_spPageContextInfo.webAbsoluteUrl +"/SitePages/BankDetails.aspx'>Click Here<a> to view the same on system.<br/><br/>Thank you.<br/><br/>Regards,<br/>Finance Team<br/></td></tr>"+
"<tr><td colspan=4 style='font-size:14px;;padding-left: 1%; background-color: #dcd8d8; color:black;'> Please raise a ticket at <a href='https://ntichikettoseva.nectechnologies.in/'>NECTI IT Helpdesk</a> in case you face any issue while accessing the Portal.</td></tr></table>";
subject= "Bank Details submitted";
				sendEmail(from, to, cc, body, subject);
				
            }
        },
        error: function (err) {                
           bootbox.alert("File failed to upload.", function(){ 
    				window.location.href = "/sites/Finance/ExpenseClaimSystem/";
				});
        }
    });
    deferred.resolve(uploadStatus);
});

getFile.fail(function (err) {
alert(err);
    deferred.reject(err);
});

return deferred.promise();
}
