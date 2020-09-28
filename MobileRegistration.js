var from = "noreply@india.nec.com";
var userName="";
var userEmail="";
var userCode ="";
var userBand = "";
var userDepartment = "";
var userBUHead = "";
var userBUHeadEmail = "";
var userLocation = "";

$(document).ready(function () {

	GetUserProfileProperties();
	
	$('#txtPhoneNo').keypress(function (e) {
            //if the letter is not digit then display error and don't type anything
            if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                //display error message
                $(".errmsg").html("Digits Only").show().fadeOut("slow");
                return false;
            }
        });
        $('#txtPhoneNo').bind("paste", function (e) {
            e.preventDefault();
        });
        $('#txtPhoneNo').bind('mouseenter', function (e) {
            var val = $(this).val();
            if (val != '0') {
                val = val.replace(/[^0-9]+/g, "")
                $(this).val(val);
            }
        });
	
	$("#btnSubmit").click(function() {
	validateMandatoryFields();
	});
});   

function GetUserProfileProperties(){ 
var eA11;
//debugger;
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
                       
                        //Employee Location
                        if (property.Key == "L") {
                            userLocation = property.Value;  
                       }

                       
                       //Employee Band
                         if (property.Key == "EmployeeSubBand") {
                         	userBand = property.Value;
                            
                       }
                       
                       //Employee Band
                         if (property.Key == "EmployeeBand") {
                         	eA11 = property.Value;
                       }

                       
                       //Department
                         if (property.Key == "Department") {
                         	userDepartment = property.Value;
                            $('#txtDepartment').val(userDepartment);
                       }
                       
                       //Phone No
                         if (property.Key == "MobileNo") {
                            $('#txtPhoneNo').val(property.Value);
                       }
                       
                       //BU Head Name
                         if (property.Key == "BUheadName") {
                         userBUHead = property.Value;
                            $('#txtApproverName').val(userBUHead);   
                       }

						//BU Head Email
                         if (property.Key == "BUHeadEmail") {
                         userBUHeadEmail = property.Value;
                            $('#txtApproverEmail').val(userBUHeadEmail); 
                       }
                    }
                    
                    if(userLocation != "" && userLocation.toLowerCase() == "noida")
					{
					$('#txtEmployeeBand').val(userBand); 
					}
					else
					{
					userBand =eA11;
					var newBand = eA11;
					$('#txtEmployeeBand').val(userBand); 
					userBand = GetBandMapping(newBand);
					}
					
                    
                    if(userEmail == "" || userEmail == null || userCode == "" || userCode == null || userName == "" || userName == null ||
                    userBand == "" || userBand == null || userDepartment  == "" || userDepartment  == null){
                    	bootbox.alert("Error while fetching User Details. Kindly raise an incident at NECTI IT Helpdesk (NECTIIThelpdesk@india.nec.com).", 							function(){ 
	   						window.location.href = "/sites/Finance/ExpenseClaimSystem/";});
                    }
                    else
                    {
                    	
                    	if(userBand.split('E')[1] > 4.0 || userBand == "EX" || userBand == "M15") 
						{
							checkUserInList(userEmail);
							
						}
						else if(userBUHead  == "" || userBUHead  == null || userBUHeadEmail == "" || userBUHeadEmail == null)
						{
							bootbox.alert("Error while fetching User Details. Kindly raise an incident at NECTI IT Helpdesk 												(NECTIIThelpdesk@india.nec.com).",function(){ 
	   						window.location.href = "/sites/Finance/ExpenseClaimSystem/";});

						}
						else
						{
						document.getElementById("approvalDiv").style.display = "block";
							checkUserInList(userEmail);
							}
                    }     
                } catch (err2) {  
                console.log("Error while fetching user data from SP User Profile"+err2);
                } 
            },  
            error: function (jQxhr, errorCode, errorThrown) {  
                alert(errorThrown);  
            }  
        });
}


function GetBandMapping(otherlocationuserband)
{
	//debugger;
	var strcomparedBandofotherlocation="";
	//window.location.host
	var urlbandMapping= _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('BandMapping')/items?$select=NoidaBand,OtherLocationBand&$filter=OtherLocationBand eq '"+otherlocationuserband+"' ";
	
	//var urlbandMapping= _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('"+ListBandMapping+"')/items?$select=NoidaBand,OtherLocationBand&$filter=OtherLocationBand eq '"+otherlocationuserband+"' ";
	
	$.ajax  
	({         
	url: urlbandMapping,
	type: "GET",  
	async: false,
	headers:  
	{  
	"Accept": "application/json;odata=verbose",  
	"Content-Type": "application/json;odata=verbose",  
	"X-RequestDigest": $("#__REQUESTDIGEST").val(),  
	"IF-MATCH": "*",  
	"X-HTTP-Method": null  
	},  
	cache: false,  
	success: function(data)   
	{ 
	//debugger;
	var results = data.d.results;
	var leng=results.length;
	if(leng!=0)
	{
	for (var i = 0; i < results.length; i++)   
	{
	
	var strNoidaBand=data.d.results[i].NoidaBand;
	strcomparedBandofotherlocation=strNoidaBand;
	
	}
	
	}
	else
	{
	bootbox.alert("Manager Band Mapping not available.Kindly raise a ticket at NECTI IT Helpdesk.", function(){ 
   window.location.href = "/sites/Finance/ExpenseClaimSystem/";
});

	
	}
	
	},   
	
	error: function(data)  
	{  
bootbox.alert("Manager Band Mapping not available.Kindly raise a ticket at NECTI IT Helpdesk.", function(){ 
   window.location.href = "/sites/Finance/ExpenseClaimSystem/";
});
	
	}      
	
	}) ;
	return  strcomparedBandofotherlocation;        
	
} 


function checkUserInList(userEmail)
{
//debugger;
var requestURL = _spPageContextInfo.webAbsoluteUrl +  "/_api/Web/Lists/GetByTitle('EmployeeData')/Items?$filter=EmpEmail eq '"+userEmail+"'";

$.ajax({
        url: requestURL ,
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function (data) {
             numofItems = data.d.results.length;
             if(numofItems == 1)
             {
	             //ListColumn::HtmlFieldName
	             if(data.d.results[0].Status == null)
	             {
	             	var d = new Date();
					var month = parseInt(d.getMonth())+1;
					var RegDate = month +"/"+d.getDate()+"/"+d.getFullYear()
					$('#txtRegistrationDate').val(RegDate);					
					document.getElementById("buttonDiv").style.display = "block";
					
					if(userBand.split('E')[1] < 4.0)
					{
						document.getElementById("approvalDiv").style.display = "block";
					}
	             }
	             else if(data.d.results[0].Status == "Pending For Approval")
	             {
	             	$('#txtPhoneNo').val(data.d.results[0].MobileNumber);
	             	document.getElementById("txtPhoneNo").readOnly = true;
					document.getElementById("txtPhoneNo").style.background = "#DCDCDC";
					
					$('#txtRegistrationDate').val(data.d.results[0].DateOfRegistration);
					document.getElementById("statusDiv").style.display = "block";
					document.getElementById("statusNote").innerHTML = "NOTE: Your Mobile Number is pending for approval at "+data.d.results[0].EmpBUHead+".";
	             	document.getElementById("statusNote").style.color = "#FF0000";
	             	
	             	if(userBand.split('E')[1] < 4.0)
					{
						document.getElementById("approvalDiv").style.display = "block";
						
						$('#txtApproverName').val(data.d.results[0].EmpBUHead);
						
						$('#txtApproverEmail').val(data.d.results[0].EmpBUHeadEmail);
					}
	             }
	             else if(data.d.results[0].Status == "Registered" || data.d.results[0].Status == "Rejected")
	             {
	             	$('#txtPhoneNo').val(data.d.results[0].MobileNumber);
	             	document.getElementById("txtPhoneNo").readOnly = true;
					document.getElementById("txtPhoneNo").style.background = "#DCDCDC";
					
					$('#txtRegistrationDate').val(data.d.results[0].DateOfRegistration);					
					 if(userBand.split('E')[1] < 4.0)
					{
						document.getElementById("approvalDiv").style.display = "block";
						
						$('#txtApproverName').val(data.d.results[0].EmpBUHead);
												
						$('#txtApproverEmail').val(data.d.results[0].EmpBUHeadEmail);
					}
					
					document.getElementById("statusDiv").style.display = "Block";
					
					if(data.d.results[0].Status == "Registered")
					{
					document.getElementById("statusNote").innerHTML = "NOTE: Your Mobile Number is "+data.d.results[0].Status;
	             	document.getElementById("statusNote").style.color = "#006400";
	             	}
	             	if(data.d.results[0].Status == "Rejected")
	             	{
	             	document.getElementById("statusNote").innerHTML = "NOTE: Your Mobile Number is "+data.d.results[0].Status+" with reason: '"+data.d.results[0].ReasonForRejection+"'.";
	             	document.getElementById("statusNote").style.color = "#FF0000";
	             	}
	             }
	             else
	             {}   
             }
             else if(numofItems == 0)
             {
				var d = new Date();
				var month = parseInt(d.getMonth())+1;
				var RegDate = month +"/"+d.getDate()+"/"+d.getFullYear()
				$('#txtRegistrationDate').val(RegDate);				
				document.getElementById("buttonDiv").style.display = "block";
				
				if(userBand.split('E')[1] < 4.0)
					{
						document.getElementById("approvalDiv").style.display = "block";
					}
             }
             else
             {
	             bootbox.alert("Multiple records found.Please contact BA Team).", function(){ 
	   						window.location.href = "/sites/Finance/ExpenseClaimSystem/";});           
            }
        },
        error: function (error) {

            alert(JSON.stringify(error)+"checkUserEntryInList");
        }
    });
}

//validate mandatory fields
function validateMandatoryFields()
{
var isValid = true;
            
empName = $('#txtEmployeeName').val();
$('#displayerrorempName').remove();
if (empName == "") {
	$('#empNameDiv input').after('<div id = "displayerrorempName" class="error">Please contact BA Team.</div>');
	isValid = false;
}
else if(empName.trim() != userName)
{
	$('#empNameDiv input').after('<div id = "displayerrorempName" class="error">Display Name cannot be changed.</div>');
	isValid = false;
}


empEmail = $('#txtEmployeeEmail').val();
$('#displayerrorempEmail').remove();
if (empEmail == "") {
	$('#empEmailDiv input').after('<div id = "displayerrorempEmail" class="error">Please contact BA Team.</div>');
	isValid = false;
}
else if (empEmail != userEmail) {
	$('#empEmailDiv input').after('<div id = "displayerrorempEmail" class="error">Employee Email cannot be changed.</div>');
	isValid = false;
}


empBand = $('#txtEmployeeBand').val();
$('#displayerrorempBand').remove();
if (empBand == "") {
	$('#empBandDiv input').after('<div id = "displayerrorempBand" class="error">Please contact BA Team.</div>');
	isValid = false;
}


empCode = $('#txtEmployeeCode').val();
$('#displayerrorempCode').remove();
if (empCode == "") {
	$('#empCodeDiv input').after('<div id = "displayerrorempCode" class="error">Please contact BA Team.</div>');
	isValid = false;
}
else if (empCode != userCode) {
	$('#empCodeDiv input').after('<div id = "displayerrorempCode" class="error">Employee Code cannot be changed.</div>');
	isValid = false;
}


empDepartment = $('#txtDepartment').val();
$('#displayerrorempDepartment').remove();
if (empDepartment == "") {
	$('#empDepartmentDiv input').after('<div id = "displayerrorempDepartment" class="error">Please contact BA Team.</div>');
	isValid = false;
}
else if (empDepartment != userDepartment) {
	$('#empDepartmentDiv input').after('<div id = "displayerrorempDepartment" class="error">Department cannot be changed.</div>');
	isValid = false;
}


empMobileNumber = $('#txtPhoneNo').val();
$('#displayerrorempMobileNo').remove();
if (empMobileNumber == "") {
	$('#empMobileNoDiv input').after('<div id = "displayerrorempMobileNo" class="error">Please enter Mobile No.</div>');
	isValid = false;
}
else
{
	//check for 10 digits
	if(parseInt(empMobileNumber) == 0 || empMobileNumber.toString().length < 10 || empMobileNumber.toString().length > 10)
	{
		$('#empMobileNoDiv input').after('<div id = "displayerrorempMobileNo" class="error">Please enter a valid 10-digit Mobile No.</div>');
		isValid = false;
	}
}


var d = new Date();
var month = parseInt(d.getMonth())+1;
var RegDate = month +"/"+d.getDate()+"/"+d.getFullYear()
registrationDate = $('#txtRegistrationDate').val();
$('#displayerrorregistrationDate').remove();
if (registrationDate == "") {
	$('#registrationDateDiv input').after('<div id = "displayerrorregistrationDate" class="error">Please contact BA Team.</div>');
	isValid = false;
}
else if (registrationDate != RegDate) {
	$('#registrationDateDiv input').after('<div id = "displayerrorregistrationDate" class="error">Registration Date cannot be changed.</div>');
	isValid = false;
}


if(userBand.split('E')[1] < 4.0)
{
	approverName = $('#txtApproverName').val();
	$('#displayerrorapproverName').remove();
	if (approverName == "") {
		$('#empBUHeadDiv input').after('<div id = "displayerrorapproverName" class="error">Please contact BA Team.</div>');
		isValid = false;
	}
	else if (approverName != userBUHead) {
		$('#empBUHeadDiv input').after('<div id = "displayerrorapproverName" class="error">Approver Name cannot be changed.</div>');
		isValid = false;
	}
	
	approverEmail = $('#txtApproverEmail').val();
	$('#displayerrorapproverEmail').remove();
	if (approverEmail == "") {
		$('#empBUHeadEmailDiv input').after('<div id = "displayerrorapproverEmail" class="error">Please contact BA Team.</div>');
		isValid = false;
	}
	else if (approverEmail != userBUHeadEmail) {
	alert(approverEmail)
	alert(userBUHEadEmail)
		$('#empBUHeadEmailDiv input').after('<div id = "displayerrorapproverEmail" class="error">Approver Email cannot be changed.</div>');
		isValid = false;
	}
}

if(isValid == true)
{
	$(".modal1").show();
	setTimeout(function() {
		submitDetails();
	}, 100);

}
}

function submitDetails()
{
//debugger;
var Status;
var PendingWith;
if(userBand.split('E')[1] < 4.0)
{
Status = "Pending For Approval";
PendingWith = $('#txtApproverName').val();
}
else if(userBand.split('E')[1] > 4.0 || userBand == "EX")
{
Status = "Registered";
PendingWith = "Registered";
}
else
{}
 $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl +  "/_api/Web/Lists/GetByTitle('EmployeeData')/Items?$filter=EmpEmail eq '"+userEmail+"'",
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function (data) {
             numofItems = data.d.results.length;
             	to = $('#txtEmployeeEmail').val();
				cc = "";
             if(numofItems == 1)
             {
	            itmID=data.d.results[0].ID;
	            statusInList = data.d.results[0].Status;
	            if(statusInList == null || statusInList == "")
	            {
	            	updateExistingItem(itmID,Status,PendingWith); 
	            }
	            else if(statusInList.trim() == "Pending For Approval")
	            {
	            bootbox.alert("Cannot Submit! The request is already pending for approval.", function(){ 
	   						window.location.href = "/sites/Finance/ExpenseClaimSystem/SitePages/MobileRegistration.aspx";});
	            }
	            else if(statusInList.trim() == "Registered")
	            {
	            bootbox.alert("Cannot Submit! The mobile number is already registered.", function(){ 
	   						window.location.href = "/sites/Finance/ExpenseClaimSystem/SitePages/MobileRegistration.aspx";});
	            }
	            else{}
	          }
	          else if(numofItems == 0)
	            {
	            	addNewItem(Status,PendingWith);
	            }
             else
             {
             	bootbox.alert("Multiple records found.Please contact BA Team).", function(){ 
	   						window.location.href = "/sites/Finance/ExpenseClaimSystem/";});                
	   		}       
             },
        error: function (err) {
            alert(JSON.stringify(error)+"checkUserEntryInList");
        }
    });
}

function updateExistingItem(itmID,Status,PendingWith)
{
$.ajax({
              url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('EmployeeData')/items("+itmID+")",
              type: "POST",
              data: JSON.stringify({
                  '__metadata': { type: "SP.Data.EmployeeDataListItem" },
                  "EmpName": $('#txtEmployeeName').val(),
                  "EmpEmail": $('#txtEmployeeEmail').val(),
                  "EmpCode": $('#txtEmployeeCode').val(),
                  "EmpBand": $('#txtEmployeeBand').val(),
                  "EmpBUHead": $('#txtApproverName').val(),
                  "EmpBUHeadEmail": $('#txtApproverEmail').val(),
                  "EmpBusinessUnit": $('#txtDepartment').val(),
                  "MobileNumber": $('#txtPhoneNo').val(),
                  "DateOfRegistration": $('#txtRegistrationDate').val(),
                  "Status": Status,
                  "PendingWith": PendingWith,
                   }),
              headers: {
            "Accept": "application/json;odata=verbose",  
            "Content-Type": "application/json;odata=verbose",  
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),  
            "IF-MATCH": "*",  
            "X-HTTP-Method": "MERGE"  
                            },
              success: function(data){   
							callMail(Status);
                                                                          
                            },
              error: function(data){
                                alert("Error Occured while updating."+err)
                            }
          });
}

function addNewItem(Status,PendingWith)
{
var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('EmployeeData')/items";

var item = {
                  "__metadata": {
                      "type": "SP.Data.EmployeeDataListItem"
                  },
                  "EmpName": $('#txtEmployeeName').val(),
                  "EmpEmail": $('#txtEmployeeEmail').val(),
                  "EmpCode": $('#txtEmployeeCode').val(),
                  "EmpBand": $('#txtEmployeeBand').val(),
                  "EmpBUHead": $('#txtApproverName').val(),
                  "EmpBUHeadEmail": $('#txtApproverEmail').val(),
                  "EmpBusinessUnit": $('#txtDepartment').val(),
                  "MobileNumber": $('#txtPhoneNo').val(),
                  "DateOfRegistration": $('#txtRegistrationDate').val(),
                  "Status": Status,
                  "PendingWith": PendingWith,
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
					callMail(Status);
                  },
                  error: function(err) {
                  alert("Error Occured while submitting."+err)
                  }
              });
}

function callMail(Status)
{
var EmpMailBody;
var MgrMailBody;
cc = "";
var d = new Date();
var month = parseInt(d.getMonth())+1;
var todayDate = month +"/"+d.getDate()+"/"+d.getFullYear();

if(Status == "Registered")
{
	to = $('#txtEmployeeEmail').val();
	/*EmpMailBody = "<p>Dear "+$('#txtEmployeeName').val()+",<br/><br/>Mobile Number "+$('#txtPhoneNo').val()+" has been registered successfully in the system.<br/><br/>"+
	"<br>Regards,<br>Expense Claim System</p>";*/
	subject = "Mobile No Registered Successfully";
	EmpMailBody ="<table width='100%' border=3 style='border-left-color:#313030;border-top-color:#313030;font-weight: normal;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:13px;'><tbody>"+
"<tr><td colspan=4 style='background-color: #8e8b8b; color:white; height: 40px;font-size:15px;padding-left: 1%;' valign='center'><b>Expense Claim System:</b> Mobile Number Registered</td></tr>"+
"<tr><td style='background-color:#7d7dda;;padding-left: 1%; color:white; width:25%' valign='to'>USER <br/><br/>"+$('#txtEmployeeName').val()+"<br/>"+$('#txtEmployeeCode').val()+"</td>"+
"<td style='background-color:#5ea25e;;padding-left: 1%; color:white;width:25%' valign='top'>MOBILE NUMBER <br/><br/>"+$('#txtPhoneNo').val()+"</td>"+
"<td style='background-color:#bdb9b9;;padding-left: 1%; color:white;width:25%' valign='top'>STATUS<br/><br/>Registered</td>"+
"<td style='background-color: #3f51b5;;padding-left: 1%; color:white;width:25%' valign='top'>DATE OF REGISTRATION<br/><br/>"+todayDate+"</td>"+
"</tr>"+
"<tr><td colspan=4 style='background-color:white;;padding-left: 1%; color:black; height:35px;' valign=center><b>Date: "+todayDate+"</b></td></tr>"+
"<tr><td colspan=4 style='background-color:white;;padding-left: 1%; color:black'><br/>Dear User,<br/><br/>Your mobile number has been registered successfully.<br/><br/> <a href='"+_spPageContextInfo.webAbsoluteUrl +"/SitePages/MobileRegistration.aspx'>Click Here</a> to view the same on system.<br/><a href='"+_spPageContextInfo.webAbsoluteUrl +"/SitePages/TelephoneBroadband.aspx'>Click Here</a> to view the same on system.<br/><br/>Thank you.<br/><br/>Regards,<br/>Finance Team<br/></td></tr>"+
"<tr><td colspan=4 style='font-size:14px;;padding-left: 1%; background-color: #dcd8d8; color:black;'> Please raise a ticket at <a href='https://ntichikettoseva.nectechnologies.in/'>NECTI IT Helpdesk</a> in case you face any issue while accessing the Portal.</td></tr></tbody></table>";
	sendEmail(from, to, cc, EmpMailBody, subject);
	bootbox.alert("Mobile Number Registered Successfully!", function(){ 
	window.location.href = "/sites/Finance/ExpenseClaimSystem/";
	});
	
}
else if(Status == "Pending For Approval")
{
	subject = "Mobile No Pending For Approval";
	
	to = $('#txtApproverEmail').val();
	/*MgrMailBody = "<p>Dear "+$('#txtApproverName').val()+",<br/><br/>Registration request for mobile number <b>"+$('#txtPhoneNo').val()+"</b> submitted by <b>"+$('#txtEmployeeName').val()+"</b> is pending for your approval.<br/>"+
	"<a href='"+_spPageContextInfo.webAbsoluteUrl +"/SitePages/MobileRegistrationForApproval.aspx'>Click Here</a> to view requests pending for your approval.<br/>"+
	"<br>Regards,<br>Expense Claim System</p>";*/
	MgrMailBody ="<table width='100%' border=3 style='border-left-color:#313030;border-top-color:#313030;font-weight: normal;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:13px;'><tbody>"+
"<tr><td colspan=4 style='background-color: #8e8b8b; color:white; height: 40px;font-size:15px;padding-left: 1%;' valign='center'><b>Expense Claim System:</b> Mobile Number Pending for Approval</td></tr>"+
"<tr><td style='background-color:#7d7dda;;padding-left: 1%; color:white; width:25%' valign='to'>USER <br/><br/>"+$('#txtEmployeeName').val()+"<br/>"+$('#txtEmployeeCode').val()+"</td>"+
"<td style='background-color:#5ea25e;;padding-left: 1%; color:white;width:25%' valign='top'>MOBILE NUMBER <br/><br/>"+$('#txtPhoneNo').val()+"</td>"+
"<td style='background-color:#bdb9b9;;padding-left: 1%; color:white;width:25%' valign='top'>STATUS<br/><br/>Pending for Approval</td>"+
"<td style='background-color: #3f51b5;;padding-left: 1%; color:white;width:25%' valign='top'>DATE OF REGISTRATION<br/><br/>"+todayDate+"</td>"+
"</tr>"+
"<tr><td colspan=4 style='background-color:white;;padding-left: 1%; color:black; height:35px;' valign=center><b>Date: "+todayDate+"</b></td></tr>"+
"<tr><td colspan=4 style='background-color:white;;padding-left: 1%; color:black'><br/>Dear Approver,<br/><br/><a href='"+_spPageContextInfo.webAbsoluteUrl +"/SitePages/MobileRegistrationForApproval.aspx'>Click Here</a> to take action on the above registration request.<br/><br/>Thank you.<br/><br/>Regards,<br/>Finance Team<br/></td></tr>"+
"<tr><td colspan=4 style='font-size:14px;;padding-left: 1%; background-color: #dcd8d8; color:black;'> Please raise a ticket at <a href='https://ntichikettoseva.nectechnologies.in/'>NECTI IT Helpdesk</a> in case you face any issue while accessing the Portal.</td></tr></tbody></table>";

	sendEmail(from, to, cc, MgrMailBody , subject);
	
	to = $('#txtEmployeeEmail').val();
	/*EmpMailBody = "<p>Dear "+$('#txtEmployeeName').val()+",<br/><br/>Mobile Number "+$('#txtPhoneNo').val()+" is pending with "+$('#txtApproverName').val()+" for approval.<br/>"+
	"<a href='"+_spPageContextInfo.webAbsoluteUrl +"/SitePages/MobileRegistration.aspx'>Click Here</a> to view status for your request.<br/>"+
	"<br>Regards,<br>Expense Claim System</p>";*/
EmpMailBody ="<table width='100%' border=3 style='border-left-color:#313030;border-top-color:#313030;font-weight: normal;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:13px;'><tbody>"+
"<tr><td colspan=4 style='background-color: #8e8b8b; color:white; height: 40px;font-size:15px;padding-left: 1%;' valign='center'><b>Expense Claim System:</b> Mobile Number Submitted</td></tr>"+
"<tr><td style='background-color:#7d7dda;;padding-left: 1%; color:white; width:25%' valign='to'>USER <br/><br/>"+$('#txtEmployeeName').val()+"<br/>"+$('#txtEmployeeCode').val()+"</td>"+
"<td style='background-color:#5ea25e;;padding-left: 1%; color:white;width:25%' valign='top'>MOBILE NUMBER <br/><br/>"+$('#txtPhoneNo').val()+"</td>"+
"<td style='background-color:#bdb9b9;;padding-left: 1%; color:white;width:25%' valign='top'>STATUS<br/><br/>Pending for Approval</td>"+
"<td style='background-color: #3f51b5;;padding-left: 1%; color:white;width:25%' valign='top'>PENDING WITH<br/><br/>"+$('#txtApproverName').val()+"</td>"+
"</tr>"+
"<tr><td colspan=4 style='background-color:white;;padding-left: 1%; color:black; height:35px;' valign=center><b>Date: "+todayDate+"</b></td></tr>"+
"<tr><td colspan=4 style='background-color:white;;padding-left: 1%; color:black'><br/>Dear User,<br/><br/>Your mobile number has been submitted successfully.<br/><br/> <a href='"+_spPageContextInfo.webAbsoluteUrl +"/SitePages/MobileRegistration.aspx'>Click Here</a> to view the status on system.<br/><br/>Thank you.<br/><br/>Regards,<br/>Finance Team<br/></td></tr>"+
"<tr><td colspan=4 style='font-size:14px;;padding-left: 1%; background-color: #dcd8d8; color:black;'> Please raise a ticket at <a href='https://ntichikettoseva.nectechnologies.in/'>NECTI IT Helpdesk</a> in case you face any issue while accessing the Portal.</td></tr></tbody></table>";

	sendEmail(from, to, cc, EmpMailBody, subject);
	
	bootbox.alert("Request sent for approval.", function(){ 
	window.location.href = "/sites/Finance/ExpenseClaimSystem/";
	});
}
}

//send mail
	function sendEmail(from, to, cc, body, subject) {
	//debugger;
		to = "kriti.saran@india.nec.com";
	cc = "komal.takkar@india.nec.com";

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
					console.log("mail sent");
	            },
	            error: function(err) {
					alert("Error while sending mail. Please contact BA Team.\n"+err);
	            }
	        });
	        }