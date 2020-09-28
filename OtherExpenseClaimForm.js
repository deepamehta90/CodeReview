var userEmail;
var userCode;
var userName;
var userBand;
var userUnit;
var userLocation ="";
var managerAccountName;
var userManager;
var userManagerEmail;
var userBUHead;
var userBUHeadEmail;
var autoApprove;
var businessPromotion = false;
var totalClaimedINR = 0;
var totalRowCount = 0;
var rowCount = 0;
var L2Approver = "";
var L2ApproverEmail = "";
var L3Approver = "";
var L3ApproverEmail = "";
var L4Approver = "";
var L4ApproverEmail="";
var CEO="";
var CEOEmail="";
var userCostCenter;
var exceptional = "No";


$(document).ready(function (){
//_spPageContextInfo.webAbsoluteUrl = http://nti-it-d-sp-01:5555/sites/Finance/ExpenseClaimSystem
GetUserProfileProperties();

BindAccountHeads();
/*if($("#cars").is(":visible")) {
alert(document.getElementById("cars").value);
}
else
{
alert("hidden")
} */
//copy paste disable in WBS
$('#txtWBSCode').bind('copy paste cut',function(e) { 
 e.preventDefault(); //disable cut,copy,paste
 bootbox.alert('Cut,Copy & Paste options are disabled on WBS Code');
 });

//Amount
        //called when key is pressed in textbox
        $('#txtClaimedAmount').keypress(function (e) {
            //if the letter is not digit then display error and don't type anything
            if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                //display error message
                $(".errmsg").html("Digits Only").show().fadeOut("slow");
                return false;
            }
        });
        $('#txtClaimedAmount').bind("paste", function (e) {
            e.preventDefault();
        });
        $('#txtClaimedAmount').bind('mouseenter', function (e) {
            var val = $(this).val();
            if (val != '0') {
                val = val.replace(/[^0-9]+/g, "")
                $(this).val(val);
            }
        });
        
        //txtPhoneNo
        //called when key is pressed in textbox
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

function updateList() {

    var input = document.getElementById('file');
   // alert(input)
    var output = document.getElementById('fileList');
    var children = "";
    for (var i = 0; i < input.files.length; ++i) {
        children += '<li>' + input.files.item(i).name + '</li>';
    }
    output.innerHTML = '<ul>'+children+'</ul>';
}

$(".wbsClass").keyup(function (e) {
    var value = $(".wbsClass").val();
  
    if (value.length == 5) {
        $(".wbsClass").val(value + "-")
    }
    if (value.length == 12) {
        $(".wbsClass").val(value + "-")
    }
});


});

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


function checkAH() {
  var AccountHead = document.getElementById("ddlAccountHeads").value;
  if(AccountHead.toLowerCase() == "tool cost" || AccountHead.toLowerCase() == "visa fees")
  {
	document.getElementById("txtWBSCode").readOnly = false;
	document.getElementById("txtWBSCode").style.background = "#FFFFFF";
  }
  else
  {
  	$('#displayerrorwbs').remove();
  	document.getElementById("txtWBSCode").readOnly = true;
	document.getElementById("txtWBSCode").style.background = "#DCDCDC";
  }
}

function GetUserProfileProperties(){
debugger;
var fieldsNotUpdated;
var eA11;
	$.ajax({
		url: _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties",
		async: false,
		headers: { Accept: "application/json;odata=verbose" },
		success: function (data) {
			try{
				var properties = data.d.UserProfileProperties.results;
				userEmail =  data.d.Email;
				if(userEmail == ""){
				bootbox.alert("Error while fetching User Email. Kindly raise an incident at NECTI IT Helpdesk (NECTIIThelpdesk@india.nec.com).", function(){ 
window.location.href = "/sites/Finance/ExpenseClaimSystem/";});	
				}
				else{
					for (var i = 0; i < properties.length; i++) {
						var property = properties[i];
						
						//Employee Code
                        if (property.Key == "Employeeid") {
                        	userCode = property.Value; 	
                        }
                        
                        //Employee Name
                        if (property.Key == "PreferredName") {
	                        userName = property.Value; 
                        }
                        
                        //Department
                         if (property.Key == "Department") {
                            $('#txtDepartment').val(property.Value);   
                       }
                       
                       //Phone No
                         if (property.Key == "MobileNo") {
                            $('#txtPhoneNo').val(property.Value);
                       }
                       
                       //Employee Band
                         if (property.Key == "EmployeeSubBand") {
                         	userBand = property.Value;
                       }
                       //Employee Band
                         if (property.Key == "EmployeeBand") {
                         	eA11 = property.Value;
                       }
                       
                       //Employee Unit
                       if (property.Key == "Unit") {
                       		userUnit = property.Value;
                       		
                       }
                       
                       //Employee Location
                        if (property.Key == "L") {
                            userLocation = property.Value;
                       }
                       
                       //ExtensionAutoApproved
                       if (property.Key == "ExtensionAutoApproved") {
                           autoApprove = property.Value; 
                       }
                       
                       //Manager
                       if (property.Key == "Manager") {
                           managerAccountName = property.Value;
                       } 
                       
                       //BUheadName
                       if (property.Key == "BUheadName") {
                           userBUHead = property.Value;
                       }
                       
                       //BUHeadEmail
                       if (property.Key == "BUHeadEmail") {
                           userBUHeadEmail = property.Value;
                       }
                       //userCostCenter 
                       if (property.Key == "CostCenter") {
                           userCostCenter = property.Value;
                           
                           //getL3L4Approvers(userCostCenter);
                       }
					}//end of for
					}//end of Email not blank else

//check for location and if other than noida then unit = location					
/*if(userLocation != "" && userLocation.toLowerCase() == "noida")
{}
else{
userBand =eA11;
userUnit = userLocation;
}*/

if(userBand == "NA"){
userBand =eA11;
}

userLocation = "Noida";
userCostCenter = "8VACMG31";

if(userCode == "" || userName == "" || userBand == "" || userUnit == "" || userLocation == "" || managerAccountName == "" || userBUHead == "" || userBUHeadEmail == "" || userCostCenter == ""){
	bootbox.alert("User Profile not updated. Kindly raise an incident at NECTI IT Helpdesk (NECTIIThelpdesk@india.nec.com).", function(){ 
	window.location.href = "/sites/Finance/ExpenseClaimSystem/";});
}
else{
	$('#txtEmployeeCode').val(userCode);
	$('#txtEmployeeName').val(userName);
	$('#txtEmployeeBand').val(userBand); 
	$('#txtEmployeeUnit').val(userUnit); 
	$('#txtCostCenter').val(userCostCenter); 
	
	if(userBand.toLowerCase() == "contract" || userBand.toLowerCase() == "retainer" || userBand.toLowerCase() == "trainee" || userBand.toLowerCase() == 	"staff augmentation" || userBand.charAt(0) == "L")
	{
		bootbox.alert("You cannot raise Claims.", function(){ 
		window.location.href = "/sites/Finance/ExpenseClaimSystem/";});
	}
	else if(typeof autoApprove == "undefined" || autoApprove == "" || autoApprove == null)
	{
		getManagerDetails(managerAccountName);
	}
	else if(autoApprove.toLowerCase() == "autoapprove" || userBand == "EX" || userBand == "M 15")
	{
		userManager = "NA";
		$('#txtApproverName').val(userManager);
		userManagerEmail = "NA";
		$('#txtApproverEmail').val(userManagerEmail);
		userBUHead = "NA";
		userBUHeadEmail = "NA";
		//getApprover3And4(userUnit);
		getL3L4Approvers(userCostCenter)
	}
	else
	{
		getManagerDetails(managerAccountName);
	}
}// end of else(user details blank)
			
			}//end of try
			catch{
			}
		},  //end of success
		error: function (jQxhr, errorCode, errorThrown) {  
		bootbox.alert("Some Error Occured in fetching User Profile. Kindly raise an incident at NECTI IT Helpdesk (NECTIIThelpdesk@india.nec.com).", function(){ 
   window.location.href = "/sites/Finance/ExpenseClaimSystem/";
}); 
		}//end of error
	});//end of ajax
}

function getL3L4Approvers(userCostCenter)
{
var requestURL = _spPageContextInfo.webAbsoluteUrl +  "/_api/Web/Lists/GetByTitle('CostCentreMapping')/Items?$filter=Title eq '"+userCostCenter+"'";

$.ajax({
        url: requestURL ,
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function (data) {
        debugger;
             numofItems = data.d.results.length;
             
             if(numofItems == 1)
             {
                	if(data.d.results[0].SubmissionVerification != null)
	             	{
	             	//L3Approver = data.d.results[0].SubmissionVerification ;	
	             	L3Approver = "Submission And Verification";
	             	}
	             	
	             	if(data.d.results[0].SubmissionVerificationEmail != null)
	             	{
	             	L3ApproverEmail = data.d.results[0].SubmissionVerificationEmail;	
	             	}
	             	
	             	if(data.d.results[0].Authorization != null)
	             	{
	             	//L4Approver = data.d.results[0].Authorization ;	
	             	L4Approver = "Authorization";
	             	}
	             	
	             	if(data.d.results[0].AuthorizationEmail != null)
	             	{
	             	L4ApproverEmail = data.d.results[0].AuthorizationEmail ;	
	             	}
	             //	alert(L3Approver +"    "+ L3ApproverEmail + "    "+  L4Approver +"     "+L4ApproverEmail )
	             if(L3Approver != "" && L3ApproverEmail != "" && L4Approver != "" && L4ApproverEmail != "")
	             {
	             	GetBankDetails(userEmail);
	             }
	             else
	             {
	             	bootbox.alert("Error while fetching finance approvers. Kindly raise an incident at NECTI IT Helpdesk (NECTIIThelpdesk@india.nec.com).", function(){ 
   window.location.href = "/sites/Finance/ExpenseClaimSystem/";
});
	             }
		}//end of 1 check
else{
bootbox.alert("Error while fetching finance approvers. Kindly raise an incident at NECTI IT Helpdesk (NECTIIThelpdesk@india.nec.com).", function(){ 
   window.location.href = "/sites/Finance/ExpenseClaimSystem/";
});}
 
        },//end of success
        error: function (error) {
            bootbox.alert("Error while fetching finance approvers. Kindly raise an incident at NECTI IT Helpdesk (NECTIIThelpdesk@india.nec.com).", function(){ 
   window.location.href = "/sites/Finance/ExpenseClaimSystem/";
});        }//end of error
    });//end of ajax

}

function getApprover3And4(userUnit)
{
debugger;
var requestURL = _spPageContextInfo.webAbsoluteUrl +  "/_api/Web/Lists/GetByTitle('ConfiguredItems')/Items?$filter=Location eq '"+userUnit+"'";

$.ajax({
        url: requestURL ,
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function (data) {
        debugger;
             numofItems = data.d.results.length;
             
             if(numofItems == 2)
             {
                for(var i =0;i<numofItems;i++)
             {
             	if(data.d.results[i].Name == null || data.d.results[i].Name == ""
	              ||data.d.results[i].Email == null || data.d.results[i].Email == ""
	              ||data.d.results[i].AttributeName == null || data.d.results[i].AttributeName == "")
	             {
	             	//bootbox.alert("Error while fetching approver details. Kindly raise a ticket at NECTI IT Helpdesk.");
	             }
	             else
	             {
	             	if(data.d.results[i].AttributeName == "FL1")
	             	{
	             	L3Approver = data.d.results[i].Name;
					L3ApproverEmail = data.d.results[i].Email;
	             	}
	             	
	             	if(data.d.results[i].AttributeName == "FL2")
	             	{
	             	L4Approver = data.d.results[i].Name;
					L4ApproverEmail = data.d.results[i].Email;
	             	}
	             }//end of else
	             
             }//end of for
             GetBankDetails(userEmail);
}//end of 2 check
else{
bootbox.alert("Error while fetching finance approvers. Kindly raise an incident at NECTI IT Helpdesk (NECTIIThelpdesk@india.nec.com).", function(){ 
   window.location.href = "/sites/Finance/ExpenseClaimSystem/";
});}
 
        },//end of success
        error: function (error) {
            bootbox.alert(JSON.stringify(error)+"checkUserEntryInList");
        }//end of error
    });//end of ajax

}

function getCEODetails(userLocation)
{
//alert("Location"+userLocation)
debugger;
var requestURL = _spPageContextInfo.webAbsoluteUrl +  "/_api/Web/Lists/GetByTitle('ConfiguredItems')/Items?$filter=Location eq '"+userLocation+"'";

$.ajax({
        url: requestURL ,
        type: "GET",
        async:false,
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function (data) {
        debugger;
             numofItems = data.d.results.length;
             
             if(numofItems == 1)
             {
             	CEO = data.d.results[0].Name;
             	CEOEmail =  data.d.results[0].Email;	
             }//end of 1 check
else{
bootbox.alert("Error while fetching L2 approver. Kindly raise an incident at NECTI IT Helpdesk (NECTIIThelpdesk@india.nec.com).", function(){ 
   window.location.href = "/sites/Finance/ExpenseClaimSystem/";
});
}
        },//end of success
        error: function (error) {
            bootbox.alert(JSON.stringify(error)+"checkUserEntryInList");
        }//end of error
    });//end of ajax

}


function getManagerDetails(managerAccountName)
{
debugger;
var requestedURL = _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v=%27"+managerAccountName+"%27";
var managerBand; 
var managerManager; 
var ManagerLocation;
var eA11;
var eA2;
var MgrmanagerBand;
$.ajax({
		url:requestedURL ,
		async: false,
		headers: { Accept: "application/json;odata=verbose" },
		success: function (data) {
			try{
				var properties = data.d.UserProfileProperties.results;
				userManagerEmail =  data.d.Email;
				if(userManagerEmail == ""){
					bootbox.alert("Error while fetching Manager Details. Kindly raise an incident at NECTI IT Helpdesk (NECTIIThelpdesk@india.nec.com).");
				}
				else{
					for (var i = 0; i < properties.length; i++) {
						var property = properties[i];                   
                       //Employee Band
                         if (property.Key == "EmployeeSubBand") {
                         	eA2 = property.Value;
                       }
                       
                        if (property.Key == "EmployeeBand") {
                         	eA11 = property.Value;
                       }

                                              
                       //Manager
                       if (property.Key == "Manager") {
                           managerManager= property.Value;
                       }
                       
                       //Name
                        if (property.Key == "PreferredName") {
	                        userManager = property.Value; 
                        }
                        if (property.Key == "L") {  
                            ManagerLocation= property.Value;  
                        }
					}//end of for
					
					if(eA11.toLowerCase() == "contract" || eA11.toLowerCase() == "retainer" || eA11.toLowerCase() == "trainee" || eA11.toLowerCase() == 	"staff augmentation" || eA11.charAt(0) == "L")
					{
						getManagerDetails(managerManager);
					}
					else if(eA2 == "NA")
					{
						managerBand = eA11;
						MgrmanagerBand = GetBandMapping(managerBand);
					}
					else
					{
						MgrmanagerBand = eA2;
					}
					

 					/*if(ManagerLocation.toLowerCase() == "noida")
					{
					MgrmanagerBand = eA2;
					}
					else
					{
					managerBand = eA11;
					MgrmanagerBand = GetBandMapping(managerBand);
					}*/
					
					
					if(MgrmanagerBand.charAt(0) == "E" && MgrmanagerBand.split('E')[1] == "X")
					{
						$('#txtApproverName').val(userManager);
						$('#txtApproverEmail').val(userManagerEmail);
						//getApprover3And4(userUnit)
						getL3L4Approvers(userCostCenter);
					}
					else if(MgrmanagerBand.charAt(0) == "E" && MgrmanagerBand.split('E')[1] > 4.0)
					{
						$('#txtApproverName').val(userManager);
						$('#txtApproverEmail').val(userManagerEmail);
						//getApprover3And4(userUnit)
						getL3L4Approvers(userCostCenter);
					}
					else
					{
					getManagerDetails(managerManager);
					}	
				
				}//end of Manager Email not blank else

			}//end of try
			catch{
			}
		},  //end of success
		error: function (jQxhr, errorCode, errorThrown) {  
		bootbox.alert("Error while fetching L1 approver. Kindly raise an incident at NECTI IT Helpdesk (NECTIIThelpdesk@india.nec.com).", function(){ 
   window.location.href = "/sites/Finance/ExpenseClaimSystem/";
});
		}//end of error
	});//end of ajax

}

function GetBandMapping(otherlocationuserband)
{
	debugger;
	var strcomparedBandofotherlocation="";
	//window.location.host
	var urlbandMapping= "http://nti-it-d-sp-01:5555/_api/web/lists/getByTitle('BandMapping')/items?$select=NoidaBand,OtherLocationBand&$filter=OtherLocationBand eq '"+otherlocationuserband+"' ";
	
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
	debugger;
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

function GetBankDetails(userEmail)
{
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
	             //BankName::ddlBankName
	             if(data.d.results[0].BankName == null || data.d.results[0].BankName == "Please Select"
	              || data.d.results[0].AccountNo == null || data.d.results[0].AccountNo == ""
	              ||data.d.results[0].IFSC == null || data.d.results[0].IFSC == "")
	             {
             					bootbox.alert("Kindly enter bank details first.", function(){ 
   window.location.href = "/sites/Finance/ExpenseClaimSystem/SitePages/BankDetails.aspx";
 
});

	             }
	             else
	             {
	             	$('#txtBankName').val(data.d.results[0].BankName);	 
					$('#txtAccountNo').val(data.d.results[0].AccountNo);
					$('#txtIFSC').val(data.d.results[0].IFSC);
					
	             }//end of bank name else
             }//end of num of items ==1 
             else if(numofItems == 0)
             {
				bootbox.alert("Kindly enter bank details first.", function(){ 
   window.location.href = "/sites/Finance/ExpenseClaimSystem/SitePages/BankDetails.aspx";
 
});
             }//end of num of items == 0
             else
             {
	             bootbox.alert("Multiple records found. Kinldy contact BA Team", function(){ 
   window.location.href = "/sites/Finance/ExpenseClaimSystem/";
 
});
            }//end of else
        },//end of success
        error: function (error) {
            bootbox.alert("Error while fetching Bank Details. Kindly raise an incident at NECTI IT Helpdesk (NECTIIThelpdesk@india.nec.com).", function(){ 
   window.location.href = "/sites/Finance/ExpenseClaimSystem/";
});
        }//end of error
    });//end of ajax
}

function BindAccountHeads()
{
 $.ajax({ 
	  url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('AccountHeadList')/items?$Select=Title&$orderby=Title",
	  	 type: "get",
	 headers: {"Accept": "application/json;odata=verbose"},
	 success: function (data) {
	 var values = [];
	 var uniqueValues = [];
	 var option = "";
	 var valuesArray = data.d.results; 
		 $.each(valuesArray ,function(i,result){
	 values.push(result.Title);
	  
	 }); 
	 $.each(values, function(i, el){
	 if($.inArray(el, uniqueValues) === -1) {
	 uniqueValues.push(el); 
	 option += "<option value='"+el+"'>"+el+"</option>"; 
	 }
	 });
	 $("#ddlAccountHeads").append(option); 
	 },
	 error: function (data) {
	 bootbox.alert("Error while binding Account head dropdown. Kindly raise an incident at NECTI IT Helpdesk (NECTIIThelpdesk@india.nec.com).", function(){ 
   window.location.href = "/sites/Finance/ExpenseClaimSystem/";
});
	 }
	 });
}

 function CommentsMaxLength(text, maxLength) {
        var diff = maxLength - text.value.length;
        if (diff < 0) {
            text.value = text.value.substring(0, maxLength);
            diff = 0;
        }
        document.getElementById('particularsremarks').innerText =
						"Characters left (" + diff + ")";
    }
    
     function OverallCommentsMaxLength(text, maxLength) {
        var diff = maxLength - text.value.length;
        if (diff < 0) {
            text.value = text.value.substring(0, maxLength);
            diff = 0;
        }
        document.getElementById('overallremarks').innerText =
						"Characters left (" + diff + ")";
    }
    
function fileValidation() { 
            var fileInput =  
                document.getElementById('claimAttach'); 
              
            var filePath = fileInput.value; 
          
            // Allowing file type 
            var allowedExtensions =  
                    /(\.jpg|\.jpeg|\.png|\.doc|\.docx|\.csv|\.xls|\.xlsx|\.pdf|\.ppt|\.pptx)$/i; 
              
            if (!allowedExtensions.exec(filePath)) { 
                bootbox.alert('Invalid file type. Enter file with extensions(.jpg, .jpeg, .png, .doc, .docx, .csv, .xls, .xlsx, .pdf, .ppt, .pptx)'); 
                fileInput.value = ''; 
                return false; 
            }  
            else  
            { 
              
                // Image preview 
                if (fileInput.files && fileInput.files[0]) { 
                const fi = document.getElementById('claimAttach');
                const fsize = fi.files[0].size;
                const fileSize = Math.round((fsize / 1024));
                
                  if (fileSize >= 1024) { 
                  fileInput.value = ''; 
                    bootbox.alert("Please select a file less than 1 MB"); 
                } 
                else if (fileSize == 0) { 
                  fileInput.value = ''; 
                    bootbox.alert("Empty file cannot be uploaded."); 
                } 
                } 
            } 
        } 


function Add()
{
debugger;

var table = document.getElementById("tbAccountHead");
var rows = table.getElementsByTagName("tr");
if(rows.length-2 < 4)
{
var isValid = true;
//account Head
accountHead = $('#ddlAccountHeads').val();
WBS="NA";
$('#displayerroraccounthead').remove();
$('#displayerrorwbs').remove();
if (accountHead  == "Please Select") {
isValid = false;
$('#accountHeadDiv').after('<div id = "displayerroraccounthead" class="error">Please select Account Head</div>');

}
else if(accountHead.toLowerCase() == "tool cost" || accountHead.toLowerCase() == "visa fees")
{
		//check WBS
		WBS = $('#txtWBSCode').val();
		if(WBS == "")
		{
			
			isValid = false;
			$('#WBSDiv').after('<div id = "displayerrorwbs" class="error">Please enter WBS Code.</div>');
		}
		else if(WBS.trim().length != 18)
		{
		isValid = false;
			$('#WBSDiv').after('<div id = "displayerrorwbs" class="error">Please enter valid 16 digit WBS Code.</div>');
		}
		else
		{}
}
else if(accountHead.toLowerCase() == "business promotion")
{
	var table = document.getElementById("tbAccountHead");
	var rows = table.getElementsByTagName("tr");
	if(rows.length-2 > 0 && businessPromotion == true)
	{
	$('#accountHeadDiv').after('<div id = "displayerroraccounthead" class="error">Business Promotion can be added only once per claim.</div>');
	isValid = false;
	}
}

//particulars
particulars = $('#txtParticulars').val();
$('#displayerrorparticulars').remove();
if (particulars.trim() == "") {
document.getElementById('particularsremarks').innerText = "";
$('#particularsDiv').after('<div id = "displayerrorparticulars" class="error">Please enter particulars.</div>');
isValid = false;
}
else
{

	if (particulars.trim().length > 200) {
	$('#particularsDiv').after('<div id = "displayerrorparticulars" class="error">Enter up to 200 characters only.</div>');
	isValid = false;
	}
	else
	{}
}

//from Date
fromDate = $('#txtFromDate').val();
$('#displayerrorfromDate').remove();
if (fromDate.trim() == "") {
$('#fromDateDiv input').after('<div id = "displayerrorfromDate" class="error">Please enter from date.</div>');
isValid = false;
}
else
{
}

//to Date
toDate = $('#txtToDate').val();
$('#displayerrortoDate').remove();
if (toDate.trim() == "") {
$('#toDateDiv input').after('<div id = "displayerrortoDate" class="error">Please enter to date.</div>');
isValid = false;
}
else
{
}


//claimed amount
claimedAmount = $('#txtClaimedAmount').val();
$('#displayerrorclaimedamount').remove();
if (claimedAmount == "") {
$('#claimedAmountDiv').after('<div id = "displayerrorclaimedamount" class="error">Please enter Claimed Amount.</div>');
isValid = false;
}
else
{
if(parseInt(claimedAmount) == 0)
{
$('#claimedAmountDiv').after('<div id = "displayerrorclaimedamount" class="error">Claimed Amount cannot be zero.</div>');
isValid = false;
}
else{}
}

$('#displayerrorclaimAttachment').remove();
if (document.getElementById("claimAttach").files.length === 0) {
$('#attachmentDiv').after('<div id = "displayerrorclaimAttachment" class="error">Please attach supporting document.</div>');
isValid = false;
}
else
{
var fileInput = document.getElementById('claimAttach'); 
              
            var filePath = fileInput.value; 
          
            // Allowing file type 
            var allowedExtensions =  
                    /(\.jpg|\.jpeg|\.png|\.doc|\.docx|\.csv|\.xls|\.xlsx|\.pdf|\.ppt|\.pptx)$/i; 
              
            if (!allowedExtensions.exec(filePath)) { 
                fileInput.value = '';  
                $('#attachmentDiv').after('<div id = "displayerrorclaimAttachment" class="error">Invalid file type.</div>');
isValid = false;

            }  
            else  
            { 
              
                // Image preview 
                if (fileInput.files && fileInput.files[0]) { 
                const fi = document.getElementById('claimAttach');
                const fsize = fi.files[0].size;
                const fileSize = Math.round((fsize / 1024));
                
                  if (fileSize >= 1024) { 
                    fileInput.value = '';  
                $('#attachmentDiv').after('<div id = "displayerrorclaimAttachment" class="error">File size should be less than 1 MB.</div>');
isValid = false;                } 
			else if(fileSize == 0)
                {
                isValid = false;  
                 $('#attachmentDiv').after('<div id = "displayerrorclaimAttachment" class="error">File size should be less than 1 MB.</div>'); 
                //bootbox.alert("Empty file cannot be uploaded."); 
                }

                } 
            }
}


if(isValid == true)
{
var d = new Date();
var month = parseInt(d.getMonth())+1;
var todayDate = month +"/"+d.getDate()+"/"+d.getFullYear();
var date1 = new Date(todayDate);
var date2 = new Date(fromDate);
var date3 = new Date(toDate);

if(date3 >= date2)
{
if(accountHead.toLowerCase() == "business promotion")
{
businessPromotion = true;
document.getElementById("businessPromotionDiv").style.display = "block";
$('#txtTotalBusinessExpense').val(claimedAmount);
document.getElementById("txtTotalBusinessExpense").style.background = "#DCDCDC";
}

var res = Math.abs(date1 - date2) / 1000;
var days = Math.floor(res / 86400);

if(days  > 90) 
{
bootbox.alert("Since, the actual Expense Date is before 90 days, the claim will go to BU Head for approval.");
//AddRow(accountHead,particulars,claimedAmount,fromDate ,toDate, WBS);
AddAccountHeadToList(accountHead,particulars,claimedAmount,fromDate ,toDate, WBS,todayDate);
}
else if(accountHead.toLowerCase() == "business promotion" && claimedAmount > 100000)
{
bootbox.alert("Pre-Approval from CEO date is required as the claimed amount is greater than INR 1,00,000");
document.getElementById("rbtnPreApproval").checked = true;
document.getElementById("rbtnPostApproval").disabled = true;
//AddRow(accountHead,particulars,claimedAmount,fromDate ,toDate, WBS);
AddAccountHeadToList(accountHead,particulars,claimedAmount,fromDate ,toDate, WBS,todayDate);
}
else if(accountHead.toLowerCase() == "business promotion" && claimedAmount > 10000)
{
bootbox.alert("Pre-Approval from BU Head date is required as the claimed amount is greater than INR 10,000");
//AddRow(accountHead,particulars,claimedAmount,fromDate ,toDate, WBS);
document.getElementById("rbtnPreApproval").checked = true;
document.getElementById("rbtnPostApproval").disabled = true;

AddAccountHeadToList(accountHead,particulars,claimedAmount,fromDate ,toDate, WBS,todayDate);
}
else
{
//AddRow(accountHead,particulars,claimedAmount,fromDate ,toDate, WBS);
AddAccountHeadToList(accountHead,particulars,claimedAmount,fromDate ,toDate, WBS,todayDate);
}

}
else
{
$('#fromDateDiv input').after('<div id = "displayerrorfromDate" class="error">From date should be less than To date.</div>');
}
}
}//end of 4 check
else
{
bootbox.alert("You cannot add more than 4 account heads in a claim");
}
}

function AddAccountHeadToList(accountHead,particulars,claimedAmount,fromDate ,toDate, WBS,todayDate)
{
var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaimDetails')/items";

var item = {
                  "__metadata": {
                      "type": "SP.Data.OtherExpenseClaimDetailsListItem"
                  },
 "AccountHead": accountHead, 
 "Particulars": particulars, 
 "ClaimedAmount": claimedAmount, 
 "WBSCode": WBS, 
 "FromDate": fromDate,
 "ToDate": toDate,
 "Status":"Saved",
 "EmployeeCode": $('#txtEmployeeCode').val(),
 "ClaimDate": todayDate,               
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
                  var fileArray = [];
                  var filename = "";
 				if (document.getElementById("claimAttach").files.length === 0) { }
                                   else{
                              //     var itemId =  data.d.ID;  
                var fileInput = $('#claimAttach');
                var fileCount = fileInput[0].files.length;  
		                for(var i=0;i<fileCount;i++)
		                {
		                	
		                    fileArray.push(fileInput[0].files[0]);
		                    uploadFileSP("OtherExpenseClaimDetails", itemId , fileArray, fileCount);
		                    AddRow(itemId +"_"+accountHead,particulars,claimedAmount,fromDate ,toDate, WBS,fileArray[0].name);
		                }                   
                    } 
                    
                  },
                  error: function(err) {
                  bootbox.alert("Error Occured while submitting."+err)
                  }
              });

}

function AddRow(accountHead,particulars,claimedAmount,fromDate ,toDate, WBS,fileName) {
            //Get the reference of the Table's TBODY element.
            var tBody = $("#tbAccountHead > TBODY")[0];
 
            //Add Row.
            row = tBody.insertRow(-1);
 
            //Add account head cell.
            var cell = $(row.insertCell(-1));
            cell.html(accountHead);
 
            //Add particulars cell.
            cell = $(row.insertCell(-1));
            cell.html(particulars);
            
            //Add amount cell.
            var cell = $(row.insertCell(-1));
            cell.html(claimedAmount);
             			
             			//Add from date
 			cell = $(row.insertCell(-1));
            cell.html(fromDate);
            
            //Add to date
 			cell = $(row.insertCell(-1));
            cell.html(toDate);
            
            //Add attachment cell.
            cell = $(row.insertCell(-1));
            var attachment = $("<i class='fa fa-file-text downloadFiles' style='font-size:22px;'></i>");
            //attachment.attr("class", "downloadFiles")
            cell.html(attachment);

            //Add WBS cell.
            cell = $(row.insertCell(-1));
            cell.html(WBS);

			 totalClaimedINR = 0;
 			totalClaimedINR  = parseInt(document.getElementById('txtTotalClaimedINR').innerHTML) + parseInt(claimedAmount);
 			document.getElementById('txtTotalClaimedINR').innerHTML = totalClaimedINR;
            //Add Button cell.
            cell = $(row.insertCell(-1));
			var btnRemove = $("<i class='fa fa-trash' style='font-size:22px' id='btnRemoved'></i>");
           // btnRemove.attr("type", "button");
            btnRemove.attr("onclick", "Remove(this);")
            btnRemove.val("Remove");
            cell.append(btnRemove);
            
            debugger;
            $('#ddlAccountHeads').val("Please Select");
            $('#txtParticulars').val("");
            document.getElementById('particularsremarks').innerText = "";
            $('#txtClaimedAmount').val("");
            $('#txtWBSCode').val("");
            $('#txtFromDate').val("");            
            $('#txtToDate').val("");
           
			 $('[id*=txtFromDate]').datepicker({
            changeMonth: true,
            changeYear: true,
            format: "m/d/yyyy",
            defaultDate: 0,  
            autoclose: true
        });

$('[id*=txtToDate]').datepicker({
            changeMonth: true,
            changeYear: true,
            format: "m/d/yyyy",
            autoclose: true
        });

            $('#claimAttach').val("");
}


$(document).on('click','.downloadFiles',function(){
						//$("#fileAttached").html('');
						var currentURL = window.location.href;
						var $row = $(this).closest("tr");    // Find the row
                		debugger;				    
						ID = $row.find("td:nth-child(1)").text().split('_')[0];
						var name = attachementFetch(ID);
						var attachmentFiles = "";
						attachmentFiles += '<ol type="1">';
						for(var i=0; i<name.length; i++){
							attachmentFiles += '<li><a href="' + name[i].ServerRelativeUrl  + '">'+ name[i].FileName + '</a></li>';
							//attachmentFiles += '<br>';
						}
						attachmentFiles += '</ol>';

					//	$("#fileAttached").append(attachmentFiles);
						//alert(attachmentFiles)
						    
    bootbox.alert(""+attachmentFiles+"", function(){ 
    				//window.location.href = "/sites/Finance/ExpenseClaimSystem/SitePages/MyClaims.aspx";
				});
						//$("#myModal").toggle();
                	})	
                	
function attachementFetch(id) {
              var image = [];
			var call = $.ajax({
			        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaimDetails')/items(" + id + ")/AttachmentFiles",
			        type: "GET",
			        dataType: "json",
					async: false,
			        headers: {
						"accept": "application/json; odata=verbose"
			        },
			    });
			
			    call.done(function (data,textStatus, jqXHR){
					debugger;
					if(data.d.results.length != 0){
						var imageItems = data.d.results;
			                    if (data.d.results.length != 0) {
			                        image = imageItems;
			                    } else {
			                        image = "";
			                    }
			
			        }
			    });
			        
			        call.fail(function (jqXHR,textStatus,errorThrown){
			            //alert("Error retrieving Tasks: " + jqXHR.responseText);
			        });
						return image;

        }


function Remove(button) {
            //Determine the reference of the Row using the Button.
            var row = $(button).closest("TR");
            var name = $("TD", row).eq(0).html().split('_')[1];
            var amountRemoved = $("TD", row).eq(2).html();
            var itemID = $("TD", row).eq(0).html().split('_')[0];
            if (confirm("Do you want to delete: " + name)) {
            
            document.getElementById("btnRemoved").display = "none";
 					if(name.toLowerCase() == "business promotion")
 					{
 					businessPromotion = false;
 					document.getElementById("businessPromotionDiv").style.display = "none";
 					}
 					
 					$.ajax({  
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaimDetails')/items(" + itemID + ")",  
            type: "POST",  
            contentType: "application/json;odata=verbose",  
            headers: {  
                "Accept": "application/json;odata=verbose",  
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),  
                "IF-MATCH": "*",  
                "X-HTTP-Method": "DELETE",  
            },  
            success: function(data) {  
           	
                //Get the reference of the Table.
                var table = $("#tbAccountHead")[0];
 
                //Delete the Table row using it's Index.
                table.deleteRow(row[0].rowIndex);
                var totalClaimedINR  =parseInt(document.getElementById('txtTotalClaimedINR').innerHTML);
                totalClaimedINR  = totalClaimedINR - parseInt(amountRemoved);
				document.getElementById('txtTotalClaimedINR').innerHTML = totalClaimedINR;
            
                          },  
            error: function(data) {  
                alert("failed");  
            }  
        });

 				
            }
}

function AddBP()
{
debugger;
var isValidBP = true;
document.getElementById('BPError').style.display = "none";
name = $('#txtName').val();
$('#displayerrorname').remove();
if(name.trim() == "")
{			
isValidBP = false;
$('#nameDiv input').after('<div id = "displayerrorname" class="error">Please enter Name.</div>');
}

IntEx= $('#ddlIntEx').val();
$('#displayerrorIntEx').remove();
if (IntEx == "Please Select") {
isValidBP = false;
$('#IntExDiv select').after('<div id = "displayerrorIntEx" class="error">Please select Interal/ External.</div>');
}

companyName = $('#txtCompanyName').val();
$('#displayerrorcompanyName').remove();
if(companyName.trim() == "")
{			
isValidBP = false;
$('#CompanyNameDiv input').after('<div id = "displayerrorcompanyName" class="error">Please enter Company Name.</div>');
}

designation = $('#txtDesignation').val();
$('#displayerrordesignation').remove();
if(designation.trim() == "")
{			
isValidBP = false;
$('#DesignationDiv input').after('<div id = "displayerrordesignation" class="error">Please enter Designation.</div>');
}

if(isValidBP == true)
{
AddBPRow(name ,IntEx,companyName ,designation );
}
}

function AddBPRow(name ,IntEx,companyName ,designation) {
            //Get the reference of the Table's TBODY element.
            var tBody = $("#tbBusinessPromotion> TBODY")[0];
 
            //Add Row.
            row = tBody.insertRow(-1);
 
            //Add name cell.
            var cell = $(row.insertCell(-1));
            cell.html(name);
 
            //Add IntExcell.
            cell = $(row.insertCell(-1));
            cell.html(IntEx);
            
            //Add companyNamecell.
            var cell = $(row.insertCell(-1));
            cell.html(companyName);
 			
            //Add designation cell.
            cell = $(row.insertCell(-1));
            cell.html(designation);

 
            //Add Button cell.
            cell = $(row.insertCell(-1));
            var btnRemoveBP = $("<i class='fa fa-trash' style='font-size:22px'></i>");
            //btnRemoveBP.attr("type", "button");
            btnRemoveBP.attr("onclick", "RemoveBP(this);");
            btnRemoveBP.val("Remove");
            cell.append(btnRemoveBP);
            
            $('#ddlIntEx').val("Please Select");
            $('#txtName').val("");
            $('#txtCompanyName').val("");
            $('#txtDesignation').val("");
}

function RemoveBP(button) {
            //Determine the reference of the Row using the Button.
            var row = $(button).closest("TR");
            var name = $("TD", row).eq(0).html();
            var amountRemoved = $("TD", row).eq(2).html();
            
            if (confirm("Do you want to delete: " + name)) {
 					if(name.toLowerCase() == "business promotion")
 					{
 					businessPromotion = false;
 					document.getElementById("businessPromotionDiv").style.display = "none";
 					}
                //Get the reference of the Table.
                var table = $("#tbBusinessPromotion")[0];
 
                //Delete the Table row using it's Index.
                table.deleteRow(row[0].rowIndex);
                            }
}



function Submit()
{
debugger;
        document.getElementById("btnSubmit").disabled = true;
		var totalRowCount = 0;
        var rowCount = 0;
        var table = document.getElementById("tbAccountHead");
        var rows = table.getElementsByTagName("tr")
        
        if(rows.length-2 == 0)
        {
         	document.getElementById("btnSubmit").disabled = false;
        	bootbox.alert("Kindly add atleast one Account Head to the claim");
        }
        else
        {
        	if(businessPromotion == true)
				{
						var table = document.getElementById("tbBusinessPromotion");
						var rows = table.getElementsByTagName("tr")
						if(rows.length-2 == 0)
						{
						document.getElementById("btnSubmit").disabled = false;
						document.getElementById('BPError').style.display = "block";
						document.getElementById('BPError').innerHTML = "Please enter all mandatory fields and add atleast one Name row.";
						return;
						}
						else
						{
							phone = $('#txtPhoneNo').val();
						$('#displayerrorphone').remove();
						if (phone.trim() == "") {
						document.getElementById("btnSubmit").disabled = false;
			                $('#phoneDiv input').after('<div id = "displayerrorphone" class="error">Please enter Phone Number</div>');
			            }
			            else if(parseInt(phone) == 0 || phone.length < 10)
			            {
			            document.getElementById("btnSubmit").disabled = false;
			            	$('#phoneDiv input').after('<div id = "displayerrorphone" class="error">Please enter valid Phone Number</div>');
			            }
			            else
			            {
						document.getElementById('BPError').style.display = "none";
						validateBusinessPromotionFields();
						}

						}
				}
				else
				{
						phone = $('#txtPhoneNo').val();
						$('#displayerrorphone').remove();
						if (phone.trim() == "") {
						document.getElementById("btnSubmit").disabled = false;
			                $('#phoneDiv input').after('<div id = "displayerrorphone" class="error">Please enter Phone Number</div>');
			            }
			            else if(parseInt(phone) == 0 || phone.length < 10)
			            {
			            document.getElementById("btnSubmit").disabled = false;
			            	$('#phoneDiv input').after('<div id = "displayerrorphone" class="error">Please enter valid Phone Number</div>');
			            }
			            else
			            {
					$(".modal1").show();
						setTimeout(function() {
					AddClaimToOtherExpenseClaimsList();
					 }, 100);
					 }
				}
        }
}

function validateBusinessPromotionFields()
{
debugger;
var isValid = true;
pre =document.getElementById("rbtnPreApproval").checked;
post = document.getElementById("rbtnPostApproval").checked;
var d = new Date();
var month = parseInt(d.getMonth())+1;
var todayDate = month +"/"+d.getDate()+"/"+d.getFullYear();


expenseDate = $('#txtBusinessExpenseDate').val();
$('#displayerrorexpenseDate').remove();
if (expenseDate == "") {
isValid = false;
$('#businessExpenseDateDiv input').after('<div id = "displayerrorexpenseDate" class="error">Please enter expense date.</div>');
}

approvalDate = $('#txtApprovalDate').val();
$('#displayerrorapprovalDate').remove();

if(pre == true)
{
	if (approvalDate == "") {
	isValid = false;
	$('#approvalDatediv input').after('<div id = "displayerrorapprovalDate" class="error">Please select approval date.</div>');
	}
	else
	{
	var date1 = new Date(expenseDate);
	var date2 = new Date(approvalDate);
	var date3 = new Date(todayDate);
		if(date2 < date3)
		{}
		else
		{
			isValid = false;
		$('#approvalDatediv input').after('<div id = "displayerrorapprovalDate" class="error">Approval date should be less than today Date.</div>');
		}
	}
}
else if(post == true)
{

}
else
{
isValid = false;
$('#approvalTypeDiv').after('<div id = "displayerrorapprovalDate" class="error">Please select Pre or Post approval.</div>');
}

BusinessExpenseNature = $('#ddlBusinessExpenseNature').val();
$('#displayerrorBusinessExpenseNature').remove();
if (BusinessExpenseNature == "Please Select") {
isValid = false;
$('#businessExpenseNatureDiv select').after('<div id = "displayerrorBusinessExpenseNature" class="error">Please select Expense Nature.</div>');
}

TotalBusinessExpense = $('#txtTotalBusinessExpense').val();
$('#displayerrorTotalBusinessExpense').remove();
if (TotalBusinessExpense == "") {
isValid = false;
$('#businessExpenseNatureDiv input').after('<div id = "displayerrorTotalBusinessExpense" class="error">Please enter Total Business Expense.</div>');
}

TotalBusinessExpense = $('#txtTotalBusinessExpense').val();
$('#displayerrorTotalBusinessExpense').remove();
if (TotalBusinessExpense == "") {
isValid = false;
$('#totalBusinessExpenseDiv input').after('<div id = "displayerrorTotalBusinessExpense" class="error">Please enter Total Business Expense.</div>');
}

MeetingPlace = $('#txtMeetingPlace').val();
$('#displayerrorMeetingPlace').remove();
if (MeetingPlace.trim() == "") {
isValid = false;
$('#meetingPlaceDiv input').after('<div id = "displayerrorMeetingPlace" class="error">Please enter Meeting Place.</div>');
}

MeetingTitle = $('#txtMeetingTitle').val();
$('#displayerrorMeetingTitle').remove();
if (MeetingTitle.trim() == "") {
isValid = false;
$('#meetingTitleDiv input').after('<div id = "displayerrorMeetingTitle" class="error">Please enter Meeting Title.</div>');
}

EventOutcomes = $('#txtEventOutcomes').val();
$('#displayerrorEventOutcomes').remove();
if (EventOutcomes.trim() == "") {
isValid = false;
$('#eventOutcomesDiv input').after('<div id = "displayerrorEventOutcomes" class="error">Please enter Event Outcomes.</div>');
}

if(isValid ==  true)
{
$(".modal1").show();
setTimeout(function() {
AddClaimToOtherExpenseClaimsList();
}, 100);
}
else
{
 document.getElementById("btnSubmit").disabled = false;
}


}

function AddClaimToOtherExpenseClaimsList()
{
debugger;
var d = new Date();
var month = parseInt(d.getMonth())+1;
var todayDate = month +"/"+d.getDate()+"/"+d.getFullYear();

var approverNames = $('#txtApproverName').val();
var approverEmails;
if(approverNames.toLowerCase()  == "na")
{
approverNames = "Submission And Verification";
approverEmails = "Submission And Verification";
}
else
{
	approverNames = $('#txtApproverName').val();
	approverEmails = $('#txtApproverEmail').val();

	var claimedINR = parseInt(document.getElementById('txtTotalClaimedINR').innerHTML);
	if(claimedINR == 0)
	{
		bootbox.alert("Claimed Amount cannot be zero.");
		return;
	}
	else if(claimedINR <= 1000)
	{
		L2Approver = "";
		L2ApproverEmail =  "";
	}
	else if(claimedINR > 10000 && claimedINR <=100000)
	{
		if($('#txtApproverEmail').val().toLowerCase() == userBUHeadEmail.toLowerCase()){
			L2Approver = "";
			L2ApproverEmail =  "";}
		else
		{
			L2Approver = userBUHead;
			L2ApproverEmail =  userBUHeadEmail;	
		}		
	}
	else if(claimedINR > 100000)
	{
		getCEODetails(userLocation)
		if($('#txtApproverEmail').val().toLowerCase() == CEOEmail.toLowerCase()){
			L2Approver = "";
			L2ApproverEmail =  "";}
		else
		{
			L2Approver = CEO;
			L2ApproverEmail =  CEOEmail;	
		}	
	}
	else
	{}
}
debugger;
var item = {
                  "__metadata": {
                      "type": "SP.Data.OtherExpenseClaimsListItem"
                  },
                  "EmpName": $('#txtEmployeeName').val(),
                  "EmpEmail": userEmail,
                  "EmpBand": $('#txtEmployeeBand').val(),
                  "EmpMobileNo": $('#txtPhoneNo').val(),
                  "EmpLocation": userLocation ,
                  "EmpBU":  $('#txtDepartment').val(),
                  "EmpUnit":  $('#txtEmployeeUnit').val(),
                  "EmpCode" : $('#txtEmployeeCode').val(),
                  "ManagerName":  $('#txtApproverName').val(),
                  "ManagerEmail":  $('#txtApproverEmail').val(),
                  "BUHeadName":  userBUHead,
                  "BUHeadEmail":  userBUHeadEmail,
 				  "BankName": $('#txtBankName').val(),
                  "AccountNumber":  $('#txtAccountNo').val(),
                  "IFSC": $('#txtIFSC').val(),
                  "CostCenter": $('#txtCostCenter').val(),
                  "PendingWith": approverNames,
                  "PendingWithEmail": approverEmails,
                  "Status": "Pending",
                  "TotalClaimedAmount": document.getElementById('txtTotalClaimedINR').innerHTML,
                  "L2Approver" :  L2Approver,                                                                                                                                                                                                                                                                                                                                                                                    
                  "L2ApproverEmail":L2ApproverEmail,
                  "L3Approver":L3Approver,
                  "L3ApproverEmail":L3ApproverEmail,
                  "L4Approver":L4Approver,
                  "L4ApproverMail" :L4ApproverEmail,
                  "AmountDisbursed":"No",
                  "ClaimDate":todayDate,
                  };    

              $.ajax({
                  url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaims')/items",
                  type: "POST",
                  async: false,
                  contentType: "application/json;odata=verbose",
                  data: JSON.stringify(item),
                  headers: {
                      "Accept": "application/json;odata=verbose",
                      "X-RequestDigest": $("#__REQUESTDIGEST").val()
                  },
                  success: function(data) {
                  debugger;
         			claimID = "CCD"+data.d.ID;
         			//addItematt(data.d.ID);
         			itemId = data.d.ID;
         			
         /*	if (document.getElementById("file").files.length === 0) {                     
           }       
           else
           { 
           debugger;
           var itemId =  data.d.ID;  
                var fileInput = $('#file');
                var fileCount = fileInput[0].files.length;  
                for(var i=0;i<fileCount;i++)
                {
                	var fileArray = [];
                    fileArray.push(fileInput[0].files[i]);
                    uploadFileSP("OtherExpenseClaims", itemId, fileArray, fileCount);
                }                               
                                
           }
           debugger;*/
       
         			readClaimDetails(claimID);
         			addClaimHistory(claimID);
         			bootbox.alert("Claim ID "+claimID+" submitted successfully.", function(){ 
    				window.location.href = "/sites/Finance/ExpenseClaimSystem/SitePages/MyClaims.aspx";
				}); 
                  },
                  error: function(data) {
                     // saveErrorList(pageName, 
                     //UserEmail, "savePurchaseDetails()", data.responseJSON.error.code);
                     alert("Error while submitting Claim \n"+data.responseJSON.error.code)
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
    var queryUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/lists/GetByTitle('" + listName + "')/items(" + id + ")/AttachmentFiles/add(FileName='" + file.name + "')";
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
              //alert ("Your item has been submitted successfully!");                    
            }
        },
        error: function (err) {                
            bootbox.alert("Some files failed to upload.");                
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

function readClaimDetails(claimID)
{
debugger;
var table = document.getElementById("tbAccountHead");
var rows = table.getElementsByTagName("tr");

for (var i = 0; i < rows.length-1; i++) {
            totalRowCount++;
            if (rows[i].getElementsByTagName("td").length > 0) {
            id= table.rows.item(i).cells.item(0).innerHTML.split('_')[0];
			/*accountHead = table.rows.item(i).cells.item(0).innerHTML;
			particulars = table.rows.item(i).cells.item(1).innerHTML;
			claimedAmount = table.rows.item(i).cells.item(2).innerHTML;
			fromDate = table.rows.item(i).cells.item(3).innerHTML;
			toDate= table.rows.item(i).cells.item(4).innerHTML;
			wbs = table.rows.item(i).cells.item(5).innerHTML;*/
			if(accountHead == "Business Promotion")
			{
				readBPDetails(claimID);
			}
			updateClaimDetailsList(claimID, id, "Pending");
			//addClaimDetails(claimID,accountHead,particulars,claimedAmount,wbs,fromDate,toDate);
             rowCount++;
            }
            
}
}

function updateClaimDetailsList(claimID, id, status)
{
$.ajax({
              url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaimDetails')/items("+id+")",
              type: "POST",
              async: false,
              data: JSON.stringify({
                  '__metadata': { type: "SP.Data.OtherExpenseClaimDetailsListItem" },
                  "ClaimID": claimID,
                  "Status": status,
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
                               /*    if (document.getElementById("file").files.length === 0) { }
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
                                   }  */                                                                                                                  
                            },
              error: function(data){
                                bootbox.alert("Error Occured while updating."+err)
                            }
          });

}


function addClaimDetails(claimID,accountHead,particulars,claimedAmount,wbs,fromDate,toDate)
{
debugger;
var item = {
                  "__metadata": {
                      "type": "SP.Data.OtherExpenseClaimDetailsListItem"
                  },
                  "ClaimID": claimID,
                  "AccountHead": accountHead,
                  "Particulars": particulars,
                  "ClaimedAmount": claimedAmount,
                  "WBSCode": wbs,
                  "FromDate":fromDate,
                  "ToDate": toDate,                                                                                                                                                                                                                                                                                                                                                                                          
                  };    

              $.ajax({
                  url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaimDetails')/items",
                  type: "POST",
                  async: false,
                  contentType: "application/json;odata=verbose",
                  data: JSON.stringify(item),
                  headers: {
                      "Accept": "application/json;odata=verbose",
                      "X-RequestDigest": $("#__REQUESTDIGEST").val()
                  },
                  success: function(data) {
         			                  },
                  error: function(data) {
                     // saveErrorList(pageName, UserEmail, "savePurchaseDetails()", data.responseJSON.error.code);
                     bootbox.alert("Error while submitting Claim Details \n"+data.responseJSON.error.code)
                  }
              });
}

function readBPDetails(claimID)
{
debugger;
var table = document.getElementById("tbBusinessPromotion");
var rows = table.getElementsByTagName("tr");

for (var i = 0; i < rows.length-1; i++) {
            totalRowCount++;
            if (rows[i].getElementsByTagName("td").length > 0) {
			name = table.rows.item(i).cells.item(0).innerHTML;
			IntEx = table.rows.item(i).cells.item(1).innerHTML;
			CompanyName = table.rows.item(i).cells.item(2).innerHTML;
			Designation = table.rows.item(i).cells.item(3).innerHTML;
			addBPDetails(claimID,name ,IntEx ,CompanyName ,Designation);
             rowCount++;
            }
            
}
} 

function addBPDetails(claimID,name ,IntEx ,CompanyName ,Designation)
{
debugger;
var prePost;
if(document.getElementById("rbtnPreApproval").checked)
prePost = "Pre Approval";
if(document.getElementById("rbtnPostApproval").checked)
prePost = "Post Approval";

var item = {
                  "__metadata": {
                      "type": "SP.Data.BusinessPromotionListItem"
                  },
                  "ClaimID": claimID,
                  "PrePost": prePost,
                  "ApprovalDate":  $('#txtApprovalDate').val(),
                  "ExpenseDate":  $('#txtBusinessExpenseDate').val(),
                  "ExpenseNature":  $('#ddlBusinessExpenseNature').val(),                                                                                                                            
                   "TotalExpenseAmount":  $('#txtTotalBusinessExpense').val(),
                  "MeetingPlace":  $('#txtMeetingPlace').val(),
                  "MeetingTitle":  $('#txtMeetingTitle').val(),
                  "Outcomes":  $('#txtEventOutcomes').val(), 
                  "Name": name ,
                  "IntEx": IntEx ,
                  "CompanyName": CompanyName ,
                  "Designation": Designation,                                                                                                                                                                                                                                                                                                                                                                          
                  };    

              $.ajax({
                  url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('BusinessPromotion')/items",
                  type: "POST",
                  async: false,
                  contentType: "application/json;odata=verbose",
                  data: JSON.stringify(item),
                  headers: {
                      "Accept": "application/json;odata=verbose",
                      "X-RequestDigest": $("#__REQUESTDIGEST").val()
                  },
                  success: function(data) {
         			                  },
                  error: function(data) {
                     // saveErrorList(pageName, UserEmail, "savePurchaseDetails()", data.responseJSON.error.code);
                     bootbox.alert("Error while submitting BP Details \n"+data.responseJSON.error.code)
                  }
              });
}


function addClaimHistory(claimID)
{
debugger;
var d = new Date();
var month = parseInt(d.getMonth())+1;
var todayDate = month +"/"+d.getDate()+"/"+d.getFullYear();
var item = {
                  "__metadata": {
                      "type": "SP.Data.OtherExpenseClaimHistoryListItem"
                  },
                  "ClaimID": claimID,
                  "ActionTakenBy": userName,
                  "Action": "Claim Submitted",
                  "Remarks":  $('#txtRemarks').val(), 
                  "ActionDate": todayDate,                                                                                                                                                                                                                                                                                                                                                                                    
                  };    

              $.ajax({
                  url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaimHistory')/items",
                  type: "POST",
                  async: false,
                  contentType: "application/json;odata=verbose",
                  data: JSON.stringify(item),
                  headers: {
                      "Accept": "application/json;odata=verbose",
                      "X-RequestDigest": $("#__REQUESTDIGEST").val()
                  },
                  success: function(data) {
					 mailToUser(claimID);
					 mailToApprover(claimID);
                  },
                  error: function(data) {
                     // saveErrorList(pageName, UserEmail, "savePurchaseDetails()", data.responseJSON.error.code);
                     bootbox.alert("Error while submitting Claim Details \n"+data.responseJSON.error.code)
                  }
              });

}

function mailToApprover(claimID)
{
to= $('#txtApproverEmail').val();
cc="";
subject = "Claim ID "+claimID+" pending for approval";
body ="<html><body>"+
"<table width='100%' border=3 style='border-color:white;font-weight: normal;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:13px;'>"+
"<tr><td colspan=4 style='background-color: #8e8b8b;padding-left: 1%; color:white; height: 40px;font-size:15px' valign='center'><b>Expense Claim System:</b> New Claim submitted</td></tr>"+
"<tr><td style='background-color:#7d7dda;padding-left: 1%; color:white; width:25%' valign='top'>CLAIMANT <br/><br/>Komal Takkar <br/><br/>IT<br/>Noida<br/>9971877286</td>"+
"<td style='background-color:#5ea25e;padding-left: 1%; color:white;width:25%' valign='top'>CLAIM ID <br/><br/>"+claimID+"</td>"+
"<td style='background-color:#bdb9b9;padding-left: 1%; color:white;width:25%' valign='top'>CLAIM CATEGORY<br/><br/>Other Expense Claim</td>"+
"<td style='background-color: #3f51b5; padding-left: 1%;color:white;width:25%' valign='top'>CLAIMED AMOUNT<br/><br/>"+document.getElementById('txtTotalClaimedINR').innerHTML+"</td></tr>"+
"<tr><td colspan=4 style='background-color:white;padding-left: 1%; color:black; height:35px;' valign=center><b>Claim Date: 09/08/2020</b></td></tr>"+
"<tr><td colspan=4 style='background-color:white;padding-left: 1%; color:black'><br/>Dear User,<br/><br/>Claim ID CCD243 is pending at Preeti Kanwar for approval.<br/><br/>"+ "<a href='http://nti-it-d-sp-01:5555/sites/Finance/ExpenseClaimSystem/SitePages/MyClaims.aspx'>Click Here</a> to view all claims.<br/><br/>Thank you.<br/><br/>Regards,<br/>Finance Team<br/></td></tr>"+
"<tr><td colspan=4 style='font-size:14px; background-color: #dcd8d8; padding-left: 1%;color:black;height: 30px;' valign='center'> Please raise a ticket at <a href='https://ntichikettoseva.nectechnologies.in'>NECTI IT Helpdesk</a> in case you face any issue"+ "while accessing the Portal.</td></tr>"+
"</table></body></html>";

sendEmail("noreply@india.nec.com", to, cc, body, subject);

}

function mailToUser(claimID)
{
debugger;
to= userEmail;
cc="";
subject = "Claim ID "+claimID+" submitted successfully";
//body="<p>Dear "+userName+",<br/><br/>Claim Request "+claimID+ " has been submitted successfully.<br/><a href='"+_spPageContextInfo.webAbsoluteUrl +"/SitePages/MyClaims.aspx'>Click Here<a> to view details.<br><br>Regards,<br>Expense Claim System</p>";
body ="<html><body>"+
"<table width='100%' border=3 style='border-color:white;font-weight: normal;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:13px;'>"+
"<tr><td colspan=4 style='background-color: #8e8b8b;padding-left: 1%; color:white; height: 40px;font-size:15px' valign='center'><b>Expense Claim System:</b> New Claim submitted</td></tr>"+
"<tr><td style='background-color:#7d7dda;padding-left: 1%; color:white; width:25%' valign='top'>CLAIMANT <br/><br/>Komal Takkar <br/><br/>IT<br/>Noida<br/>9971877286</td>"+
"<td style='background-color:#5ea25e;padding-left: 1%; color:white;width:25%' valign='top'>CLAIM ID <br/><br/>"+claimID+"</td>"+
"<td style='background-color:#bdb9b9;padding-left: 1%; color:white;width:25%' valign='top'>STATUS<br/><br/>Pending</td>"+
"<td style='background-color: #3f51b5; padding-left: 1%;color:white;width:25%' valign='top'>PENDING WITH<br/><br/>Preeti Kanwar</td></tr>"+
"<tr><td colspan=4 style='background-color:white;padding-left: 1%; color:black; height:35px;' valign=center><b>Claim Date: 09/08/2020</b></td></tr>"+
"<tr><td colspan=4 style='background-color:white;padding-left: 1%; color:black'><br/>Dear User,<br/><br/>Claim ID CCD243 is submitted successfully.<br/><br/>"+ "<a href='http://nti-it-d-sp-01:5555/sites/Finance/ExpenseClaimSystem/SitePages/MyClaims.aspx'>Click Here</a> to view all claims.<br/><br/>Thank you.<br/><br/>Regards,<br/>Finance Team<br/></td></tr>"+
"<tr><td colspan=4 style='font-size:14px; background-color: #dcd8d8; padding-left: 1%;color:black;height: 30px;' valign='center'> Please raise a ticket at <a href='https://ntichikettoseva.nectechnologies.in'>NECTI IT Helpdesk</a> in case you face any issue"+ "while accessing the Portal.</td></tr>"+
"</table></body></html>";
sendEmail("noreply@india.nec.com", to, cc, body, subject);
}
//send mail
	function sendEmail(from, to, cc, body, subject) {
	to = "komal.takkar@india.nec.com";
	cc = "";
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
					
	            },
	            error: function(err) {
					saveErrorList(pageName, loggedInUserEmail, "sendEmail()", err);
	            }
	        });
	        }

