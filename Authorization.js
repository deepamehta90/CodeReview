var loggedInUserName = "";
var loggedInUserEmail = "";
var totClaimedAMount = 0;
count =0;
$(document).ready(function () {
	GetEmployeeDetailofLogUser();
	
	$(document).on('click','#MyTelephoneClaims',function(e){
window.location.href = "/sites/Finance/ExpenseClaimSystem/SitePages/AuthorizationMobile.aspx";
});

	
	var modal = document.getElementById("myModal");
	var span = document.getElementsByClassName("close")[0];
			
	window.onclick = function(event) {
	  if (event.target == modal) {
	    modal.style.display = "none";
	  }
	}
	
	
	span.onclick = function() {
	  modal.style.display = "none";
	}

})

function GetEmployeeDetailofLogUser()
{
		var firstName = "";
		var lastName = "";
		$.ajax({  
		url: _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties?$select=UserProfileProperties",
		async: false,  
		headers: { Accept: "application/json;odata=verbose" },  
		success: function (data) {
				loggedInUserEmail =  data.d.Email;
			    loggedInUserName = data.d.DisplayName;	
			    
var properties = data.d.UserProfileProperties.results;

for (var i = 0; i < properties.length; i++) {  

                        var property = properties[i];
                        if (property.Key == "PreferredName") {      //Changed here to display name
                            loggedInUserName = property.Value;  
                       }

                        if (property.Key == "WorkEmail") { 
                         loggedInUserEmail = property.Value;  
                       }

                     }
		
				if(loggedInUserEmail == ""){
					bootbox.alert("Email ID is blank. Kindly raise a ticket at NECTI ID Helpdesk.");
					return;
				}
				else
				{
				//checkDelegation(loggedInUserEmail);
				loadTable();
				}
		},  
		error: function (jQxhr, errorCode, errorThrown) 
			{  
			}  
		});
} 

function loadTable(){
var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaims')/items?$filter=(substringof('"+loggedInUserEmail +"',PendingWithEmail) and Status eq 'Pending' and PendingWith eq 'Authorization')&$top=5000";
    tableContent = "";
    tableContents = "";
    var accountHeadDetails = "";
    var tableContentForReport="";
    $.ajax({
        url: requestUri,
        async: false,
        type: "GET",
        headers: {
            "accept": "application/json; odata=verbose"
        },
        success: function(data) {
            var objItems = data.d.results;
            if(data.d.results.length != 0)
            {
            document.getElementById("note").style.display = "none";
            document.getElementById("buttonRow").style.display = "block";
            document.getElementById("MyClaims").style.display = "block";
            tableContents = '<table id="example" class="display table-bordered" style="width:100%;"><thead><tr><th scope="col"></th><th scope="col">Claim ID</th><th scope="col">Account Head Details</th><th scope="col">Manager\'s Remarks</th><th scope="col">Employee Name</th><th scope="col">Claim Date</th><th scope="col">Claimed INR</th><th scope="col">View Claim</th>';
            tableContents += '</tr></thead><tbody>';
            
            for (var i = 0; i < objItems.length; i++) {
            	var mgrID = "mgr"+objItems[i].ID;
            		tableContent += '<tr>';
	            	tableContent += '<td><input type="checkbox" name="checkboxClaim"></td>';
	
	            	if(objItems[i].ID != null && objItems[i].ID != "" ){
	            		tableContent += '<td>' + 'CCD'+objItems[i].ID + '</td>';
	            		accountHeadDetails = GetAccountHeadDetails("CCD"+objItems[i].ID);
	            	}else{
	            		tableContent += '<td></td>';
	            	}
	            	
	            	//account head details
	            	if(accountHeadDetails != ""){
	            		tableContent += "<td>" +accountHeadDetails+ "</td>";
	            	}else{
	            		tableContent += '<td><table class="table table-bordered"><thead><tr><th>Account Head(s)</th><th>Particular(s)</th><th>Claimed Amount</th><th>Approved Amount</th></tr></thead><tbody><tr>No contents available</tr></tbody></table></td>';
	            	}
	            	
	            	//manager's remark
	            	tableContent += '<td><textarea rows="4" class="managersArea" id="'+mgrID+'"></textarea></td>';
	            	
	            						if(objItems[i].EmpName != null && objItems[i].EmpName != "" ){
	            		tableContent += '<td>' + objItems[i].EmpName + '</td>';
	            	}else{
	            		tableContent += '<td></td>';
	            	}

	          	    if(objItems[i].ClaimDate != null & objItems[i].ClaimDate != ""){
	            		tableContent += '<td>' + objItems[i].ClaimDate + '</td>';
	            	}else{
	            		tableContent += '<td></td>';
	            	}
	            	
	            	//claimed amount
	            	 if(objItems[i].TotalClaimedAmount != null & objItems[i].TotalClaimedAmount != ""){
	            		tableContent += '<td>' + objItems[i].TotalClaimedAmount + '</td>';
	            	}else{
	            		tableContent += '<td></td>';
	            	}
	            	
	            	//view claim
	            	if(objItems[i].ID != null && objItems[i].ID != "" ){
	            		tableContent += '<td><a href="/sites/Finance/ExpenseClaimSystem/SitePages/ViewOtherExpense.aspx?Approver?'+objItems[i].ID+'" target="blank"><i class="fa fa-eye" aria-hidden="true" style="font-size: 16px;"></i></a></td>';
	            	//tableContent += '<td></td>';
	            	}else{
	            		tableContent += '<td></td>';
	            	}

					
					//attachment
					debugger;
	            /*	if(objItems[i].Attachments == true){
                		tableContent += '<td><a class="downloadFiles"><u>View Attachments</u></a></td>';                	
                	}else{
                		tableContent += '<td>No attachments</td>';
                	}*/
					
					tableContent += '</tr>';
            }
            }
            else
            {
            	document.getElementById("note").style.display = "block";
            document.getElementById("buttonRow").style.display = "none";
            document.getElementById("MyClaims").style.display = "none";
            }
        },
        error: function(data) {
            bootbox.alert("Error occured");
        }
    })
    
    tableContent += '</tbody>'; 
    tableContent += '</table>';  
    tableContents += tableContent;         
    $('#formGrid2').append(tableContents);
     
var table = $('#example').DataTable( {
	 responsive: true,
	"bDestroy": true,
	"bProcessing": true,
	"lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
	"autoWidth": false,
	"bSort" : false,
	 } );
	}
	
$(document).on('click','.downloadFiles',function(){
						$("#fileAttached").html('');
						var attachmentFiles = "";
                		var $row = $(this).closest("tr");    // Find the row
                		//var $innerRow = $row.closest('tr').find(".account-head-details tr");
                		debugger;		
                	//	Toremove = $innerRow.find("td:nth-child(2)").text();		    
					//	ID = $row.find("td:nth-child(2)").text().split('D')[1].split(Toremove)[0];
						//alert(ID);
						//alert(Toremove);
						Toremove = $row.find("td:nth-child(1)").text();		    
						var name = attachementFetch(Toremove);
						
						attachmentFiles += '<ol type="1">';
						for(var i=0; i<name.length; i++){
							attachmentFiles += '<li><a href="' + name[i].ServerRelativeUrl  + '">'+ name[i].FileName + '</a></li>';
							//attachmentFiles += '<br>';
						}
						attachmentFiles += '</ol>';

						$("#fileAttached").append(attachmentFiles);
						//$("#myModal").toggle();
						 bootbox.alert(""+attachmentFiles+"", function(){ 
    				//window.location.href = "/sites/Finance/ExpenseClaimSystem/SitePages/MyClaims.aspx";
				});

                	})
	
                	
function attachementFetch(id) {
              var image = [];
			var call = $.ajax({
			        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaims')/items(" + id + ")/AttachmentFiles",
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
	
/*
$(document).on('click','#btnReject',function(){
	var grid = document.getElementById("example");
	var checkBoxes = grid.getElementsByTagName("INPUT");
	var message ="";
	var LengthCheckBox=checkBoxes.length;
	var a=true;
	var claimsRejected ="";
	if($('input[name="checkboxClaim"]').is(':checked')){
	for (var i = 0; i < checkBoxes.length; i++) {
	if (checkBoxes[i].checked) {
		a=false;
		var row = checkBoxes[i].parentNode.parentNode;
		message = "   " + row.cells[0].innerHTML;
		var claimID = (row.cells[1].innerHTML).split("D")[1];
		
		var managerRemarks = document.getElementById("mgr"+claimID).value;
		if(managerRemarks == "")
		{
		bootbox.alert("Kindly enter remarks.")
		return;
		}
		else
		{
		claimsRejected = claimsRejected +", "+row.cells[1].innerHTML;
		//alert(claimID+managerRemarks )
		$(".modal1").show();
						setTimeout(function() {
		UpdateClaim(claimID,managerRemarks,"Rejected","0");
		 }, 100);
		}		
	}
	}
	bootbox.alert("Claim(s) rejected successfully).", function(){
	location.reload(); 
	});
	}
	else
	{
	bootbox.alert("Kindly select atleast one Claim ID");
	}
})

$(document).on('click','#btnReferBack',function(){
	var grid = document.getElementById("example");
	var checkBoxes = grid.getElementsByTagName("INPUT");
	var message ="";
	var LengthCheckBox=checkBoxes.length;
	var a=true;
	var claimsRejected ="";
	if($('input[name="checkboxClaim"]').is(':checked')){
	for (var i = 0; i < checkBoxes.length; i++) {
	if (checkBoxes[i].checked) {
		a=false;
		var row = checkBoxes[i].parentNode.parentNode;
		message = "   " + row.cells[0].innerHTML;
		var claimID = (row.cells[1].innerHTML).split("D")[1];
		
		var managerRemarks = document.getElementById("mgr"+claimID).value;
		if(managerRemarks == "")
		{
		bootbox.alert("Kindly enter remarks.");
		return;

		}
		else
		{
		claimsRejected = claimsRejected +", "+row.cells[1].innerHTML;
		//alert(claimID+managerRemarks )
		$(".modal1").show();
						setTimeout(function() {
		UpdateClaim(claimID,managerRemarks,"Referred Back","0");
		 }, 100);
		}		
	}
	}
	bootbox.alert("Claim(s) "+claimsRejected +" referred back successfully).", function(){ 
	location.reload(); });
	}
	else
	{
	bootbox.alert("Kindly select atleast one Claim ID");
	}
}) */

$(document).on('click','#btnReject',function(){

	var grid = document.getElementById("example");
	var checkBoxes = grid.getElementsByTagName("INPUT");
	var message ="";
	//var LengthCheckBox=checkBoxes.length;
	var a=true;
	var claimsRejected ="";
	if($('input[name="checkboxClaim"]').is(':checked')){
	checkBoxLength = $("input[name='checkboxClaim']:checked").length;
	for (var i = 0; i < checkBoxes.length; i++) {
	if (checkBoxes[i].checked) {
		a=false;
		var row = checkBoxes[i].parentNode.parentNode;
		message = "   " + row.cells[0].innerHTML;
		var claimID = (row.cells[1].innerHTML).split("D")[1];
		var managerRemarks = document.getElementById("mgr"+claimID).value;
		if(managerRemarks == "")
		{
		bootbox.alert("Kindly enter remarks.", function(){ 
	location.reload(); });

		return;
		}
		else
		{
		claimsRejected = claimsRejected +", "+row.cells[1].innerHTML;
		//alert(claimID+managerRemarks )
		$(".modal1").show();
		setTimeout(function() {
		checkStatus(claimID,managerRemarks,"Rejected","0",count,checkBoxLength);
		 }, 100);
		}		
	}
	}
	}
	else
	{
	bootbox.alert("Kindly select atleast one Claim ID");
	}
})

$(document).on('click','#btnReferBack',function(){
//count =0;
	var grid = document.getElementById("example");
	var checkBoxes = grid.getElementsByTagName("INPUT");
	var message ="";
	//var LengthCheckBox=checkBoxes.length;
	var a=true;
	var claimsRejected ="";
	if($('input[name="checkboxClaim"]').is(':checked')){
	checkBoxLength = $("input[name='checkboxClaim']:checked").length;
	for (var i = 0; i < checkBoxes.length; i++) {
	if (checkBoxes[i].checked) {
	
		a=false;
		var row = checkBoxes[i].parentNode.parentNode;
		message = "   " + row.cells[0].innerHTML;
		var claimID = (row.cells[1].innerHTML).split("D")[1];
		
		var managerRemarks = document.getElementById("mgr"+claimID).value;
		if(managerRemarks == "")
		{
		bootbox.alert("Kindly enter remarks.", function(){ 
	location.reload(); });

		return;
		}
		else
		{
		claimsRejected = claimsRejected +", "+row.cells[1].innerHTML;
		//alert(claimID+managerRemarks )
		$(".modal1").show();
						setTimeout(function() {
		checkStatus(claimID,managerRemarks,"Referred Back","0",count,checkBoxLength);
		 }, 100);
		}		
	}
	}
	}
	else
	{
	bootbox.alert("Kindly select atleast one Claim ID");
	}
})
function checkStatus(claimID,managerRemarks,Status,approvedamount,count, checkboxLength)
{	
debugger;	
$.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaims')/items?$filter=ID eq '"+claimID+"'&$top=4999",
        async: false,
        type: "GET",
        headers: {        	
            "accept": "application/json; odata=verbose"
        },
        success: function(data) {
        	var objItems = data.d.results;
        	debugger;
        	if(objItems.length == 1)
        	{
				currentPendingWith =  data.d.results[0].PendingWithEmail.split('-')[0];
				status = data.d.results[0].Status;
				if(status == "Pending" && loggedInUserEmail.toLowerCase() == currentPendingWith.toLowerCase())
				{
					count++;
		        		UpdateClaim(claimID,managerRemarks,Status,"0");
        		}
        		else
        		{
        		bootbox.alert("The selected claim CCD "+claimID+" is not pending at you.).", function(){ 
				location.reload();  });
        		}
        	}//end of if greater zero item
        	
        	if(count == checkBoxLength)
		   {
						bootbox.alert(Status+" successfully.", function(){ 
				location.reload();});
		   }
         },//end of success
        error: function(err) {
             bootbox.alert("Error Occured while submitting."+err)
        }
        });
}



function UpdateClaim(claimID,managerRemarks,status,approvedamt){
		var item = {
		    "__metadata": {
		        "type": "SP.Data.OtherExpenseClaimsListItem"
		    },
		   	"Status": status,
		   	"TotalApprovedAmount":approvedamt ,       
	    };
	    
	    $.ajax({
			url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaims')/items(" + claimID + ")",
			type: "POST",
			async: false,
			contentType: "application/json;odata=verbose",
			data: JSON.stringify(item),                    
			headers: {
					"Accept": "application/json;odata=verbose",
					"X-RequestDigest": $("#__REQUESTDIGEST").val(),
					"IF-MATCH": "*",
					"X-HTTP-Method":"MERGE",
				},                    
			success: function(data) {
				addtoHistory("CCD"+claimID,loggedInUserName,status,managerRemarks);    					
			},
			error: function(data) {
						console.log(data);
			}
		
		});

}

function addtoHistory(claimID,loggedInUserName, status,managerRemarks)
{
var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaimHistory')/items";

var item = {
                  "__metadata": {
                      "type": "SP.Data.OtherExpenseClaimHistoryListItem"
                  },
                  "ClaimID": claimID,
                  "ActionTakenBy": loggedInUserName,
                  "Action": status,
                  "Remarks": managerRemarks,
                  "TotalApprovedAmount": "0",
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

                  },
                  error: function(err) {
                  bootbox.alert("Error Occured while submitting."+err)
                  }
              });

}

/*$(document).on('click','#btnApprove',function(){
var count = 0;
var remarksClaims="";
var approvedclaims="";
debugger;
	var isRemarksFilled = true;
		   var checkBoxLength; 	
		   var msg;
	if($('input[name="checkboxClaim"]').is(':checked')){
	
		$("input[name='checkboxClaim']:checked").each(function(){
			    var row = $(this).closest("tr")[0];
		    var claimID = (row.cells[1].innerHTML).split("D")[1];
			totClaimedAMount = parseInt(row.cells[6].innerHTML);
			//alert(totClaimedAMount )
		    checkBoxLength = $("input[name='checkboxClaim']:checked").length;
				    $(this).closest('tr').find(".account-head-details tr").filter(function () {
		   
		      //$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		      	var accountHead = $(this).find('td.accountHeadName').text();
				var particulars = $(this).find('td.particulars').text();
				var claimedAmount = $(this).find('td.claimedAmount').text();
				var approvedAmount = $(this).find('input.approvedAmount').val();
				//approveClaim(claimID, accountHead, particulars, claimedAmount, approvedAmount, checkBoxLength, this);
				
				if(typeof approvedAmount != "undefined" && claimedAmount != approvedAmount){
					if($('.managersArea').val() == ""){
						//bootbox.alert("Please enter Manager's remarks.!");
						remarksClaims= remarksClaims + ",CCD"+claimID;
						msg ="\n"+remarksClaims+"Please enter Manager's remarks.";
						isRemarksFilled = false;
						return;
					}
					else{
							if(accountHead != "" || particulars != "" || claimedAmount != "" || (typeof approvedAmount != 									"undefined" && approvedAmount != "")){
							count++;
							approvedclaims = approvedclaims+", CCD"+claimID;
							msg ="\n"+approvedclaims +" Claim(s) approved successfully";
							 deleteClaimDetails("CCD"+claimID);
							saveOtherExpenseClaimDetails("CCD"+claimID, accountHead, particulars, claimedAmount, 											approvedAmount);
							}
					}
				}
				else
				{
					if(accountHead != "" || particulars != "" || claimedAmount != "" || (typeof approvedAmount != 									"undefined" && approvedAmount != "")){
							count++;
														approvedclaims = approvedclaims+", CCD"+claimID;
							msg ="Claim(s) approved successfully";
							 deleteClaimDetails("CCD"+claimID);
							saveOtherExpenseClaimDetails("CCD"+claimID, accountHead, particulars, claimedAmount,approvedAmount);
							}

				}
		   });
		    if(isRemarksFilled == true){
		    	$(".modal1").show();
						setTimeout(function() {
		  
		   approveClaim(this, claimID, count, checkBoxLength,totClaimedAMount ); 
		   }, 100);
		   
		    }	
		});
		
		if(msg.includes("remarks") && msg.includes("successfully"))
		{
		bootbox.alert("Please enter remarks for "+remarksClaims+"\n "+approvedclaims + " approved successfully.).", function(){ 
		location.reload(); });
		}
		else if(msg.includes("successfully"))
		{
				bootbox.alert(""+approvedclaims +" Claim(s) approved successfully).", function(){ 
		location.reload();});
		}
		else if(msg.includes("remarks"))
		{
				bootbox.alert("Please enter remarks for "+remarksClaims+").", function(){ 
		location.reload();});
		}

		else{}
	}
	else{
		bootbox.alert("Please select at least one claim id!");
	}	
	})*/
	
	$(document).on('click','#btnApprove',function(){
var count = 0;
var remarksClaims="";
var approvedclaims="";
debugger;
	var isRemarksFilled = true;
		   var checkBoxLength; 	
		   var msg;
	if($('input[name="checkboxClaim"]').is(':checked')){
	
		$("input[name='checkboxClaim']:checked").each(function(){
			    var row = $(this).closest("tr")[0];
		    var claimID = (row.cells[1].innerHTML).split("D")[1];
		    //var claimID = (row.cells[1].innerHTML).split("D")[1];
		//alert(claimID);
		var managerRemarks = document.getElementById("mgr"+claimID).value;

		   //  var managerRemarks = row.cells[3].innerHTML;
			totClaimedAMount = parseInt(row.cells[6].innerHTML);
			//alert(totClaimedAMount )
		    checkBoxLength = $("input[name='checkboxClaim']:checked").length;
				$(this).closest('tr').find(".account-head-details tr").filter(function () {
		   
		      //$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		      var DetailsID = $(this).find('td.accountHeadID').text();
		    // alert(DetailsID)
		      	var accountHead = $(this).find('td.accountHeadName').text();
		      	//alert(accountHead)
				var particulars = $(this).find('td.particulars').text();
				//alert(particulars)
				var claimedAmount = $(this).find('td.claimedAmount').text();
				//alert(claimedAmount )
				var approvedAmount = $(this).find('input.approvedAmount').val();
				//alert(approvedAmount )
				//approveClaim(claimID, accountHead, particulars, claimedAmount, approvedAmount, checkBoxLength, this);
					if(typeof approvedAmount != "undefined" && approvedAmount == ""){
					//alert("in blank")
					msg ="Approved amount cannot be blank.";
						isRemarksFilled = false;
						return;
					}
					else if(parseInt(claimedAmount) < parseInt(approvedAmount)){
					msg =msg +"Approved amount cannot be greater than claimed amount.";
						isRemarksFilled = false;
						return;
					}
					else if(parseInt(approvedAmount) < parseInt(claimedAmount)){
					if(managerRemarks == ""){
						//bootbox.alert("Please enter Manager's remarks.!");
						remarksClaims= remarksClaims + ",CCD"+claimID;
						msg =msg + "\n"+remarksClaims+"Please enter Manager's remarks.";
						isRemarksFilled = false;
						return;
					}					
					else{
							if(accountHead != "" || particulars != "" || claimedAmount != "" || (typeof approvedAmount != 									"undefined" && approvedAmount != "")){
							if(isRemarksFilled == false)
							isRemarksFilled = false;
							else{
							//count++;
							isRemarksFilled = true;
							approvedclaims = approvedclaims+", CCD"+claimID;
							msg =msg +"\n"+approvedclaims +" Claim(s) approved successfully";
							
							// deleteClaimDetails("CCD"+claimID);
							//saveOtherExpenseClaimDetails("CCD"+claimID, accountHead, particulars, claimedAmount,approvedAmount);
							UpdateClaimDetails(DetailsID , accountHead, particulars, claimedAmount,approvedAmount);}
							}
					}
				}
				else
				{
					if(accountHead != "" || particulars != "" || claimedAmount != "" || (typeof approvedAmount != 									"undefined" && approvedAmount != "")){
							if(isRemarksFilled == false)
							isRemarksFilled = false;
							else{
							//count++;
							isRemarksFilled = true;
							approvedclaims       = approvedclaims+", CCD"+claimID;
							msg =msg +"\n"+approvedclaims +" Claim(s) approved successfully";
							
							// deleteClaimDetails("CCD"+claimID);
							//saveOtherExpenseClaimDetails("CCD"+claimID, accountHead, particulars, claimedAmount,approvedAmount);
							UpdateClaimDetails(DetailsID , accountHead, particulars, claimedAmount,approvedAmount);}
							}

				}
		   });
		    if(isRemarksFilled == true){
		    	$(".modal1").show();
						setTimeout(function() {
						
		   approveClaim(this, claimID, count, checkBoxLength,totClaimedAMount ); 
		   
		   
		   }, 100);
		   
		    }	
		});
		
		if(msg.includes("remarks") && msg.includes("successfully"))
		{
		bootbox.alert("Remarks are mandatory if approved amount is different from claimed amount.", function(){ 
		location.reload(); });
		}
		else if(msg.includes("blank"))
		{
		bootbox.alert("Approved amount cannot be blank", function(){ 
		location.reload(); });
		}
		else if(msg.includes("greater"))
		{
		bootbox.alert("Approved amount cannot be greater than claimed amount.", function(){ 
		location.reload(); });
		}
		else if(msg.includes("remarks"))
		{
				bootbox.alert("Remarks are mandatory if approved amount is different from claimed amount.", function(){ 
		location.reload();});
		}

		else{}
	}
	else{
		bootbox.alert("Please select at least one claim id!");
	}	
	})

function UpdateClaimDetails(ID, accountHead, particulars, claimedAmount,approvedAmount){
var total = 0;
		var item = {
		    "__metadata": {
		        "type": "SP.Data.OtherExpenseClaimDetailsListItem"
		    },
		   	"AccountHead":accountHead,
		   	"Particulars":particulars,  
		   	"ClaimedAmount":claimedAmount,
		   	"ApprovedAmount":approvedAmount,     
	    };
	    
	    $.ajax({
			url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaimDetails')/items(" + ID+ ")",
			type: "POST",
			async: false,
			contentType: "application/json;odata=verbose",
			data: JSON.stringify(item),                    
			headers: {
					"Accept": "application/json;odata=verbose",
					"X-RequestDigest": $("#__REQUESTDIGEST").val(),
					"IF-MATCH": "*",
					"X-HTTP-Method":"MERGE",
				},                    
			success: function(data) {
			debugger;
				   total =total + parseInt(approvedAmount);
				  // alert(total);
			},
			error: function(data) {
			
						console.log(data);
			}
		
		})

}

	
	
	function deleteClaimDetails(claimID)
	{
	debugger;
var requestUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaimDetails')/items?$filter=ClaimID eq '"+claimID+"'&$top=4999";

var tableContent = "";
var tableContents = "";
var tableContentForReport="";
$.ajax({
        url: requestUrl,
        async: false,
        type: "GET",
        headers: {        	
            "accept": "application/json; odata=verbose"
        },
        success: function(data) {
        	var objItems = data.d.results;
        	if(objItems.length > 0)
        	{
        		for(var i=0;i<objItems.length;i++)
        		{
        			var detailsID = data.d.results[i].ID;
        			$.ajax({  
            		url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaimDetails')/items(" + detailsID + ")",  
            type: "POST",  
            contentType: "application/json;odata=verbose",  
            headers: {  
                "Accept": "application/json;odata=verbose",  
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),  
                "IF-MATCH": "*",  
                "X-HTTP-Method": "DELETE",  
            },  
            success: function(data) {  
              },  
            error: function(data) {  
                bootbox.alert("failed");  
            }  
        });//end of inner ajx
        		}//end of for
        	}//end of if greater zero item
         },//end of success
        error: function(err) {
             bootbox.alert("Error Occured while submitting."+err)
        }
        });
}
 
function approveClaim(ev, claimID, count, checkBoxLength,totClaimedAMount ){
		debugger;
		var pendingWith = "Approved";
		var pendingWithEmail = "Approved";
		
$.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaims')/items?$filter=ID eq '"+claimID+"'&$top=4999",
        async: false,
        type: "GET",
        headers: {        	
            "accept": "application/json; odata=verbose"
        },
        success: function(data) {
        	var objItems = data.d.results;
        	debugger;
        	if(objItems.length == 1)
        	{
				currentPendingWith =  data.d.results[0].PendingWithEmail.split('-')[0].trim();
				L4Approver = data.d.results[0].L4Approver;
				L4approverEmail = data.d.results[0].L4ApproverEmail;
				status = data.d.results[0].Status;
				if(status == "Pending" && loggedInUserEmail.toLowerCase() == currentPendingWith.toLowerCase())
				{
				count++;
				    approveinOtherExpense(ev, claimID, count, checkBoxLength,totClaimedAMount,pendingWith,pendingWithEmail)
        		}
        		else
        		{
        		bootbox.alert("The selected claim CCD "+claimID+" is not pending at you.).", function(){ 
				location.reload();  });
        		}
        	}//end of if greater zero item
        	
        	if(count == checkBoxLength)
		   {
				bootbox.alert("Approved successfully.", function(){ 
				location.reload();});
		   }

         },//end of success
        error: function(err) {
             bootbox.alert("Error Occured while submitting."+err)
        }
        });


}

function approveinOtherExpense(ev, claimID, count, checkBoxLength,totClaimedAMount,pendingWith,pendingWithEmail)
{


		var item = {
		    "__metadata": {
		        "type": "SP.Data.OtherExpenseClaimsListItem"
		    },
		   	 "PendingWith": pendingWith ,
		    "PendingWithEmail":pendingWithEmail , 
		    "Status":"Approved",      
	    };
	    
	    $.ajax({
			url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaims')/items(" + claimID + ")",
			type: "POST",
			async: false,
			contentType: "application/json;odata=verbose",
			data: JSON.stringify(item),                    
			headers: {
					"Accept": "application/json;odata=verbose",
					"X-RequestDigest": $("#__REQUESTDIGEST").val(),
					"IF-MATCH": "*",
					"X-HTTP-Method":"MERGE",
				},                    
			success: function(data) {
						
						
						var row = $(ev).closest("tr")[0];
						//var claimID = row.cells[1].innerHTML;
					    //var splittedClaimID = (row.cells[1].innerHTML).split("D")[1];
						
					    $(ev).closest('tr').find(".account-head-details tr").filter(function () {

					      //$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
					      	var accountHead = $(this).find('td.accountHeadName').text();
							var particulars = $(this).find('td.particulars').text();
							var claimedAmount = $(this).find('td.claimedAmount').text();
							var approvedAmount = $(this).find('input.approvedAmount').val();
							debugger;ft
							if(accountHead != "" || particulars != "" || claimedAmount != "" || (typeof approvedAmount != "undefined" && approvedAmount != "")){
							count++;
								//saveOtherExpenseClaimDetails("CCD"+claimID, accountHead, particulars, claimedAmount, approvedAmount);
							}
					    });
					    debugger;
					
			},
			error: function(data) {
						console.log(data);
			}
		
		});

}

function saveOtherExpenseClaimDetails(claimID, accountHead, particulars, claimedAmount, approvedAmount) {
	
	var countOtherExpenseSave = 0;
	
	var item = {
        "__metadata": {
            "type": "SP.Data.OtherExpenseClaimDetailsListItem"
        },
        "ClaimID": claimID,
        "AccountHead": accountHead,
        "Particulars": particulars,
        "ClaimedAmount": claimedAmount,
        "ApprovedAmount": approvedAmount,
                
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
        	countOtherExpenseSave++;
        		        	
        },
        error: function(data) {
            console.log("Error occured in save()");
            

        }

    });
}


function GetAccountHeadDetails(claimID){
debugger;
var accountDetailHTML = "";
//var arrayAccountDetail = [];
	$.ajax({
    url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('OtherExpenseClaimDetails')/items?$select=*&$filter=ClaimID eq '" + claimID + "'",
    type: "GET",
    async: false,
    headers: {
        "Accept": "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        "X-RequestDigest": $("#__REQUESTDIGEST").val(),
        "IF-MATCH": "*",
        "X-HTTP-Method": null
    },
    cache: false,
    success: function(data) {
    	var objItems = data.d.results;
        var leng = objItems.length;
   		accountDetailHTML += '<table id="AccountHeadTable" class="table table-bordered account-head-details" style="table-layout:fixed;" ><thead><tr><th class="hide_column">ID</th><th>Account Head(s)</th><th >Particular(s)</th><th>Claimed Amount</th><th>Approved Amount</th><th>Attachment</th></tr></thead><tbody>';
   		 
        if (leng != 0) {
        	for(var i=0; i<leng; i++){
 				accountDetailHTML += '<tr>';
 				if(objItems[i].ID != null & objItems[i].ID != ""){
            		accountDetailHTML += '<td class="accountHeadID hide_column">' + objItems[i].ID + '</td>';
            	}else{
            		accountDetailHTML += '<td></td>';
            	}

 				if(objItems[i].AccountHead != null & objItems[i].AccountHead != ""){
            		accountDetailHTML += '<td class="accountHeadName">' + objItems[i].AccountHead + '</td>';
            	}else{
            		accountDetailHTML += '<td></td>';
            	}
            	
            	if(objItems[i].Particulars != null & objItems[i].Particulars != ""){
            		accountDetailHTML += '<td class="particulars">' + objItems[i].Particulars + '</td>';
            	}else{
            		accountDetailHTML += '<td></td>';
            	}
				
				if(objItems[i].ClaimedAmount != null & objItems[i].ClaimedAmount != ""){
            		accountDetailHTML += '<td class="claimedAmount">' + objItems[i].ClaimedAmount + '</td>';
            		accountDetailHTML += '<td><input type="text" value="'+ objItems[i].ClaimedAmount +'" class="approvedAmount" maxlength="8" style="width: 100%;" onkeypress="return validatenumerics(event);"/></td>';
            	}else{
            		accountDetailHTML += '<td></td><td></td>';
            	}
            	
            	if(objItems[i].ClaimedAmount != null & objItems[i].ID != ""){
            		accountDetailHTML += '<td><i class="fa fa-file-text downloadFiles" aria-hidden="true" style="font-size:18px;"></i></td>';
                     	}else{
            		accountDetailHTML += '<td></td><td></td>';
            	}

            	
            	accountDetailHTML += '</tr>';

        	}
        }else{
        	accountDetailHTML += '<tr><td colspan="4" style="text-align:center;">No items present</td></tr>';

        }
        accountDetailHTML += '</tbody></table>';       	
    },
    error: function(data) {
     }
})

return accountDetailHTML;

}

function validatenumerics(key) {
           //getting key code of pressed key
           var keycode = (key.which) ? key.which : key.keyCode;
           //comparing pressed keycodes

           if (keycode > 31 && (keycode < 48 || keycode > 57)) {
              // alert(" You can enter only characters 0 to 9 ");
               return false;
           }
           else return true;
}   
//To fetch attachment if present.  
function attachmentFetch(id, listName) {
    var image = "";
    //SOPEmployeeProfile
	var call = $.ajax({
	        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('"+listName+"')/items(" + id + ")/AttachmentFiles",
	        type: "GET",
	        dataType: "json",
			async: false,
	        headers: {
				"accept": "application/json; odata=verbose"
	        },
	    });
	
	    call.done(function (data,textStatus, jqXHR){
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
	            
	    });
	return image;

}
//end of attachmentFetch() function.


